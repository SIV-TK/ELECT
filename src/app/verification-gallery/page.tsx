// src/app/verification-gallery/page.tsx
"use client";

import { useState } from "react";
import Image from 'next/image';
import { useIntelStore } from '@/hooks/use-intel-store';
import type { CrowdIntel } from "@/types";
import { analyzeIntelVeracity } from "@/ai/flows/analyze-intel-veracity";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, ShieldCheck, ShieldAlert, Bot, Microscope, BadgeInfo, FileText, Image as ImageIcon, Video, Hash, GalleryVertical } from "lucide-react";

const IntelCard = ({ item }: { item: CrowdIntel }) => {
  const { verifyIntel, startAnalysis, completeAnalysis } = useIntelStore();
  const { toast } = useToast();
  
  const handleVerify = () => {
    verifyIntel(item.id);
  };

  const handleAnalyze = async () => {
    startAnalysis(item.id);
    try {
      const result = await analyzeIntelVeracity({
        dataUri: item.dataUri,
        userDescription: item.description,
        politicianName: item.politician.name,
      });
      completeAnalysis(item.id, result);
    } catch (error) {
       console.error("Error analyzing file:", error);
       toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "The AI could not process this file.",
      });
      completeAnalysis(item.id, null);
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
    <Card className="flex flex-col">
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
            <Alert variant={(item.aiAnalysis as any).isAuthentic ? 'default' : 'destructive'}>
              <Bot className="h-4 w-4" />
              <AlertTitle className="flex items-center gap-2">
                 AI Analysis: {(item.aiAnalysis as any).isAuthentic ? 'Likely Authentic' : 'Potentially Manipulated'}
              </AlertTitle>
              <AlertDescription>{(item.aiAnalysis as any).analysisSummary}</AlertDescription>
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
        <Button onClick={handleVerify} disabled={item.isVerified} variant="outline" className="w-full">
          <Check className="mr-2 h-4 w-4" /> Verify this Intel
        </Button>
        <Button onClick={handleAnalyze} disabled={!!item.aiAnalysis} variant="secondary" className="w-full">
           {item.aiAnalysis ? <><BadgeInfo className="mr-2 h-4 w-4"/>Analyzed</> : <><Microscope className="mr-2 h-4 w-4" />Run AI Analysis</>}
        </Button>
      </CardFooter>
    </Card>
  );
};

const IntelGrid = ({ items }: { items: CrowdIntel[] }) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">
        <p>No content has been submitted for this category yet.</p>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <IntelCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default function VerificationGalleryPage() {
  const { intelItems } = useIntelStore();

  const videos = intelItems.filter(item => item.file.type.startsWith('video/'));
  const images = intelItems.filter(item => item.file.type.startsWith('image/'));
  const documents = intelItems.filter(item => item.file.type === 'application/pdf');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <GalleryVertical /> Verification Gallery
          </CardTitle>
          <CardDescription>
            Review and verify community-submitted intel. Your verification helps build a more transparent political landscape.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="videos"><Video className="mr-2 h-4 w-4"/>Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="images"><ImageIcon className="mr-2 h-4 w-4"/>Images ({images.length})</TabsTrigger>
          <TabsTrigger value="documents"><FileText className="mr-2 h-4 w-4"/>Documents ({documents.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          <IntelGrid items={videos} />
        </TabsContent>
        <TabsContent value="images">
          <IntelGrid items={images} />
        </TabsContent>
        <TabsContent value="documents">
          <IntelGrid items={documents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
