"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Vote, Brain, TrendingUp, Activity, Search, MessageSquare, Eye, Shield, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { LogOut } from 'lucide-react';

function LogoutButton() {
  const { signOut, user } = useFirebaseAuth();
  
  return (
    <Button
      onClick={signOut}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [realTimeData, setRealTimeData] = useState({
    activeCitizens: 1247832,
    analyses: 892456,
    livePolls: 12,
    accuracy: 99.2
  });
  
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [politicianSentiments, setPoliticianSentiments] = useState([]);
  const [govPopularity, setGovPopularity] = useState({ approve: 30, disapprove: 25, neutral: 45, overall: 58 });
  const [loading, setLoading] = useState(true);
  const [constitutionQuery, setConstitutionQuery] = useState('');
  const [isConstitutionLoading, setIsConstitutionLoading] = useState(false);
  const [showConstitutionModal, setShowConstitutionModal] = useState(false);
  const [constitutionAnswer, setConstitutionAnswer] = useState(null);
  const [recentAmendments, setRecentAmendments] = useState([]);

  // Fetch real-time dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/realtime/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setRealTimeData({
          activeCitizens: data.activeCitizens,
          analyses: data.analyses,
          livePolls: data.livePolls,
          accuracy: data.accuracy
        });
      }
      

      
      setLoading(false);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch dashboard data:', error);
      }
      setLoading(false);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const response = await fetch('/api/trending-topics');
      const data = await response.json();
      setTrendingTopics(data.data || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch trending topics:', error);
      }
    }
  };

  const fetchGovPopularity = async () => {
    try {
      const response = await fetch('/api/government-popularity');
      const data = await response.json();
      setGovPopularity(data.data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch government popularity:', error);
      }
    }
  };

  const fetchPoliticianSentiments = async () => {
    try {
      const response = await fetch('/api/politician-sentiment');
      const data = await response.json();
      setPoliticianSentiments(data.politicians || []);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch politician sentiments:', error);
      }
    }
  };

  const askConstitution = async () => {
    if (!constitutionQuery.trim()) return;
    
    setIsConstitutionLoading(true);
    setShowConstitutionModal(true);
    setConstitutionAnswer(null);
    
    try {
      const response = await fetch('/api/constitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: constitutionQuery, includeAmendments: true })
      });
      
      const data = await response.json();
      setConstitutionAnswer(data.data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to get constitution explanation:', error);
      }
    } finally {
      setIsConstitutionLoading(false);
    }
  };

  const showRecentAmendments = async () => {
    setIsConstitutionLoading(true);
    setShowConstitutionModal(true);
    setConstitutionAnswer(null);
    
    try {
      const response = await fetch('/api/constitution');
      const data = await response.json();
      setRecentAmendments(data.data);
      
      setConstitutionAnswer({
        explanation: '<h3>Recent Constitutional Amendments</h3><p>Here are the latest constitutional changes and proposed amendments from Parliament and KLRC:</p>',
        relevantArticles: ['Recent Changes'],
        practicalExample: 'These amendments affect how government operates and your rights as a citizen.',
        citizenRights: data.data.map(a => `${a.title} - ${a.source}`)
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to get recent amendments:', error);
      }
    } finally {
      setIsConstitutionLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchTrendingTopics();
    fetchGovPopularity();
    fetchPoliticianSentiments();
    
    const dashboardInterval = setInterval(fetchDashboardData, 30000);
    const topicsInterval = setInterval(fetchTrendingTopics, 45000);
    const popularityInterval = setInterval(fetchGovPopularity, 60000);
    const sentimentInterval = setInterval(fetchPoliticianSentiments, 60000);
    
    return () => {
      clearInterval(dashboardInterval);
      clearInterval(topicsInterval);
      clearInterval(popularityInterval);
      clearInterval(sentimentInterval);
    };
  }, []);

  return (
    <AuthGuard>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kenya Political Intelligence Dashboard</h1>
            <p className="text-gray-600">Real-time political sentiment and data visualization</p>
          </div>
          <LogoutButton />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Real-time Stats */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Live Statistics</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Users className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div className="text-base sm:text-xl font-bold text-blue-900">
                {loading ? '...' : (realTimeData.activeCitizens / 1000).toFixed(0) + 'K'}
              </div>
              <div className="text-xs sm:text-sm text-blue-700">Citizens</div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <Brain className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse" />
              </div>
              <div className="text-base sm:text-xl font-bold text-green-900">
                {loading ? '...' : (realTimeData.analyses / 1000).toFixed(0) + 'K'}
              </div>
              <div className="text-xs sm:text-sm text-green-700">Analyses</div>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-2 sm:p-4 text-center">
              <Vote className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600 mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-xl font-bold text-purple-900">
                {loading ? '...' : realTimeData.livePolls}
              </div>
              <div className="text-xs sm:text-sm text-purple-700">Polls</div>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-2 sm:p-4 text-center">
              <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600 mx-auto mb-1 sm:mb-2" />
              <div className="text-base sm:text-xl font-bold text-orange-900">
                {loading ? '...' : realTimeData.accuracy.toFixed(1)}%
              </div>
              <div className="text-xs sm:text-sm text-orange-700">Accuracy</div>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Link href="/sentiment-analysis">
                  <div className="p-2 sm:p-3 text-center rounded-lg bg-blue-50 active:bg-blue-100 transition-colors cursor-pointer min-h-[60px] sm:min-h-[80px] flex flex-col justify-center">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Sentiment</div>
                    <div className="text-xs text-gray-500 hidden sm:block">Analyze opinion</div>
                  </div>
                </Link>
                <Link href="/constitution">
                  <div className="p-2 sm:p-3 text-center rounded-lg bg-green-50 active:bg-green-100 transition-colors cursor-pointer min-h-[60px] sm:min-h-[80px] flex flex-col justify-center">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Constitution</div>
                    <div className="text-xs text-gray-500 hidden sm:block">AI explains law</div>
                  </div>
                </Link>
                <Link href="/media-bias">
                  <div className="p-3 text-center rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                    <Eye className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Media Bias</div>
                    <div className="text-xs text-gray-500">Detect news bias</div>
                  </div>
                </Link>
                <Link href="/corruption-risk">
                  <div className="p-3 text-center rounded-lg bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
                    <Shield className="h-6 w-6 text-red-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Risk Analysis</div>
                    <div className="text-xs text-gray-500">Assess corruption risk</div>
                  </div>
                </Link>
                <Link href="/campaign-advice">
                  <div className="p-3 text-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                    <Brain className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">AI Advice</div>
                    <div className="text-xs text-gray-500">Strategic guidance</div>
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
                    <div className="text-xs font-medium mb-1">Live Tally</div>
                    <div className="text-xs text-gray-500">Real-time results</div>
                  </div>
                </Link>
                <Link href="/demo-voting">
                  <div className="p-3 text-center rounded-lg bg-cyan-50 hover:bg-cyan-100 transition-colors cursor-pointer">
                    <Vote className="h-6 w-6 text-cyan-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Demo Vote</div>
                    <div className="text-xs text-gray-500">Practice voting</div>
                  </div>
                </Link>
                <Link href="/crowd-sourced-intel">
                  <div className="p-3 text-center rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Intel</div>
                    <div className="text-xs text-gray-500">Citizen reports</div>
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
                    <div className="text-xs font-medium mb-1">Fact Check</div>
                    <div className="text-xs text-gray-500">Verify claims</div>
                  </div>
                </Link>
                <Link href="/politicians">
                  <div className="p-3 text-center rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-slate-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Politicians</div>
                    <div className="text-xs text-gray-500">Leader profiles</div>
                  </div>
                </Link>
                <Link href="/influence-network">
                  <div className="p-3 text-center rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Networks</div>
                    <div className="text-xs text-gray-500">Power connections</div>
                  </div>
                </Link>
                <Link href="/verification-gallery">
                  <div className="p-3 text-center rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
                    <Shield className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Verify</div>
                    <div className="text-xs text-gray-500">Content validation</div>
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
                    <div className="text-xs font-medium mb-1">Education</div>
                    <div className="text-xs text-gray-500">Learn civics</div>
                  </div>
                </Link>
                <Link href="/voter-registration">
                  <div className="p-3 text-center rounded-lg bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Register</div>
                    <div className="text-xs text-gray-500">Sign up to vote</div>
                  </div>
                </Link>
                <Link href="/constituency-map">
                  <div className="p-3 text-center rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors cursor-pointer">
                    <MessageSquare className="h-6 w-6 text-teal-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Map</div>
                    <div className="text-xs text-gray-500">Find your area</div>
                  </div>
                </Link>
                <Link href="/profile">
                  <div className="p-3 text-center rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <Users className="h-6 w-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-xs font-medium mb-1">Profile</div>
                    <div className="text-xs text-gray-500">Your account</div>
                  </div>
                </Link>
              </div>
            </div>
            
          </CardContent>
        </Card>

        {/* Ask About Constitution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-green-600" />
              Ask About the Constitution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="e.g., What are my fundamental rights?"
                value={constitutionQuery}
                onChange={(e) => setConstitutionQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askConstitution()}
                className="flex-1"
              />
              <Button onClick={askConstitution} disabled={isConstitutionLoading || !constitutionQuery.trim()}>
                {isConstitutionLoading ? 'Loading...' : 'Ask AI'}
              </Button>
              <Button onClick={showRecentAmendments} variant="secondary" size="sm">
                Recent Amendments
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['What are my rights?', 'How does voting work?', 'What is devolution?'].map((q, i) => (
                <Button key={i} variant="outline" size="sm" onClick={() => setConstitutionQuery(q)} className="text-xs">
                  {q}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Constitution Answer Modal */}
        {showConstitutionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-green-600" />
                  Constitution Explanation
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowConstitutionModal(false)}>×</Button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {constitutionAnswer ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Explanation</h4>
                      <div className="text-gray-800 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: constitutionAnswer.explanation }} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Relevant Articles</h4>
                      <div className="flex flex-wrap gap-2">
                        {constitutionAnswer.relevantArticles.map((article, i) => (
                          <Badge key={i} variant="outline">{article}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Practical Example</h4>
                      <div className="text-sm bg-green-50 p-3 rounded" dangerouslySetInnerHTML={{ __html: constitutionAnswer.practicalExample }} />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{recentAmendments.length > 0 ? 'Recent Amendments' : 'Your Rights'}</h4>
                      {recentAmendments.length > 0 ? (
                        <div className="space-y-3">
                          {recentAmendments.map((amendment, i) => (
                            <div key={i} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                              <h5 className="font-medium text-sm">{amendment.title}</h5>
                              <p className="text-xs text-gray-600 mt-1">{amendment.summary}</p>
                              <span className="text-xs bg-blue-100 px-2 py-1 rounded mt-2 inline-block">{amendment.source}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="space-y-1">
                          {constitutionAnswer.citizenRights.map((right, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600">•</span>{right}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-2 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Getting explanation...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Trending Topics */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80 overflow-hidden">
                <div className="animate-scroll space-y-2 sm:space-y-4">
                  {[...trendingTopics, ...trendingTopics].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 flex-shrink-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-medium text-xs sm:text-sm truncate">{topic.topic}</span>
                          <Badge variant={topic.sentiment > 0 ? "default" : "destructive"} className="text-xs px-1 flex-shrink-0">
                            {topic.sentiment > 0 ? "+" : "-"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">{(topic.mentions / 1000).toFixed(0)}K</div>
                      </div>
                      <div className="w-12 sm:w-16 flex-shrink-0">
                        <Progress value={Math.abs(topic.sentiment || 0) * 100} className="h-1.5 sm:h-2" />
                      </div>
                    </div>
                  ))}
                </div>
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
              <div className="h-80 overflow-hidden">
                <div className="animate-scroll space-y-4">
                  {[...politicianSentiments, ...politicianSentiments].map((politician, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50 flex-shrink-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{politician.name}</div>
                        <Badge variant="outline" className="text-xs">{politician.party}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={politician.sentiment * 100} className="flex-1 h-2" />
                        <span className="text-xs font-medium">{(politician.sentiment * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-xs text-gray-600">{politician.mentions?.toLocaleString()} mentions</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Government Popularity */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Government Popularity
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8" 
                            strokeDasharray="75.4 251.2" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ef4444" strokeWidth="8" 
                            strokeDasharray="62.8 251.2" strokeDashoffset="-75.4" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="8" 
                            strokeDasharray="113.1 251.2" strokeDashoffset="-138.2" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{govPopularity.overall}%</div>
                      <div className="text-xs text-gray-600">Approval</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Approve</span>
                  </div>
                  <span className="text-sm font-medium">{govPopularity.approve}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Disapprove</span>
                  </div>
                  <span className="text-sm font-medium">{govPopularity.disapprove}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm">Neutral</span>
                  </div>
                  <span className="text-sm font-medium">{govPopularity.neutral}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Sauti Platform</h3>
              <p className="text-gray-400 text-sm">Kenya's premier political intelligence and civic engagement platform.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>AI Sentiment Analysis</li>
                <li>Live Election Monitoring</li>
                <li>Fact Checking</li>
                <li>Civic Education</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>Constitution 2010</li>
                <li>Electoral Laws</li>
                <li>Voter Guide</li>
                <li>Political Parties</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <p>info@sauti.ke</p>
                <p>+254 700 000 000</p>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 Sauti Platform. Empowering Kenyan Democracy.</p>
          </div>
        </div>
      </footer>
    </div>
    </AuthGuard>
  );
}