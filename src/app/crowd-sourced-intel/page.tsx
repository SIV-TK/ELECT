// src/app/crowd-sourced-intel/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from 'next/link';
import { analyzeIntelVeracity } from "@/ai/flows/analyze-intel-veracity";
import { trackCrowdIntel } from "@/lib/analytics";
import { politicians } from "@/lib/data";
import type { CrowdIntel } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, GalleryVertical } from "lucide-react";
import { useIntelStore } from '@/hooks/use-intel-store';

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
  const { addIntel } = useIntelStore();
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
        type: 'document',
        content: values.description,
        author: 'Anonymous',
        timestamp: new Date(),
        location: {
          county: 'Unknown'
        },
        verification: {
          status: 'pending',
          confidence: 0.5,
          verifiers: 0
        },
        tags: [],
        category: 'politics',
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

      addIntel(newItem);
      
      // Track analytics
      trackCrowdIntel(file.type, 'Unknown');
      
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Upload /> Submit Crowd Sourced Intel
              </CardTitle>
              <CardDescription>
                Upload videos, images (JPG/PNG), or documents (PDF) of politicians for community verification and AI analysis.
              </CardDescription>
            </div>
            <Link href="/verification-gallery" passHref>
              <Button variant="outline">
                <GalleryVertical className="mr-2 h-4 w-4" />
                View Verification Gallery
              </Button>
            </Link>
          </div>
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
      
       <div className="text-center text-muted-foreground py-8">
          <p>After submission, your intel will be available in the Verification Gallery.</p>
          <p className="text-sm">Click the button above to view all submitted content.</p>
        </div>

    </div>
  );
}
