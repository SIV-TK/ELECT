// src/app/admin/submit-tally/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Landmark, ListChecks, User, Vote } from "lucide-react";
import { pollingStations, type LiveTally } from "@/types";
import { presidentialCandidates } from "@/lib/data";
import { useLiveTallyStore } from "@/hooks/use-live-tally-store";

const formSchema = z.object({
  pollingStationName: z.string().min(1, "Please select a polling station."),
  officerId: z.string().min(3, "Officer ID is required."),
  votes: z.array(z.object({
    candidateId: z.string(),
    count: z.coerce.number().min(0, "Votes cannot be negative."),
  })),
});

function generateMockId(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function SubmitTallyPage() {
  const { toast } = useToast();
  const { addTally } = useLiveTallyStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pollingStationName: "",
      officerId: `officer-${generateMockId(4)}`,
      votes: presidentialCandidates.map(c => ({ candidateId: c.id, count: 0 })),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const stationDetails = pollingStations.find(s => s.name === values.pollingStationName);
    if (!stationDetails) {
      toast({
        variant: "destructive",
        title: "Invalid Polling Station",
        description: "The selected polling station could not be found.",
      });
      return;
    }

    const totalVotes = values.votes.reduce((sum, v) => sum + v.count, 0);
    if (totalVotes > stationDetails.registeredVoters) {
        toast({
            variant: "destructive",
            title: "Vote Count Exceeds Registered Voters",
            description: `Total votes (${totalVotes}) cannot exceed registered voters (${stationDetails.registeredVoters}).`,
        });
        return;
    }

    const newTally: LiveTally = {
      id: `tally-${generateMockId(8)}`,
      officerId: values.officerId,
      pollingStation: `${stationDetails.name}, ${stationDetails.ward}`,
      voteDistribution: values.votes.map(v => ({ id: v.candidateId, votes: v.count })),
      timestamp: new Date(),
      verifications: 0,
      ...stationDetails
    };

    addTally(newTally);

    toast({
      title: "Tally Submitted Successfully",
      description: `Results from ${newTally.pollingStation} have been added to the live feed.`,
    });
    
    // Reset form for next submission
    form.reset({
      pollingStationName: "",
      officerId: `officer-${generateMockId(4)}`,
      votes: presidentialCandidates.map(c => ({ candidateId: c.id, count: 0 })),
    });
  }

  return (
    <div className="space-y-6">
       <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ListChecks />
            Submit Polling Station Tally
          </CardTitle>
          <CardDescription>
            This form is for authorized polling station officers to submit the final vote counts.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className="grid md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="pollingStationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Landmark/>Polling Station</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select your station" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {pollingStations.map(station => <SelectItem key={station.name} value={station.name}>{station.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="officerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><User/>Officer ID</FormLabel>
                        <FormControl><Input placeholder="Your official ID" {...field} disabled /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <Card>
                 <CardHeader><CardTitle className="flex items-center gap-2"><Vote/>Candidate Votes</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    {presidentialCandidates.map((candidate, index) => (
                         <FormField
                            key={candidate.id}
                            control={form.control}
                            name={`votes.${index}.count`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{candidate.name} ({candidate.party})</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Enter vote count" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    ))}
                 </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? 'Submitting...' : 'Submit Final Tally'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
