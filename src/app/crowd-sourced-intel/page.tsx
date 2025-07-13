// src/app/crowd-sourced-intel/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeIntelVeracity } from "@/ai/flows/analyze-intel-veracity";
import type { AnalyzeIntelVeracityOutput } from "@/ai/flows/analyze-intel-veracity";
import { politicians } from "@/lib/data";
import type { CrowdIntel } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Check, ShieldCheck, ShieldAlert, Bot, Microscope, BadgeInfo, FileText, Image as ImageIcon, Video, Hash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ACCEPTED_FILE_TYPES = ["video/mp4", "video/webm", "video/ogg", "image/jpeg", "image/png", "application/pdf"];

const formSchema = z.object({
  politicianId: z.string().min(1, "Please select a politician."),
  description: z.string().min(20, "Please provide a detailed description (at least 20 characters)."),
  file: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "A file is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 15MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only video, image (JPG, PNG), and PDF files are supported."
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

  function generateMockHash(length: number) {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const file = values.file[0];
      const dataUri = await fileToDataUri(file);
      const politician = politicians.find(p => p.id === values.politicianId);

      const newItem: CrowdIntel = {
        id: `intel-${Date.now()}`,
        politician: politician!,
        description: values.description,
        file: {
          url: URL.createObjectURL(file),
          type: file.type,
          name: file.name,
        },
        dataUri: dataUri,
        verifications: 0,
        isVerified: false,
        aiAnalysis: null,
        blockchainTransactionId: `0x${generateMockHash(64)}`,
        storageHash: `Qm${generateMockHash(44)}`,
      };

      setIntelItems(prev => [newItem, ...prev]);
      form.reset();
      toast({
        title: "Upload Successful",
        description: "Your intel has been added to the gallery for verification.",
      });
    } catch (error) {
      console.error("Error handling submission:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not process your file. Please try again.",
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
      const result = await analyzeIntelVeracity({
        dataUri: itemToAnalyze.dataUri,
        userDescription: itemToAnalyze.description,
        politicianName: itemToAnalyze.politician.name,
      });

      setIntelItems(prev => prev.map(item => item.id === id ? { ...item, aiAnalysis: result } : item));

    } catch (error) {
       console.error("Error analyzing file:", error);
       toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "The AI could not process this file.",
      });
      setIntelItems(prev => prev.map(item => item.id === id ? { ...item, aiAnalysis: null } : item));
    }
  };

  const renderFilePreview = (item: CrowdIntel) => {
    const type = item.file.type;
    if (type.startsWith('video/')) {
      return <video src={item.file.url} controls className="w-full h-full object-cover" />;
    }
    if (type.startsWith('image/')) {
      return <Image src={item.file.url} alt={item.description} layout="fill" className="object-cover" />;
    }
    if (type === 'application/pdf') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-secondary text-secondary-foreground p-4">
          <FileText className="w-16 h-16" />
          <p className="mt-2 text-sm font-semibold truncate">{item.file.name}</p>
          <a href={item.file.url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs mt-1 hover:underline">View PDF</a>
        </div>
      );
    }
    return <div className="flex items-center justify-center h-full bg-muted"><p>Unsupported file type</p></div>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Upload /> Submit Crowd Sourced Intel
          </CardTitle>
          <CardDescription>
            Upload videos, images (JPG/PNG), or documents (PDF) of politicians. Your submission will be reviewed by the community and analyzed by AI.
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
                          <SelectValue placeholder="Select the politician involved" />
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
                      <Textarea placeholder="Describe what is happening, the context, and why it's important." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Upload (Video, Image, PDF)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept={ACCEPTED_FILE_TYPES.join(',')}
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Intel"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-2xl font-headline font-bold">Verification Gallery</h2>
        {intelItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No intel has been submitted yet. Be the first!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {intelItems.map(item => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                   <div className="flex justify-between items-start">
                     <div>
                       <CardTitle>{item.politician.name}</CardTitle>
                       <CardDescription>
                         {item.isVerified ? (
                            <Badge variant="default" className="bg-green-600 text-white mt-1"><ShieldCheck className="mr-1 h-3 w-3" />Verified</Badge>
                         ) : (
                            <Badge variant="destructive" className="mt-1"><ShieldAlert className="mr-1 h-3 w-3" />Unverified</Badge>
                         )}
                       </CardDescription>
                     </div>
                      {item.file.type.startsWith('video/') && <Video className="h-6 w-6 text-muted-foreground" />}
                      {item.file.type.startsWith('image/') && <ImageIcon className="h-6 w-6 text-muted-foreground" />}
                      {item.file.type.startsWith('application/') && <FileText className="h-6 w-6 text-muted-foreground" />}
                   </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="aspect-video bg-black rounded-md relative overflow-hidden">
                     {renderFilePreview(item)}
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
                <CardFooter className="flex flex-col gap-2 border-t pt-4">
                  <div className="w-full text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2 truncate">
                          <Hash className="h-3 w-3 shrink-0" />
                          <span className="truncate" title={item.blockchainTransactionId}>{item.blockchainTransactionId}</span>
                      </div>
                  </div>
                   <div className="w-full text-center text-sm text-muted-foreground mt-2">
                      Verifications: {item.verifications} / 100
                   </div>
                  <Button onClick={() => handleVerify(item.id)} disabled={item.isVerified} variant="outline" className="w-full">
                    <Check className="mr-2 h-4 w-4" /> Verify this Intel
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
