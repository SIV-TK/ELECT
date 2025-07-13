"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeCandidateSentiment } from "@/ai/flows/analyze-candidate-sentiment";
import type { AnalyzeCandidateSentimentOutput } from "@/ai/flows/analyze-candidate-sentiment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

const formSchema = z.object({
  candidateName: z.string().min(2, "Candidate name is required."),
  topic: z.string().min(2, "Topic is required."),
});

export default function SentimentAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeCandidateSentimentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { candidateName: "", topic: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeCandidateSentiment(values);
      setResult(analysisResult);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze sentiment. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const sentimentPercentage = result ? (result.sentimentScore + 1) * 50 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Public Sentiment Analysis</CardTitle>
          <CardDescription>
            Use AI to gauge public opinion about a political candidate on a specific topic. The AI queries online sources to generate its analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="candidateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., William Ruto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The Economy, Healthcare, The Housing Bill" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analyze Sentiment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-lg">Analyzing... this may take a moment.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="font-headline">Analysis Results</CardTitle>
            <CardDescription>
              Sentiment for <span className="font-bold">{form.getValues("candidateName")}</span> on the topic of <span className="font-bold">{form.getValues("topic")}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Sentiment Score: {result.sentimentScore.toFixed(2)}</h3>
              <Progress value={sentimentPercentage} className="w-full mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Very Negative</span>
                <span>Neutral</span>
                <span>Very Positive</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Summary</h3>
              <p className="text-muted-foreground">{result.sentimentSummary}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ThumbsUp className="text-green-500" /> Positive Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.positiveKeywords.map((kw) => <Badge key={kw} variant="outline" className="border-green-500 text-green-600">{kw}</Badge>)}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ThumbsDown className="text-red-500" /> Negative Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.negativeKeywords.map((kw) => <Badge key={kw} variant="outline" className="border-red-500 text-red-600">{kw}</Badge>)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
