// src/app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Lightbulb, Users, BotMessageSquare, Vote, UsersRound, GalleryVertical, Landmark, User as UserIcon } from "lucide-react";
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
  const [showProfile, setShowProfile] = useState(false);
  const [rutoSentiment, setRutoSentiment] = useState<any>(null);
  const [gachaguaSentiment, setGachaguaSentiment] = useState<any>(null);
  const [loadingSentiment, setLoadingSentiment] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const fetchSentimentData = async () => {
    setLoadingSentiment(true);
    try {
      const [rutoResponse, gachaguaResponse] = await Promise.all([
        fetch('/api/politician-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ politicianName: 'William Ruto' }),
        }),
        fetch('/api/politician-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ politicianName: 'Rigathi Gachagua' }),
        })
      ]);
      
      const rutoData = await rutoResponse.json();
      const gachaguaData = await gachaguaResponse.json();
      
      if (rutoData.success) setRutoSentiment(rutoData.data);
      if (gachaguaData.success) setGachaguaSentiment(gachaguaData.data);
    } catch (error) {
      console.error('Failed to fetch sentiment data:', error);
    } finally {
      setLoadingSentiment(false);
    }
  };

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
      <div className="flex justify-between items-start gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center justify-between">
              Sauti Ya Watu Dashboard
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(!showProfile)}>
                <UserIcon className="h-6 w-6" />
              </Button>
            </CardTitle>
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
        
        {showProfile && (
          <Card className="w-80">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user?.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => router.push('/profile')}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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



      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart className="h-6 w-6" />
                <CardTitle className="font-headline">William Ruto Sentiment</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={fetchSentimentData} disabled={loadingSentiment}>
                {loadingSentiment ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            <CardDescription>
              Real-time public sentiment analysis for President William Ruto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rutoSentiment ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Approval</span>
                  <Badge variant={rutoSentiment.approval === 'High' ? 'default' : rutoSentiment.approval === 'Low' ? 'destructive' : 'secondary'}>
                    {rutoSentiment.approval}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Positive</span>
                    <span>{rutoSentiment.positive}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${rutoSentiment.positive}%`}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Negative</span>
                    <span>{rutoSentiment.negative}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: `${rutoSentiment.negative}%`}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Neutral</span>
                    <span>{rutoSentiment.neutral}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{width: `${rutoSentiment.neutral}%`}}></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {rutoSentiment.dataPoints} data points • Updated: {new Date(rutoSentiment.lastUpdated).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Click Refresh to load real-time sentiment data</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart className="h-6 w-6" />
                <CardTitle className="font-headline">Rigathi Gachagua Sentiment</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={fetchSentimentData} disabled={loadingSentiment}>
                {loadingSentiment ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
            <CardDescription>
              Real-time public sentiment analysis for Deputy President Rigathi Gachagua.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gachaguaSentiment ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Approval</span>
                  <Badge variant={gachaguaSentiment.approval === 'High' ? 'default' : gachaguaSentiment.approval === 'Low' ? 'destructive' : 'secondary'}>
                    {gachaguaSentiment.approval}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Positive</span>
                    <span>{gachaguaSentiment.positive}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${gachaguaSentiment.positive}%`}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Negative</span>
                    <span>{gachaguaSentiment.negative}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: `${gachaguaSentiment.negative}%`}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Neutral</span>
                    <span>{gachaguaSentiment.neutral}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gray-500 h-2 rounded-full" style={{width: `${gachaguaSentiment.neutral}%`}}></div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {gachaguaSentiment.dataPoints} data points • Updated: {new Date(gachaguaSentiment.lastUpdated).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Click Refresh to load real-time sentiment data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
