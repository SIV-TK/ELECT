import type { Politician } from "@/types";
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
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gavel, CheckCircle, XCircle, Trophy, FileText, Briefcase, ArrowRight } from "lucide-react";

export function PoliticianCard({ politician }: { politician: Politician }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Card className="flex flex-col max-w-xs mx-auto p-2 shadow-sm rounded-lg">
      <CardHeader className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-xs font-medium">
            {politician.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
          </span>
        </div>
        <CardTitle className="mt-2 font-headline text-base">{politician.name}</CardTitle>
        <CardDescription className="text-xs">{politician.party}</CardDescription>
        <Badge variant="secondary" className="mt-1 text-xs">{politician.level} {politician.county ? `- ${politician.county}` : ''}</Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 p-2">
        <p className="text-xs text-muted-foreground text-center px-2">
          {politician.bio}
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full text-xs py-1 mt-2" onClick={() => setOpen(true)}>
              <Briefcase className="mr-2 h-4 w-4" /> Quick Look
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Track Record: {politician.name}</DialogTitle>
              <DialogDescription>{politician.party} {politician.level} {politician.county ? `- ${politician.county}` : ''}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-xs">
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
                <h4 className="font-semibold mb-1 flex items-center gap-1"><Trophy className="h-4 w-4 text-yellow-600" /> Contributions</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.trackRecord.contributions.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-1"><FileText className="h-4 w-4 text-blue-600" /> Work History</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {politician.trackRecord.workHistory.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex-col gap-1 !pt-2 p-2">
         {politician.legalOversight.hasAdverseFindings && (
            <Badge variant="destructive" className="w-full justify-center text-xs">
              <Gavel className="mr-1 h-3 w-3" />
              Adverse Findings
            </Badge>
         )}
         <Link href={`/politicians/${politician.id}`} passHref className="w-full">
            <Button className="w-full text-xs py-1" variant="outline">
              View Profile
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
      </CardFooter>
    </Card>
  );
}
