// src/app/sentiment-analysis/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { analyzeCandidateSentiment } from "@/ai/flows/analyze-candidate-sentiment";
import type { AnalyzeCandidateSentimentOutput } from "@/ai/flows/analyze-candidate-sentiment";
import { predictVoteDistribution } from "@/ai/flows/predict-vote-distribution";
import type { VoteDistribution } from "@/ai/flows/predict-vote-distribution";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, Loader2, Check, ChevronsUpDown, Trophy, Map } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { KenyaMap } from "@/components/maps/kenya-map";

const suggestedTopics = [
  { value: "The Economy", label: "The Economy" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "The Housing Bill", label: "The Housing Bill" },
  { value: "Education", label: "Education" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Unemployment", label: "Unemployment" },
  { value: "Foreign Policy", label: "Foreign Policy" },
  { value: "Cost of living", label: "Cost of living" },
  { value: "Corruption", label: "Corruption" },
  { value: "National Security", label: "National Security" },
];

const formSchema = z.object({
  candidateName: z.string().min(2, "Candidate name is required."),
  topic: z.string().min(2, "Topic is required."),
});

type ResultState = {
  sentiment: AnalyzeCandidateSentimentOutput;
  prediction?: {
    regions: VoteDistribution[];
    predictedWinner: string;
  };
} | null;

export default function SentimentAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [result, setResult] = useState<ResultState>(null);
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { candidateName: "", topic: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIsLoadingPrediction(true);
    setResult(null);
    try {
      const sentimentResult = await analyzeCandidateSentiment(values);
      setResult({ sentiment: sentimentResult });

      // Now, trigger the prediction flow
      const predictionResult = await predictVoteDistribution({
        candidateName: values.candidateName,
        topic: values.topic,
        sentimentScore: sentimentResult.sentimentScore,
      });

      // Find the winner
      const winner = predictionResult.regions.reduce((prev, current) => {
        return (prev.predictedVoteShare > current.predictedVoteShare) ? prev : current
      });

      setResult(prev => prev ? {
        ...prev,
        prediction: {
          regions: predictionResult.regions,
          predictedWinner: `${values.candidateName} is predicted to win in ${winner.name}.`
        }
       } : null);

    } catch (error) {
      console.error("Error during analysis or prediction:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not complete the full analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingPrediction(false);
    }
  }

  const sentimentPercentage = result ? (result.sentiment.sentimentScore + 1) * 50 : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Public Sentiment &amp; Election Prediction</CardTitle>
            <CardDescription>
              Use AI to gauge public opinion, then predict election outcomes based on that sentiment, visualized on a map of Kenya.
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
                      <FormItem className="flex flex-col">
                        <FormLabel>Topic</FormLabel>
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? suggestedTopics.find(
                                      (topic) => topic.value === field.value
                                    )?.label
                                  : "Select or type a topic..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search topic..."
                                onValueChange={(value) => field.onChange(value)}
                              />
                              <CommandList>
                                <CommandEmpty>No topic found.</CommandEmpty>
                                <CommandGroup>
                                  {suggestedTopics.map((topic) => (
                                    <CommandItem
                                      value={topic.label}
                                      key={topic.value}
                                      onSelect={() => {
                                        form.setValue("topic", topic.value);
                                        setPopoverOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          topic.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {topic.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Analyze and Predict
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
                <p className="ml-4 text-lg">Analyzing sentiment... this may take a moment.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {result?.sentiment && (
          <Card className="animate-in fade-in-50">
            <CardHeader>
              <CardTitle className="font-headline">Analysis Results</CardTitle>
              <CardDescription>
                Sentiment for <span className="font-bold">{form.getValues("candidateName")}</span> on the topic of <span className="font-bold">{form.getValues("topic")}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Overall Sentiment Score: {result.sentiment.sentimentScore.toFixed(2)}</h3>
                <Progress value={sentimentPercentage} className="w-full mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Negative</span>
                  <span>Neutral</span>
                  <span>Very Positive</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Summary</h3>
                <p className="text-muted-foreground">{result.sentiment.sentimentSummary}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ThumbsUp className="text-green-500" /> Positive Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.sentiment.positiveKeywords.map((kw) => <Badge key={kw} variant="outline" className="border-green-500 text-green-600">{kw}</Badge>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ThumbsDown className="text-red-500" /> Negative Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.sentiment.negativeKeywords.map((kw) => <Badge key={kw} variant="outline" className="border-red-500 text-red-600">{kw}</Badge>)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
         <Card className="min-h-[400px] sticky top-20">
           <CardHeader>
             <CardTitle className="font-headline flex items-center gap-2"><Map/> Vote Distribution Prediction</CardTitle>
             <CardDescription>The AI's prediction of vote distribution across Kenya based on the sentiment analysis.</CardDescription>
           </CardHeader>
           <CardContent>
              {isLoadingPrediction && (
                 <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Generating prediction and map...</p>
                 </div>
              )}
              {result?.prediction && (
                <div className="space-y-4 animate-in fade-in-50">
                   <div className="p-4 rounded-lg bg-accent/50 border">
                     <h3 className="font-semibold flex items-center gap-2"><Trophy className="text-yellow-500"/> Predicted Outcome</h3>
                     <p className="text-sm text-accent-foreground">{result.prediction.predictedWinner}</p>
                   </div>
                   <KenyaMap data={result.prediction.regions} />
                </div>
              )}
              {!isLoading && !result && (
                <div className="text-center text-muted-foreground py-8">
                  <p>The prediction map will be shown here after analysis.</p>
                </div>
              )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
