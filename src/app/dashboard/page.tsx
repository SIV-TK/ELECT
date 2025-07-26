"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, Vote, Brain, TrendingUp, Activity, Search, MessageSquare, Eye, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [realTimeData, setRealTimeData] = useState({
    activeCitizens: 1247832,
    analyses: 892456,
    livePolls: 12,
    accuracy: 99.2
  });
  
  const [trendingTopics, setTrendingTopics] = useState([
    { topic: "Economic Policy", mentions: 15420, sentiment: 0.65, trend: "up" },
    { topic: "Healthcare Reform", mentions: 12890, sentiment: 0.42, trend: "up" },
    { topic: "Education Funding", mentions: 9876, sentiment: -0.23, trend: "down" },
    { topic: "Infrastructure", mentions: 8543, sentiment: 0.78, trend: "up" },
    { topic: "Corruption Cases", mentions: 7234, sentiment: -0.56, trend: "down" }
  ]);

  const [politicianSentiments, setPoliticianSentiments] = useState([
    { name: "William Ruto", sentiment: 0.72, mentions: 45230, party: "UDA", trend: "up" },
    { name: "Raila Odinga", sentiment: 0.58, mentions: 38940, party: "ODM", trend: "stable" },
    { name: "Martha Karua", sentiment: 0.64, mentions: 23450, party: "Narc-K", trend: "up" },
    { name: "Rigathi Gachagua", sentiment: 0.41, mentions: 19870, party: "UDA", trend: "down" },
    { name: "Kalonzo Musyoka", sentiment: 0.52, mentions: 15670, party: "Wiper", trend: "stable" }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: "New sentiment analysis completed", time: "2 min ago", type: "analysis" },
    { action: "Live poll started in Nairobi", time: "5 min ago", type: "poll" },
    { action: "Fact check verified", time: "8 min ago", type: "verification" },
    { action: "Media bias detected", time: "12 min ago", type: "bias" },
    { action: "Corruption risk alert", time: "15 min ago", type: "alert" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeCitizens: prev.activeCitizens + Math.floor(Math.random() * 50),
        analyses: prev.analyses + Math.floor(Math.random() * 25),
        livePolls: prev.livePolls + (Math.random() > 0.8 ? 1 : 0),
        accuracy: 99.2 + (Math.random() * 0.6 - 0.3)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kenya Political Intelligence Dashboard</h1>
          <p className="text-gray-600">Real-time political sentiment and data visualization</p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-6 w-6 text-blue-600" />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xl font-bold text-blue-900">{realTimeData.activeCitizens.toLocaleString()}</div>
              <div className="text-sm text-blue-700">Active Citizens</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="h-6 w-6 text-green-600" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <div className="text-xl font-bold text-green-900">{realTimeData.analyses.toLocaleString()}</div>
              <div className="text-sm text-green-700">AI Analyses</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <Vote className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-purple-900">{realTimeData.livePolls}</div>
              <div className="text-sm text-purple-700">Live Polls</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-orange-900">{realTimeData.accuracy.toFixed(1)}%</div>
              <div className="text-sm text-orange-700">AI Accuracy</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tools */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Access Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* AI Analysis */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">AI Analysis</h3>
              <p className="text-xs text-gray-600 mb-3">Advanced AI tools for political sentiment, media bias, and risk analysis</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/sentiment-analysis">
                  <div className="p-3 text-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                    <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Sentiment</div>
                  </div>
                </Link>
                <Link href="/media-bias">
                  <div className="p-3 text-center rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                    <Eye className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Media Bias</div>
                  </div>
                </Link>
                <Link href="/corruption-risk">
                  <div className="p-3 text-center rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                    <Shield className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Risk Analysis</div>
                  </div>
                </Link>
                <Link href="/campaign-advice">
                  <div className="p-3 text-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                    <Brain className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">AI Advice</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Live Tools */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Live Tools</h3>
              <p className="text-xs text-gray-600 mb-3">Real-time election monitoring and crowd-sourced intelligence</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link href="/live-tally">
                  <div className="p-3 text-center rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                    <Vote className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Live Tally</div>
                  </div>
                </Link>
                <Link href="/demo-voting">
                  <div className="p-3 text-center rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-colors cursor-pointer">
                    <Vote className="h-6 w-6 text-cyan-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Demo Vote</div>
                  </div>
                </Link>
                <Link href="/crowd-sourced-intel">
                  <div className="p-3 text-center rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Intel</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Information & Verification</h3>
              <p className="text-xs text-gray-600 mb-3">Fact-checking, politician profiles, and verification systems</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/fact-check">
                  <div className="p-3 text-center rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                    <Shield className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Fact Check</div>
                  </div>
                </Link>
                <Link href="/politicians">
                  <div className="p-3 text-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-slate-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Politicians</div>
                  </div>
                </Link>
                <Link href="/influence-network">
                  <div className="p-3 text-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Networks</div>
                  </div>
                </Link>
                <Link href="/verification-gallery">
                  <div className="p-3 text-center rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
                    <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Verify</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Civic */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Civic Engagement</h3>
              <p className="text-xs text-gray-600 mb-3">Educational resources, voter registration, and citizen participation</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/voter-education">
                  <div className="p-3 text-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                    <Brain className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Education</div>
                  </div>
                </Link>
                <Link href="/voter-registration">
                  <div className="p-3 text-center rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Register</div>
                  </div>
                </Link>
                <Link href="/constituency-map">
                  <div className="p-3 text-center rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer">
                    <MessageSquare className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Map</div>
                  </div>
                </Link>
                <Link href="/profile">
                  <div className="p-3 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-xs font-medium">Profile</div>
                  </div>
                </Link>
              </div>
            </div>
            
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Trending Topics */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{topic.topic}</span>
                        <Badge variant={topic.sentiment > 0 ? "default" : "destructive"} className="text-xs">
                          {topic.sentiment > 0 ? "Positive" : "Negative"}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">{topic.mentions.toLocaleString()} mentions</div>
                    </div>
                    <div className="w-16">
                      <Progress value={Math.abs(topic.sentiment) * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Politician Sentiments */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Political Sentiments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {politicianSentiments.map((politician, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{politician.name}</div>
                      <Badge variant="outline" className="text-xs">{politician.party}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={politician.sentiment * 100} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{(politician.sentiment * 100).toFixed(0)}%</span>
                    </div>
                    <div className="text-xs text-gray-600">{politician.mentions.toLocaleString()} mentions</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Activity */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Live Activity
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}