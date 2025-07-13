'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { politicians } from '@/lib/data';
import type { Politician } from '@/types';
import { summarizePolitician } from '@/ai/flows/summarize-politician';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, BotMessageSquare, GraduationCap, School, University, Trophy, CheckCircle, XCircle, Briefcase, FileText, Gavel, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PoliticianProfilePage() {
  const params = useParams();
  const [politician, setPolitician] = useState<Politician | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      const foundPolitician = politicians.find(p => p.id === params.id);
      setPolitician(foundPolitician || null);
    }
  }, [params.id]);

  const handleGenerateSummary = async () => {
    if (!politician) return;
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizePolitician(politician);
      setSummary(result.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Summary Generation Failed",
        description: "Could not generate an AI summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!politician) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl">Politician not found.</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start gap-6">
          <Image
            src={politician.imageUrl}
            alt={`Photo of ${politician.name}`}
            width={150}
            height={150}
            className="rounded-lg border-4 border-primary/20 object-cover"
            data-ai-hint="politician portrait"
          />
          <div className="flex-1">
            <CardTitle className="font-headline text-3xl">{politician.name}</CardTitle>
            <CardDescription className="text-lg">{politician.party}</CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{politician.level}</Badge>
              {politician.county && <Badge variant="outline">{politician.county}</Badge>}
            </div>
             <p className="text-muted-foreground mt-4">{politician.bio}</p>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Briefcase/>Track Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><User/>Work History</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {politician.trackRecord.workHistory.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
               <Separator />
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="text-green-500"/> Promises Kept</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {politician.trackRecord.promisesKept.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
               <Separator />
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><XCircle className="text-red-500"/> Promises Broken</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {politician.trackRecord.promisesBroken.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <Separator />
               <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Trophy className="text-yellow-500"/> Contributions & Achievements</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {politician.trackRecord.contributions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><GraduationCap />Academic Life</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
               <div className="flex items-start gap-3">
                  <School className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                      <h4 className="font-semibold">Primary & High School</h4>
                      <p className="text-muted-foreground">{politician.academicLife.primarySchool}, {politician.academicLife.highSchool}</p>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <University className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                      <h4 className="font-semibold">University</h4>
                      <p className="text-muted-foreground">{politician.academicLife.university}</p>
                  </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><FileText />Legal Oversight</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Court Cases & Scandals</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {politician.legalOversight.courtCases.length > 0 ? politician.legalOversight.courtCases.map((item, i) => <li key={i}>{item}</li>) : <li>No major court cases reported.</li>}
              </ul>
            </CardContent>
            {politician.legalOversight.hasAdverseFindings && (
            <CardFooter>
              <Alert variant="destructive">
                 <Gavel className="h-4 w-4" />
                <AlertTitle>Adverse Findings Reported</AlertTitle>
                <AlertDescription>
                  This politician has been associated with legal cases or scandals with adverse findings.
                </AlertDescription>
              </Alert>
            </CardFooter>
          )}
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><BotMessageSquare />AI Summary</CardTitle>
          <CardDescription>Click the button to generate an AI-powered summary of this politician's profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateSummary} disabled={isLoading} className="mb-4">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              "Generate AI Summary"
            )}
          </Button>
          {summary && (
            <Alert className="animate-in fade-in-50">
              <AlertTitle>Generated Summary</AlertTitle>
              <AlertDescription className="prose prose-sm max-w-none dark:prose-invert">
                {summary.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                ))}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
