import { politicians } from "@/lib/data";
import { PoliticianCard } from "@/components/politicians/politician-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PoliticiansPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Politician Directory</CardTitle>
          <CardDescription>
            An overview of political leaders, their track records, and legal standing.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {politicians.map((politician) => (
          <PoliticianCard key={politician.id} politician={politician} />
        ))}
      </div>
    </div>
  );
}
