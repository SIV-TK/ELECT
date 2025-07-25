"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Users, TrendingUp, MessageSquare, Vote, Brain, Map, Activity, Eye, Shield, GraduationCap, UserCheck, Network, AlertTriangle, Search, Zap, Globe, Target, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function IntegratedDashboard() {
  const [realTimeData, setRealTimeData] = useState({
    activeCitizens: 0,
    sentimentAnalyses: 0,
    livePolls: 0,
    chatMessages: 0,
    verifiedPoliticians: 0
  });

  const [trendingTopics, setTrendingTopics] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityCount, setActivityCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const allFeatures = [
    { name: 'Sentiment Analysis', href: '/sentiment-analysis', description: 'AI Opinion Tracking' },
    { name: 'Live Results', href: '/live-tally', description: 'Real-time Voting' },
    { name: 'Fact Checker', href: '/fact-check', description: 'Verify Claims' },
    { name: 'Media Bias', href: '/media-bias', description: 'News Analysis' },
    { name: 'Risk Analysis', href: '/corruption-risk', description: 'Corruption Assessment' },
    { name: 'Networks', href: '/influence-network', description: 'Political Connections' },
    { name: 'Map', href: '/constituency-map', description: 'Electoral Boundaries' },
    { name: 'Education', href: '/voter-education', description: 'Civic Learning' },
    { name: 'Register', href: '/voter-registration', description: 'Voter Registration' },
    { name: 'Politicians', href: '/politicians', description: 'Candidate Profiles' }
  ];

  const filteredFeatures = searchTerm 
    ? allFeatures.filter(feature => 
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch('/api/realtime/dashboard');
        const data = await response.json();
        setRealTimeData(data);
        setTrendingTopics(data.trendingTopics);
        setRecentActivity(data.userActivities);
      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
      }
    };

    const fetchUserActivity = async () => {
      try {
        const response = await fetch('/api/realtime/user-activity');
        const data = await response.json();
        setRecentActivity(data.activities);
        setActivityCount(prev => prev + 1);
      } catch (error) {
        console.error('Failed to fetch user activity:', error);
      }
    };

    fetchRealTimeData();
    fetchUserActivity();
    const dashboardInterval = setInterval(fetchRealTimeData, 10000);
    const activityInterval = setInterval(fetchUserActivity, 3000);
    return () => {
      clearInterval(dashboardInterval);
      clearInterval(activityInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-3xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-2xl">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Democracy Dashboard
                  </h1>
                  <p className="text-primary font-medium">AI-Powered Political Intelligence</p>
                </div>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Real-time insights, sentiment analysis, and democratic engagement tools powered by advanced AI
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search political tools, candidates, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-6 h-14 bg-transparent border-0 text-lg focus:ring-0 focus:outline-none"
                />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted/50 transition-colors"
                    >
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {searchTerm && filteredFeatures.length > 0 && (
              <Card className="mt-4 max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border border-white/20 animate-scale-in">
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground mb-3 px-3">Found {filteredFeatures.length} tools</div>
                  {filteredFeatures.slice(0, 5).map((feature, index) => (
                    <Link key={feature.href} href={feature.href}>
                      <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 cursor-pointer transition-all duration-200 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-200">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{feature.name}</div>
                          <div className="text-xs text-muted-foreground">{feature.description}</div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {filteredFeatures.length > 5 && (
                    <div className="text-center pt-2 border-t border-muted/20 mt-2">
                      <span className="text-xs text-muted-foreground">+{filteredFeatures.length - 5} more tools available</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {searchTerm && filteredFeatures.length === 0 && (
              <Card className="mt-4 max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-xl border border-white/20 animate-scale-in">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/20 flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">No tools found for "{searchTerm}"</div>
                  <div className="text-xs text-muted-foreground mt-1">Try searching for: sentiment, fact check, media bias, or corruption</div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Live</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{realTimeData.activeCitizens.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Active Citizens</div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% today
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">AI</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{realTimeData.sentimentAnalyses.toLocaleString()}</div>
                <div className="text-sm text-gray-600">AI Analyses</div>
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Real-time
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Vote className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{realTimeData.livePolls}</div>
                <div className="text-sm text-gray-600">Live Polls</div>
                <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Ongoing
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-orange-500/10">
                    <Globe className="h-6 w-6 text-orange-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">24/7</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">247</div>
                <div className="text-sm text-gray-600">Global Insights</div>
                <div className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Monitoring
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-2xl" />
            <Card className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Quick Actions
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600">
                  Access powerful AI tools with one click
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Link href="/sentiment-analysis" className="group">
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <div className="relative z-10 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <BarChart3 className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="font-bold text-blue-900 mb-2">Sentiment</h4>
                        <p className="text-xs text-blue-700">AI Opinion Tracking</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-300">AI</Badge>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/live-tally" className="group">
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <div className="relative z-10 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <Vote className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="font-bold text-green-900 mb-2">Live Tally</h4>
                        <p className="text-xs text-green-700">Real-time Results</p>
                        <Badge className="mt-2 bg-green-100 text-green-700 border-green-300">Live</Badge>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/politicians" className="group">
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <div className="relative z-10 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <Users className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="font-bold text-purple-900 mb-2">Politicians</h4>
                        <p className="text-xs text-purple-700">Candidate Profiles</p>
                        <Badge className="mt-2 bg-purple-100 text-purple-700 border-purple-300">Profiles</Badge>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/crowd-sourced-intel" className="group">
                    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                      <div className="relative z-10 text-center">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <Network className="h-7 w-7 text-white" />
                        </div>
                        <h4 className="font-bold text-orange-900 mb-2">Intel</h4>
                        <p className="text-xs text-orange-700">Crowd Intelligence</p>
                        <Badge className="mt-2 bg-orange-100 text-orange-700 border-orange-300">Community</Badge>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <Link href="/demo-voting" className="group">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 border border-cyan-200 hover:border-cyan-300 transition-all duration-200 transform hover:scale-105">
                      <div className="text-center">
                        <Vote className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                        <h4 className="font-medium text-cyan-900 text-sm">Demo Vote</h4>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/campaign-advice" className="group">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border border-yellow-200 hover:border-yellow-300 transition-all duration-200 transform hover:scale-105">
                      <div className="text-center">
                        <Brain className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                        <h4 className="font-medium text-yellow-900 text-sm">AI Advice</h4>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/verification-gallery" className="group">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200 hover:border-red-300 transition-all duration-200 transform hover:scale-105">
                      <div className="text-center">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-red-600" />
                        <h4 className="font-medium text-red-900 text-sm">Verify</h4>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/political-chat" className="group">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 border border-indigo-200 hover:border-indigo-300 transition-all duration-200 transform hover:scale-105">
                      <div className="text-center">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-indigo-600" />
                        <h4 className="font-medium text-indigo-900 text-sm">AI Chat</h4>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/constituency-map" className="group">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 border border-teal-200 hover:border-teal-300 transition-all duration-200 transform hover:scale-105">
                      <div className="text-center">
                        <Map className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                        <h4 className="font-medium text-teal-900 text-sm">Map</h4>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/admin" className="group">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-105">
                      <div className="text-center">
                        <Shield className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                        <h4 className="font-medium text-gray-900 text-sm">Admin</h4>
                      </div>
                    </div>
                  </Link>
                </div>


              </CardContent>
            </Card>

        </div>

        {/* AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-2xl" />
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Live Trends</CardTitle>
                    <CardDescription>AI-powered political insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { topic: "Economic Policy", sentiment: 0.7, mentions: 2340, trend: "up" },
                    { topic: "Healthcare Reform", sentiment: 0.4, mentions: 1890, trend: "up" },
                    { topic: "Education Funding", sentiment: -0.2, mentions: 1560, trend: "down" },
                    { topic: "Infrastructure", sentiment: 0.6, mentions: 1230, trend: "up" }
                  ].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{topic.topic}</span>
                          <Badge variant={topic.sentiment > 0 ? "default" : "destructive"} className="text-xs">
                            {topic.sentiment > 0 ? "Positive" : "Negative"}
                          </Badge>
                          <div className={`flex items-center gap-1 text-xs ${
                            topic.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className={`h-3 w-3 ${
                              topic.trend === 'down' ? 'rotate-180' : ''
                            }`} />
                            {topic.trend === 'up' ? '+' : '-'}12%
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {topic.mentions.toLocaleString()} mentions today
                        </div>
                      </div>
                      <div className="w-24">
                        <Progress 
                          value={Math.abs(topic.sentiment) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-2xl" />
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">AI Analysis</CardTitle>
                    <CardDescription>Instant political insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="relative">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input 
                          placeholder="Analyze politician or topic..."
                          className="h-12 bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                          id="quick-sentiment-input"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <Button 
                        className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                        onClick={() => {
                          const input = document.getElementById('quick-sentiment-input') as HTMLInputElement;
                          if (input?.value) {
                            window.location.href = `/sentiment-analysis?candidate=${encodeURIComponent(input.value)}`;
                          }
                        }}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Analyze
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-700">Popular Analyses:</div>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { name: 'William Ruto', sentiment: 'Positive', score: 78, color: 'green' },
                        { name: 'Raila Odinga', sentiment: 'Neutral', score: 52, color: 'yellow' },
                        { name: 'Martha Karua', sentiment: 'Positive', score: 71, color: 'green' },
                        { name: 'Rigathi Gachagua', sentiment: 'Mixed', score: 45, color: 'orange' }
                      ].map((politician) => (
                        <Button 
                          key={politician.name}
                          variant="ghost" 
                          className="h-12 justify-between p-4 hover:bg-gray-50 transition-all duration-200 rounded-xl"
                          onClick={() => window.location.href = `/sentiment-analysis?candidate=${encodeURIComponent(politician.name)}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              politician.color === 'green' ? 'bg-green-500' :
                              politician.color === 'yellow' ? 'bg-yellow-500' :
                              politician.color === 'orange' ? 'bg-orange-500' :
                              'bg-gray-500'
                            }`} />
                            <span className="font-medium">{politician.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{politician.score}%</span>
                            <Badge variant="outline" className="text-xs">{politician.sentiment}</Badge>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      AI analyzing 50K+ data points in real-time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-3xl blur-2xl" />
          <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Live Activity</CardTitle>
                    <CardDescription>Real-time democratic engagement</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New sentiment analysis", user: "John K.", time: "2 min ago", type: "analysis" },
                  { action: "Politician profile viewed", user: "Sarah M.", time: "5 min ago", type: "view" },
                  { action: "Live poll participation", user: "David O.", time: "8 min ago", type: "vote" },
                  { action: "AI chat interaction", user: "Mary W.", time: "12 min ago", type: "chat" },
                  { action: "Fact check request", user: "Peter N.", time: "15 min ago", type: "verify" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'analysis' ? 'bg-blue-100' :
                      activity.type === 'view' ? 'bg-purple-100' :
                      activity.type === 'vote' ? 'bg-green-100' :
                      activity.type === 'chat' ? 'bg-orange-100' :
                      'bg-red-100'
                    }`}>
                      {activity.type === 'analysis' && <BarChart3 className="h-5 w-5 text-blue-600" />}
                      {activity.type === 'view' && <Eye className="h-5 w-5 text-purple-600" />}
                      {activity.type === 'vote' && <Vote className="h-5 w-5 text-green-600" />}
                      {activity.type === 'chat' && <MessageSquare className="h-5 w-5 text-orange-600" />}
                      {activity.type === 'verify' && <Shield className="h-5 w-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-600">by {activity.user} • {activity.time}</div>
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