import type { Politician } from "@/types";
import Image from "next/image";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Gavel, CheckCircle, XCircle, Trophy, FileText, Briefcase, ArrowRight } from "lucide-react";

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
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground text-center px-4">
          {politician.bio}
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="track-record">
            <AccordionTrigger>
              <Briefcase className="mr-2 h-4 w-4" /> Quick Look
            </AccordionTrigger>
            <AccordionContent className="space-y-2 text-sm">
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-600" /> Promises Kept</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.trackRecord.promisesKept.slice(0, 1).map((item, i) => <li key={i}>{item}</li>)}
                   {politician.trackRecord.promisesKept.length > 1 && <li>...and more.</li>}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1"><XCircle className="h-4 w-4 text-red-600" /> Promises Broken</h4>
                <ul className="list-disc pl-5 space-y-1">
                   {politician.trackRecord.promisesBroken.slice(0, 1).map((item, i) => <li key={i}>{item}</li>)}
                   {politician.trackRecord.promisesBroken.length > 1 && <li>...and more.</li>}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex-col gap-2 !pt-4">
         {politician.legalOversight.hasAdverseFindings && (
            <Badge variant="destructive" className="w-full justify-center">
              <Gavel className="mr-2 h-4 w-4" />
              Adverse Findings Reported
            </Badge>
         )}
         <Link href={`/politicians/${politician.id}`} passHref className="w-full">
            <Button className="w-full" variant="outline">
              View Full Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
      </CardFooter>
    </Card>
  );
}
