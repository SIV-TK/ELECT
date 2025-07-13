import { politicians } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { GraduationCap, School, University, Trophy } from "lucide-react";

export default function AcademicLifePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <GraduationCap />
            Politicians' Academic Life
          </CardTitle>
          <CardDescription>
            A look into the educational backgrounds of key political figures.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {politicians.map((politician) => (
          <Card key={politician.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Image
                src={politician.imageUrl}
                alt={`Photo of ${politician.name}`}
                width={80}
                height={80}
                className="rounded-full border-4 border-primary/20 object-cover"
                data-ai-hint="politician portrait"
              />
              <div>
                <CardTitle className="font-headline">{politician.name}</CardTitle>
                <CardDescription>{politician.party}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                    <School className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold">Primary & High School</h4>
                        <p className="text-muted-foreground">{politician.academicLife.primarySchool}, {politician.academicLife.highSchool}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <University className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold">University Education</h4>
                        <p className="text-muted-foreground">{politician.academicLife.university}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Trophy className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold">Notable Achievements</h4>
                         <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {politician.academicLife.notableAchievements.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
