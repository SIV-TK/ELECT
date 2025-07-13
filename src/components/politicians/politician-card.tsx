import type { Politician } from "@/types";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Gavel, CheckCircle, XCircle, Trophy, FileText, Briefcase } from "lucide-react";

export function PoliticianCard({ politician }: { politician: Politician }) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col items-center text-center">
        <Image
          src={politician.imageUrl}
          alt={`Photo of ${politician.name}`}
          width={120}
          height={120}
          className="rounded-full border-4 border-primary/20 object-cover"
          data-ai-hint="politician portrait"
        />
        <CardTitle className="mt-4 font-headline">{politician.name}</CardTitle>
        <CardDescription>{politician.party}</CardDescription>
        <Badge variant="secondary" className="mt-2">{politician.level} {politician.county ? `- ${politician.county}` : ''}</Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="track-record">
            <AccordionTrigger>
              <Briefcase className="mr-2 h-4 w-4" /> Track Record
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Work History</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.trackRecord.workHistory.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-600" /> Promises Kept</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.trackRecord.promisesKept.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1"><XCircle className="h-4 w-4 text-red-600" /> Promises Broken</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.trackRecord.promisesBroken.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
               <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1"><Trophy className="h-4 w-4 text-yellow-500" /> Contributions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.trackRecord.contributions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="legal-oversight">
            <AccordionTrigger>
              <FileText className="mr-2 h-4 w-4" /> Legal Oversight
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
               <h4 className="font-semibold mb-1">Court Cases</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.legalOversight.courtCases.length > 0 ? politician.legalOversight.courtCases.map((item, i) => <li key={i}>{item}</li>) : <li>No major court cases reported.</li>}
                </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      {politician.legalOversight.hasAdverseFindings && (
        <CardFooter>
          <Badge variant="destructive" className="w-full justify-center">
            <Gavel className="mr-2 h-4 w-4" />
            Adverse Findings Reported
          </Badge>
        </CardFooter>
      )}
    </Card>
  );
}
