"use client";

import { useState } from "react";
import { politicians } from "@/lib/data";
import type { Politician } from "@/types";
import { summarizePolitician } from "@/ai/flows/summarize-politician";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { GraduationCap, School, University, Trophy, Loader2, Bot, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const PoliticianAcademicCard = ({ politician }: { politician: Politician }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
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

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={politician.imageUrl}
          alt={`Photo of ${politician.name}`}
          width={80}
          height={80}
          className="rounded-full border-4 border-primary/20 object-cover"
          data-ai-hint="politician portrait"
        />
        <div>
          <CardTitle className="font-headline">{politician.name}</CardTitle>
          <CardDescription>{politician.party}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm flex-grow">
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
                  <h4 className="font-semibold">University Education</h4>
                  <p className="text-muted-foreground">{politician.academicLife.university}</p>
              </div>
          </div>
          <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 mt-1 text-muted-foreground" />
              <div>
                  <h4 className="font-semibold">Notable Achievements</h4>
                   <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {politician.academicLife.notableAchievements.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
              </div>
          </div>
      </CardContent>
      <CardFooter className="flex-col !pt-4 border-t">
        {summary && (
            <Alert className="mb-4 animate-in fade-in-50">
              <Bot className="h-4 w-4" />
              <AlertTitle>AI Narrative</AlertTitle>
              <AlertDescription className="prose prose-sm max-w-none dark:prose-invert">
                 {summary.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                ))}
              </AlertDescription>
            </Alert>
          )}
        <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><FileText className="mr-2 h-4 w-4" /> Generate AI Narrative</>}
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function AcademicLifePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <GraduationCap />
            Politicians' Academic Life
          </CardTitle>
          <CardDescription>
            A look into the educational backgrounds of key political figures, with AI-powered narratives.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {politicians.map((politician) => (
          <PoliticianAcademicCard key={politician.id} politician={politician} />
        ))}
      </div>
    </div>
  );
}
