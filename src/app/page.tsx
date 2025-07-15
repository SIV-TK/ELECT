import { ArrowRight, BarChart, BotMessageSquare, CheckSquare, Lightbulb, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Track Politician Records",
    description: "Access detailed profiles, work history, and promises of political leaders to make informed decisions.",
    href: "/politicians"
  },
  {
    icon: <CheckSquare className="h-8 w-8 text-primary" />,
    title: "Participate in Demo Voting",
    description: "Experience the voting process, cast your mock ballot, and see live results unfold in our simulation.",
    href: "/demo-voting"
  },
  {
    icon: <BotMessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Sentiment Analysis",
    description: "Gauge public opinion on candidates and key issues with our advanced AI-powered sentiment analysis tools.",
    href: "/sentiment-analysis"
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Live Tallying & Verification",
    description: "Follow simulated real-time election results from polling stations and participate in community verification.",
    href: "/live-tally"
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary font-medium">
                  For the People, By the People
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                  Your Voice, Amplified.
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Sauti Ya Watu is a non-partisan platform dedicated to bringing transparency and accountability to the Kenyan political landscape. Access data, track performance, and make your voice heard.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                 <Image 
                    src="https://placehold.co/600x400.png"
                    width={600}
                    height={400}
                    alt="Hero Image"
                    className="rounded-xl shadow-2xl"
                    data-ai-hint="kenyan flag people voting"
                 />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Empowering Citizens with Information</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore a suite of tools designed to help you stay informed and engaged with the political process.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-2">
              {features.map((feature) => (
                <Link href={feature.href} key={feature.title} className="block group">
                  <Card className="h-full hover:border-primary transition-colors duration-300 transform hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        {feature.icon}
                        <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Dive In?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore the dashboard to access all features. Your journey towards informed citizenship starts here.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Link href="/dashboard">
                  <Button size="lg" className="w-full">
                    Explore the Dashboard
                  </Button>
                </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
