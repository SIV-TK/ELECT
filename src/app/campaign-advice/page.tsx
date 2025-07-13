"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getCampaignAdvice } from "@/ai/flows/get-campaign-advice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  candidateName: z.string().min(2, "Candidate name is required."),
  trendingTopics: z.string().min(10, "Please list some trending topics."),
  candidateCurrentStance: z.string().min(10, "Please describe the candidate's current stance."),
  userSentimentAnalysis: z.string().min(10, "Please provide a summary of sentiment analysis."),
});

export default function CampaignAdvicePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      trendingTopics: "",
      candidateCurrentStance: "",
      userSentimentAnalysis: "",
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
             Provide campaign context. Our AI will analyze recent online sentiment and combine it with your insights to generate strategic advice.
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
                        <Textarea placeholder="e.g., The candidate proposes a 5-point plan to tackle inflation..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userSentimentAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Sentiment Analysis Summary</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., My analysis shows voters are concerned about economic issues but support the healthcare stance..." {...field} />
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
