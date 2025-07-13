// src/app/crowd-sourced-intel/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeVideoVeracity } from "@/ai/flows/analyze-video-veracity";
import type { AnalyzeVideoVeracityOutput } from "@/ai/flows/analyze-video-veracity";
import { politicians } from "@/lib/data";
import type { CrowdIntel } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Check, ShieldCheck, ShieldAlert, Bot, Microscope, BadgeInfo } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

const formSchema = z.object({
  politicianId: z.string().min(1, "Please select a politician."),
  description: z.string().min(20, "Please provide a detailed description (at least 20 characters)."),
  video: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "A video file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      "Only .mp4, .webm, and .ogg formats are supported."
    ),
});

export default function CrowdSourcedIntelPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [intelItems, setIntelItems] = useState<CrowdIntel[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      politicianId: "",
      description: "",
    },
  });

  async function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const videoFile = values.video[0];
      const videoDataUri = await fileToDataUri(videoFile);
      const politician = politicians.find(p => p.id === values.politicianId);

      const newItem: CrowdIntel = {
        id: `intel-${Date.now()}`,
        politician: politician!,
        description: values.description,
        videoUrl: URL.createObjectURL(videoFile),
        videoDataUri: videoDataUri,
        verifications: 0,
        isVerified: false,
        aiAnalysis: null,
      };

      setIntelItems(prev => [newItem, ...prev]);
      form.reset();
      toast({
        title: "Upload Successful",
        description: "Your video has been added to the gallery for verification.",
      });
    } catch (error) {
      console.error("Error handling submission:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not process your video. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleVerify = (id: string) => {
    setIntelItems(prev => prev.map(item => {
      if (item.id === id) {
        const newVerifications = item.verifications + 1;
        return {
          ...item,
          verifications: newVerifications,
          isVerified: newVerifications >= 100,
        };
      }
      return item;
    }));
  };

  const handleAnalyze = async (id: string) => {
    const itemToAnalyze = intelItems.find(item => item.id === id);
    if (!itemToAnalyze) return;

    setIntelItems(prev => prev.map(item => item.id === id ? { ...item, aiAnalysis: 'loading' } : item));
    
    try {
      const result = await analyzeVideoVeracity({
        videoDataUri: itemToAnalyze.videoDataUri,
        userDescription: itemToAnalyze.description,
        politicianName: itemToAnalyze.politician.name,
      });

      setIntelItems(prev => prev.map(item => item.id === id ? { ...item, aiAnalysis: result } : item));

    } catch (error) {
       console.error("Error analyzing video:", error);
       toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "The AI could not process this video.",
      });
      setIntelItems(prev => prev.map(item => item.id === id ? { ...item, aiAnalysis: null } : item));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Upload /> Crowd Sourced Intel
          </CardTitle>
          <CardDescription>
            Upload videos of politicians at meetings or public venues. Your submission will be reviewed by the community and analyzed by AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="politicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politician</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the politician in the video" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {politicians.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description of Incident</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what is happening in the video, the context, and why it's important." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Upload</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Video"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-bold">Verification Gallery</h2>
        {intelItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No videos have been uploaded yet. Be the first!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intelItems.map(item => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{item.politician.name}</CardTitle>
                   <CardDescription>
                     {item.isVerified ? (
                        <Badge variant="default" className="bg-green-600 text-white"><ShieldCheck className="mr-1 h-3 w-3" />Verified</Badge>
                     ) : (
                        <Badge variant="destructive"><ShieldAlert className="mr-1 h-3 w-3" />Unverified</Badge>
                     )}
                   </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="aspect-video bg-black rounded-md">
                     <video src={item.videoUrl} controls className="w-full h-full" />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                   {item.aiAnalysis === 'loading' ? (
                     <div className="flex items-center gap-2 text-primary"><Loader2 className="h-4 w-4 animate-spin" /> AI analysis in progress...</div>
                   ) : item.aiAnalysis ? (
                      <Alert variant={item.aiAnalysis.isAuthentic ? 'default' : 'destructive'}>
                        <Bot className="h-4 w-4" />
                        <AlertTitle className="flex items-center gap-2">
                           AI Analysis: {item.aiAnalysis.isAuthentic ? 'Likely Authentic' : 'Potentially Manipulated'}
                        </AlertTitle>
                        <AlertDescription>{item.aiAnalysis.analysisSummary}</AlertDescription>
                      </Alert>
                   ) : null}

                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                   <div className="w-full text-center text-sm text-muted-foreground">
                      Verifications: {item.verifications} / 100
                   </div>
                  <Button onClick={() => handleVerify(item.id)} disabled={item.isVerified} variant="outline" className="w-full">
                    <Check className="mr-2 h-4 w-4" /> Verify this video
                  </Button>
                  <Button onClick={() => handleAnalyze(item.id)} disabled={!!item.aiAnalysis} variant="secondary" className="w-full">
                     {item.aiAnalysis ? <><BadgeInfo className="mr-2 h-4 w-4"/>Analyzed</> : <><Microscope className="mr-2 h-4 w-4" />Run AI Analysis</>}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
