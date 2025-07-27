'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { politicians } from '@/lib/data';
import type { Politician } from '@/types';
import { summarizePolitician } from '@/ai/flows/summarize-politician';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, MessageSquare, GraduationCap, School, BookOpen, Trophy, CheckCircle, XCircle, Briefcase, FileText, Gavel, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PoliticianProfilePage() {
  const params = useParams();
  const [politician, setPolitician] = useState<Politician | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [academicNarrative, setAcademicNarrative] = useState<string | null>(null);
  const [loadingAcademic, setLoadingAcademic] = useState(false);
  const [academicLastUpdated, setAcademicLastUpdated] = useState<string>('');
  const [academicDataPoints, setAcademicDataPoints] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (params.id) {
      const foundPolitician = politicians.find(p => p.id === params.id);
      setPolitician(foundPolitician || null);
    }
  }, [params.id]);

  const handleGenerateComprehensiveAnalysis = async () => {
    if (!politician) return;
    setIsLoading(true);
    setSummary(null);
    setRealTimeData(null);
    try {
      // Get real-time data first
      const response = await fetch('/api/politician-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ politicianName: politician.name }),
      });
      
      const realTimeResult = await response.json();
      
      if (realTimeResult.success) {
        setRealTimeData(realTimeResult.data);
        
        // Generate AI summary with real-time context
        const summaryResponse = await fetch('/api/politician-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ politician }),
        });
        
        const summaryResult = await summaryResponse.json();
        if (summaryResult.success) {
          setSummary(summaryResult.data.summary);
        }
      } else {
        throw new Error(realTimeResult.error);
      }
    } catch (error) {
      console.error("Error generating comprehensive analysis:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not generate comprehensive analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAcademicNarrative = async () => {
    if (!politician) return;
    setLoadingAcademic(true);
    setAcademicNarrative(null);
    try {
      const response = await fetch('/api/politician-academic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ politicianName: politician.name }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setAcademicNarrative(result.data.narrative);
        setAcademicLastUpdated(new Date(result.data.lastUpdated).toLocaleString());
        setAcademicDataPoints(result.data.dataPoints);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error generating academic narrative:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not generate academic narrative. Please try again.",
      });
    } finally {
      setLoadingAcademic(false);
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
          <div className="w-[150px] h-[150px] rounded-lg border-4 border-primary/20 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-2xl font-bold">
              {politician.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </span>
          </div>
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
                  <BookOpen className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div>
                      <h4 className="font-semibold">University</h4>
                      <p className="text-muted-foreground">{politician.academicLife.university}</p>
                  </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3" 
                onClick={handleGenerateAcademicNarrative} 
                disabled={loadingAcademic}
              >
                {loadingAcademic ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  "Generate AI Academic Narrative"
                )}
              </Button>
              {academicNarrative && (
                <div className="mt-3 p-3 bg-muted/50 rounded-md animate-in fade-in-50">
                  <h4 className="font-semibold mb-2 text-xs">AI Academic Analysis</h4>
                  <p className="text-xs text-muted-foreground">{academicNarrative}</p>
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                    <p>Data Sources: {academicDataPoints} online sources analyzed</p>
                    <p>Analysis Generated: {academicLastUpdated}</p>
                  </div>
                </div>
              )}
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
          <CardTitle className="font-headline flex items-center gap-2"><MessageSquare />Comprehensive AI Analysis</CardTitle>
          <CardDescription>Generate an AI-powered analysis combining profile data with real-time internet data and public sentiment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateComprehensiveAnalysis} disabled={isLoading} className="mb-4">
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              "Generate Comprehensive Analysis"
            )}
          </Button>
          
          {realTimeData && (
            <div className="mb-4 p-4 bg-muted/50 rounded-lg animate-in fade-in-50">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Trending Topics</h4>
                  <div className="flex flex-wrap gap-1">
                    {realTimeData.trendingTopics.map((topic: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recent News</h4>
                  <ul className="text-sm space-y-1">
                    {realTimeData.recentNews.slice(0, 3).map((news: any, i: number) => (
                      <li key={i} className="text-muted-foreground">• {news.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Real-time data updated: {new Date(realTimeData.lastUpdated).toLocaleString()}
              </div>
            </div>
          )}
          
          {summary && (
            <Alert className="animate-in fade-in-50">
              <AlertTitle>AI Analysis Summary</AlertTitle>
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
