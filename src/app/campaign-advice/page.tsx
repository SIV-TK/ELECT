"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  candidateName: z.string().min(2, "Candidate name is required."),
});

export default function CampaignAdvicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAdvice(null);
    setMetadata(null);
    try {
      const response = await fetch('/api/campaign-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const text = await response.text();
      if (!text.trim()) {
        throw new Error('Empty response');
      }
      
      const result = JSON.parse(text);
      
      if (result.success) {
        setAdvice(result.data.advice);
        setMetadata(result.data.metadata);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error("Error getting campaign advice:", error);
      toast({
        variant: "destructive",
        title: "Advice Generation Failed",
        description: "Could not generate advice. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Campaign Strategist</CardTitle>
          <CardDescription>
           Enter a politician's name. Our AI will analyze real-time Kenyan political data, public sentiment, and trending topics to generate strategic campaign advice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politician Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., William Ruto, Raila Odinga, Martha Karua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                <p className="font-medium mb-1">What happens next:</p>
                <ul className="text-xs space-y-1">
                  <li>• Scrapes latest Kenyan political news and social media</li>
                  <li>• Analyzes public sentiment and trending topics</li>
                  <li>• Extracts politician's current stance from recent data</li>
                  <li>• Generates AI-powered strategic campaign advice</li>
                </ul>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Political Data...</>
                ) : (
                  "Generate AI Campaign Advice"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[300px]">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-primary" />
            Strategic Advice
          </CardTitle>
          <CardDescription>The AI's recommendations will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {advice && (
            <div className="space-y-4">
              {metadata && (
                <div className="text-xs text-muted-foreground border-b pb-3 space-y-1">
                  <p><strong>Data Sources:</strong> {metadata.dataSourcesCount} online sources analyzed</p>
                  <p><strong>Trending Topics:</strong> {metadata.trendingTopics?.slice(0, 4).join(', ')}</p>
                  <p><strong>Key Public Concerns:</strong> {metadata.publicConcerns?.slice(0, 3).join(', ')}</p>
                  {metadata.onlineSources && (
                    <p><strong>Online Sources:</strong> {metadata.onlineSources.slice(0, 3).join(', ')}</p>
                  )}
                  <p><strong>Analysis Updated:</strong> {new Date(metadata.lastUpdated).toLocaleString()}</p>
                </div>
              )}
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none animate-in fade-in-50 dark:prose-invert">
                  {typeof advice === 'string' ? (
                    advice.split('\n').map((paragraph, index) => (
                      paragraph.trim() && <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Strategic Recommendations</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {(advice as any).strategicRecommendations?.map((rec: any, i: number) => (
                            <li key={i} className="text-sm">{rec}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Messaging Strategy</h4>
                        <p className="text-sm">{(advice as any).messagingAdvice}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Target Audiences</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {(advice as any).targetAudiences?.map((audience: any, i: number) => (
                            <li key={i} className="text-sm">{audience}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Risk Assessment</h4>
                        <p className="text-sm">{(advice as any).riskAssessment}</p>
                      </div>
                      
                      {(advice as any).countyAnalysis && (
                        <div>
                          <h4 className="font-semibold mb-2">47 Counties Analysis</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                            {(advice as any).countyAnalysis.slice(0, 12).map((county: any, i: number) => (
                              <div key={i} className="text-xs p-2 bg-muted rounded">
                                <div className="font-medium">{county.county}</div>
                                <div className="text-muted-foreground">{county.supportLevel}% support</div>
                                <div className="text-muted-foreground">{county.keyIssues}</div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Showing 12 of 47 counties analyzed</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {!isLoading && !advice && (
            <div className="text-center text-muted-foreground py-8">
              <p>AI-generated campaign advice based on real-time political data will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
