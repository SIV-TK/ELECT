// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Lightbulb, Users, BotMessageSquare, Vote, UsersRound, GalleryVertical, Landmark } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const featureCards = [
  {
    title: "Politician Track Records",
    description: "Explore the history, promises, and performance of political leaders.",
    icon: Users,
    href: "/politicians",
    color: "text-blue-500",
  },
  {
    title: "Demo Voting",
    description: "Participate in mock elections and see real-time results and predictions.",
    icon: Vote,
    href: "/demo-voting",
    color: "text-green-500",
  },
  {
    title: "Live Tally",
    description: "Follow simulated real-time election results and verify them with the community.",
    icon: Landmark,
    href: "/live-tally",
    color: "text-red-500",
  },
  {
    title: "Sentiment Analysis",
    description: "Analyze public opinion on candidates and key issues using AI.",
    icon: BotMessageSquare,
    href: "/sentiment-analysis",
    color: "text-purple-500",
  },
  {
    title: "Campaign Advisor",
    description: "Get AI-powered strategic advice for political campaigns.",
    icon: Lightbulb,
    href: "/campaign-advice",
    color: "text-orange-500",
  },
   {
    title: "Crowd Sourced Intel",
    description: "Upload and verify videos of politicians. Let AI analyze for authenticity.",
    icon: UsersRound,
    href: "/crowd-sourced-intel",
    color: "text-teal-500",
  },
  {
    title: "Verification Gallery",
    description: "Browse and verify community-submitted intel on politicians.",
    icon: GalleryVertical,
    href: "/verification-gallery",
    color: "text-indigo-500",
  },
];

export default function DashboardPage() {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-full" />
                </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-[120px]">
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Sauti Ya Watu Dashboard</CardTitle>
          <CardDescription>
            Welcome, {user?.fullName}! This is your one-stop platform for transparent and insightful Kenyan election data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Navigate through different sections using the sidebar or the cards below to access detailed politician records, participate in demo voting, and explore our advanced AI-powered analytics.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <Link href={feature.href} key={feature.title} className="block hover:scale-[1.02] transition-transform duration-200">
            <Card className="hover:border-primary transition-colors h-full flex flex-col shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium font-headline">{feature.title}</CardTitle>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6" />
            <CardTitle className="font-headline">Election Data at a Glance</CardTitle>
          </div>
          <CardDescription>
            This dashboard provides a high-level overview of the political landscape. Dive into the specific sections for a deeper analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Interactive charts and data visualizations will be displayed here.</p>
            <p className="text-sm">Visit the dedicated pages to see them in action.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
