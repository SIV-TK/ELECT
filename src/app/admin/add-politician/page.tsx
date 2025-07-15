// src/app/admin/add-politician/page.tsx
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, PlusCircle, Trash2 } from "lucide-react";
import type { Politician } from "@/types";
import { usePoliticianStore } from "@/hooks/use-politician-store";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  party: z.string().min(2, "Party name is required."),
  level: z.enum(['Presidential', 'Gubernatorial', 'Senatorial', 'WomenRep', 'MP', 'MCA']),
  county: z.string().optional(),
  constituency: z.string().optional(),
  ward: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  bio: z.string().min(20, "Bio should be at least 20 characters."),
  trackRecord: z.object({
    workHistory: z.array(z.object({ value: z.string().min(1, "Cannot be empty.") })).nonempty("At least one work history item is required."),
    promisesKept: z.array(z.object({ value: z.string().min(1, "Cannot be empty.") })).nonempty("At least one promise kept is required."),
    promisesBroken: z.array(z.object({ value: z.string().min(1, "Cannot be empty.") })).nonempty("At least one promise broken is required."),
    contributions: z.array(z.object({ value: z.string().min(1, "Cannot be empty.") })).nonempty("At least one contribution is required."),
  }),
  legalOversight: z.object({
    courtCases: z.array(z.object({ value: z.string() })),
    hasAdverseFindings: z.boolean(),
  }),
  academicLife: z.object({
    primarySchool: z.string().min(2, "Primary school is required."),
    highSchool: z.string().min(2, "High school is required."),
    university: z.string().min(2, "University is required."),
    notableAchievements: z.array(z.object({ value: z.string() })),
  }),
});

// Helper component for dynamic field arrays
const FieldArrayInput = ({ control, name, label, placeholder }: { control: any; name: any; label: string; placeholder: string; }) => {
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <div className="space-y-2 rounded-md border p-4">
       <FormLabel>{label}</FormLabel>
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={control}
            name={`${name}.${index}.value`}
            render={({ field }) => (
               <FormItem className="flex items-center gap-2">
                 <FormControl>
                    <Input {...field} placeholder={`${placeholder} #${index + 1}`} />
                 </FormControl>
                 <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive"/>
                 </Button>
               </FormItem>
            )}
          />
        ))}
       <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
       </Button>
    </div>
  );
}


export default function AddPoliticianPage() {
  const { toast } = useToast();
  const { addPolitician } = usePoliticianStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      party: "",
      level: "MP",
      county: "",
      constituency: "",
      ward: "",
      imageUrl: "",
      bio: "",
      trackRecord: {
        workHistory: [{value: ""}],
        promisesKept: [{value: ""}],
        promisesBroken: [{value: ""}],
        contributions: [{value: ""}],
      },
      legalOversight: {
        courtCases: [],
        hasAdverseFindings: false,
      },
      academicLife: {
        primarySchool: "",
        highSchool: "",
        university: "",
        notableAchievements: [],
      }
    },
  });

  const selectedLevel = form.watch("level");

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newPolitician: Politician = {
        id: values.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: values.name,
        party: values.party,
        level: values.level,
        county: values.county,
        constituency: values.constituency,
        ward: values.ward,
        imageUrl: values.imageUrl || 'https://placehold.co/400x400.png',
        bio: values.bio,
        trackRecord: {
            workHistory: values.trackRecord.workHistory.map(item => item.value),
            promisesKept: values.trackRecord.promisesKept.map(item => item.value),
            promisesBroken: values.trackRecord.promisesBroken.map(item => item.value),
            contributions: values.trackRecord.contributions.map(item => item.value),
        },
        legalOversight: {
            courtCases: values.legalOversight.courtCases.map(item => item.value),
            hasAdverseFindings: values.legalOversight.hasAdverseFindings,
        },
        academicLife: {
            primarySchool: values.academicLife.primarySchool,
            highSchool: values.academicLife.highSchool,
            university: values.academicLife.university,
            notableAchievements: values.academicLife.notableAchievements.map(item => item.value),
        }
    };

    addPolitician(newPolitician);

    toast({
      title: "Politician Profile Added",
      description: `Data for ${values.name} has been successfully added to the directory.`,
    });
    form.reset();
  }

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Shield />
            Add New Politician Profile
          </CardTitle>
          <CardDescription>
            This form is for administrators to input and update politician information. All fields are required unless marked optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <Card>
                 <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                       <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                       )} />
                       <FormField control={form.control} name="party" render={({ field }) => (
                          <FormItem><FormLabel>Political Party</FormLabel><FormControl><Input placeholder="e.g., Sauti Party" {...field} /></FormControl><FormMessage /></FormItem>
                       )} />
                    </div>
                     <FormField control={form.control} name="bio" render={({ field }) => (
                        <FormItem><FormLabel>Biography</FormLabel><FormControl><Textarea placeholder="A brief, neutral biography of the politician..." {...field} /></FormControl><FormMessage /></FormItem>
                     )} />
                     <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://placehold.co/400x400.png" {...field} /></FormControl><FormMessage /></FormItem>
                     )} />
                 </CardContent>
              </Card>

              <Card>
                 <CardHeader><CardTitle>Political Level</CardTitle></CardHeader>
                 <CardContent className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="level" render={({ field }) => (
                       <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl><SelectTrigger><SelectValue placeholder="Select political level" /></SelectTrigger></FormControl>
                             <SelectContent>
                                {['Presidential', 'Gubernatorial', 'Senatorial', 'WomenRep', 'MP', 'MCA'].map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                             </SelectContent>
                          </Select>
                          <FormMessage />
                       </FormItem>
                    )} />
                    {(selectedLevel === 'Gubernatorial' || selectedLevel === 'Senatorial' || selectedLevel === 'WomenRep' || selectedLevel === 'MP' || selectedLevel === 'MCA') && (
                        <FormField control={form.control} name="county" render={({ field }) => (
                           <FormItem><FormLabel>County</FormLabel><FormControl><Input placeholder="e.g., Nairobi" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    )}
                    {selectedLevel === 'MP' && (
                        <FormField control={form.control} name="constituency" render={({ field }) => (
                           <FormItem><FormLabel>Constituency</FormLabel><FormControl><Input placeholder="e.g., Westlands" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    )}
                    {selectedLevel === 'MCA' && (
                        <FormField control={form.control} name="ward" render={({ field }) => (
                           <FormItem><FormLabel>Ward</FormLabel><FormControl><Input placeholder="e.g., Parklands" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    )}
                 </CardContent>
              </Card>

               <Card>
                 <CardHeader><CardTitle>Track Record</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    <FieldArrayInput control={form.control} name="trackRecord.workHistory" label="Work History" placeholder="Previous job title"/>
                    <FieldArrayInput control={form.control} name="trackRecord.promisesKept" label="Promises Kept" placeholder="e.g., Built a new road"/>
                    <FieldArrayInput control={form.control} name="trackRecord.promisesBroken" label="Promises Broken" placeholder="e.g., Failed to create jobs"/>
                    <FieldArrayInput control={form.control} name="trackRecord.contributions" label="Contributions & Achievements" placeholder="e.g., Sponsored the Health Bill"/>
                 </CardContent>
               </Card>

                <Card>
                 <CardHeader><CardTitle>Legal & Academic</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                    <FieldArrayInput control={form.control} name="legalOversight.courtCases" label="Court Cases / Scandals (Optional)" placeholder="e.g., The NYS Scandal"/>
                    <FormField control={form.control} name="legalOversight.hasAdverseFindings" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                           <div className="space-y-1 leading-none">
                             <FormLabel>Has Adverse Findings</FormLabel>
                             <FormDescription>Check if there are proven adverse legal or ethical findings against the politician.</FormDescription>
                           </div>
                        </FormItem>
                     )} />
                    
                    <div className="grid md:grid-cols-3 gap-4 pt-4">
                       <FormField control={form.control} name="academicLife.primarySchool" render={({ field }) => (
                          <FormItem><FormLabel>Primary School</FormLabel><FormControl><Input placeholder="e.g., Central Primary" {...field} /></FormControl><FormMessage /></FormItem>
                       )} />
                       <FormField control={form.control} name="academicLife.highSchool" render={({ field }) => (
                          <FormItem><FormLabel>High School</FormLabel><FormControl><Input placeholder="e.g., National High" {...field} /></FormControl><FormMessage /></FormItem>
                       )} />
                       <FormField control={form.control} name="academicLife.university" render={({ field }) => (
                          <FormItem><FormLabel>University</FormLabel><FormControl><Input placeholder="e.g., University of Nairobi" {...field} /></FormControl><FormMessage /></FormItem>
                       )} />
                    </div>
                     <FieldArrayInput control={form.control} name="academicLife.notableAchievements" label="Notable Academic Achievements (Optional)" placeholder="e.g., Published a paper"/>
                 </CardContent>
               </Card>

              <Button type="submit" size="lg" className="w-full">Submit Politician Profile</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
