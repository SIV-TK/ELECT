"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getCampaignAdvice } from "@/ai/flows/get-campaign-advice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  sentimentAnalysis: z.string().min(10, "Please provide a summary of sentiment analysis."),
  trendingTopics: z.string().min(10, "Please list some trending topics."),
  candidateCurrentStance: z.string().min(10, "Please describe the candidate's current stance."),
});

export default function CampaignAdvicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sentimentAnalysis: "",
      trendingTopics: "",
      candidateCurrentStance: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAdvice(null);
    try {
      const result = await getCampaignAdvice(values);
      setAdvice(result.advice);
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
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI Campaign Strategist</CardTitle>
            <CardDescription>
              Provide context about the campaign, and our AI will generate strategic advice to help the candidate connect with voters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="sentimentAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sentiment Analysis Summary</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Voters feel the candidate is out of touch with economic issues but appreciate their stance on healthcare..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trendingTopics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trending Topics</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., #CostOfLiving, #YouthUnemployment, #HousingCrisis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="candidateCurrentStance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate's Current Stance</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., The candidate proposes a 5-point plan to tackle inflation and has promised to create 1 million jobs for the youth..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Advice...</>
                  ) : (
                    "Get Campaign Advice"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="min-h-[300px] sticky top-20">
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
              <div className="prose prose-sm max-w-none animate-in fade-in-50 dark:prose-invert">
                 {advice.split('\n').map((paragraph, index) => (
                  paragraph.trim() && <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
            {!isLoading && !advice && (
              <div className="text-center text-muted-foreground py-8">
                <p>Your generated advice will be shown here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
