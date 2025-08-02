"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Vote, 
  Brain, 
  TrendingUp, 
  Activity, 
  Search, 
  MessageSquare, 
  Eye, 
  Shield, 
  Scale,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Filter,
  Calendar,
  MapPin
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { LogOut } from 'lucide-react';

function LogoutButton() {
  const { signOut, user } = useFirebaseAuth();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={signOut}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </motion.div>
  );
}

// Modern metric cards with enhanced animations
function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  href, 
  delay = 0 
}: { 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'neutral'; 
  icon: React.ReactNode; 
  href: string;
  delay?: number;
}) {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-yellow-600 bg-yellow-50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.25, 0, 1] }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: "0 20px 40px rgba(156, 39, 176, 0.1)" 
      }}
      className="group"
    >
      <Link href={href}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors duration-300">
                {icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                {value}
              </h3>
              <p className="text-sm text-gray-600 font-medium">{title}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
                {change}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Modern activity feed item
function ActivityItem({ 
  activity, 
  index 
}: { 
  activity: any; 
  index: number;
}) {
  const statusColors = {
    completed: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    alert: 'text-red-600 bg-red-100'
  };

  const statusIcons = {
    completed: <CheckCircle className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    alert: <AlertTriangle className="w-4 h-4" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
    >
      <div className={`p-2 rounded-lg ${statusColors[activity.status as keyof typeof statusColors]}`}>
        {statusIcons[activity.status as keyof typeof statusIcons]}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {activity.title}
        </h4>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
          {activity.description}
        </p>
        <p className="text-xs text-gray-400 mt-2">{activity.timestamp}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [realTimeData, setRealTimeData] = useState({
    activeCitizens: 1247832,
    analyses: 892456,
    livePolls: 12,
    accuracy: 99.2
  });
  
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [politicianSentiments, setPoliticianSentiments] = useState<any[]>([]);
  const [govPopularity, setGovPopularity] = useState({ 
    approve: 30, 
    disapprove: 25, 
    neutral: 45, 
    overall: 58,
    trend: 'stable' as 'up' | 'down' | 'stable',
    keyIssues: [] as string[]
  });
  const [loading, setLoading] = useState(true);
  const [constitutionQuery, setConstitutionQuery] = useState('');
  const [isConstitutionLoading, setIsConstitutionLoading] = useState(false);
  const [showConstitutionModal, setShowConstitutionModal] = useState(false);
  const [constitutionAnswer, setConstitutionAnswer] = useState<any>(null);
  const [recentAmendments, setRecentAmendments] = useState<any[]>([]);

  // Mock recent activity data
  const recentActivity = [
    {
      id: '1',
      type: 'sentiment',
      title: 'William Ruto Sentiment Analysis',
      description: 'Weekly sentiment analysis completed for President William Ruto across 47 counties',
      timestamp: '2 minutes ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'fact-check',
      title: 'BBI Amendment Fact Check',
      description: 'Verifying claims about constitutional amendments in recent parliamentary sessions',
      timestamp: '15 minutes ago',
      status: 'pending'
    },
    {
      id: '3',
      type: 'bias',
      title: 'Media Bias Alert: Daily Nation',
      description: 'Potential bias detected in recent political coverage analysis',
      timestamp: '1 hour ago',
      status: 'alert'
    },
    {
      id: '4',
      type: 'vote',
      title: 'Nairobi County Poll Results',
      description: 'Real-time voting simulation completed for gubernatorial race',
      timestamp: '2 hours ago',
      status: 'completed'
    }
  ];

  // Modern metrics data
  const metrics = [
    {
      title: 'Active Citizens',
      value: loading ? '...' : `${(realTimeData.activeCitizens / 1000).toFixed(0)}K`,
      change: '+12%',
      trend: 'up' as const,
      icon: <Users className="w-6 h-6" />,
      href: '/sentiment-analysis'
    },
    {
      title: 'AI Analyses',
      value: loading ? '...' : `${(realTimeData.analyses / 1000).toFixed(0)}K`,
      change: '+8%',
      trend: 'up' as const,
      icon: <Brain className="w-6 h-6" />,
      href: '/fact-check'
    },
    {
      title: 'Live Polls',
      value: loading ? '...' : realTimeData.livePolls.toString(),
      change: '+3',
      trend: 'up' as const,
      icon: <Vote className="w-6 h-6" />,
      href: '/demo-voting'
    },
    {
      title: 'Accuracy Rate',
      value: loading ? '...' : `${realTimeData.accuracy.toFixed(1)}%`,
      change: '+0.3%',
      trend: 'up' as const,
      icon: <Shield className="w-6 h-6" />,
      href: '/corruption-risk'
    }
  ];

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
      
      if (data.success) {
        setTrendingTopics(data.data || []);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('Trending topics API returned error:', data.error);
        }
        // Fallback to empty array to show "no data" message
        setTrendingTopics([]);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch trending topics:', error);
      }
      // Fallback to empty array to show "no data" message
      setTrendingTopics([]);
    }
  };

  const fetchGovPopularity = async () => {
    try {
      const response = await fetch('/api/government-popularity');
      const data = await response.json();
      
      if (data.success) {
        setGovPopularity(data.data);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('Government popularity API returned error:', data.error);
        }
        // Fallback to default data
        setGovPopularity({ 
          approve: 45, 
          disapprove: 30, 
          neutral: 25, 
          overall: 57,
          trend: 'stable',
          keyIssues: ['Economic Management', 'Healthcare System']
        });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to fetch government popularity:', error);
      }
      // Fallback to default data
      setGovPopularity({ 
        approve: 45, 
        disapprove: 30, 
        neutral: 25, 
        overall: 57,
        trend: 'stable',
        keyIssues: ['Economic Management', 'Healthcare System']
      });
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
        citizenRights: data.data.map((a: any) => `${a.title} - ${a.source}`)
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
    
    // Refresh data every 24 hours (86,400,000 milliseconds)
    const dashboardInterval = setInterval(fetchDashboardData, 86400000);
    const topicsInterval = setInterval(fetchTrendingTopics, 86400000);
    const popularityInterval = setInterval(fetchGovPopularity, 86400000);
    const sentimentInterval = setInterval(fetchPoliticianSentiments, 86400000);
    
    return () => {
      clearInterval(dashboardInterval);
      clearInterval(topicsInterval);
      clearInterval(popularityInterval);
      clearInterval(sentimentInterval);
    };
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-8 max-w-7xl">
          {/* Modern Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12"
          >
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent mb-3">
                Political Intelligence Hub
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Real-time analysis and insights into Kenya's political landscape powered by AI
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Data
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Updates daily
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search analytics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white/80 backdrop-blur-sm border-purple-200 focus:border-purple-400"
                />
              </div>
              <LogoutButton />
            </div>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metrics.map((metric, index) => (
              <MetricCard
                key={metric.title}
                {...metric}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Featured Constitution Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white overflow-hidden relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>
              
              <CardContent className="p-8 relative">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Scale className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Kenya Constitution 2010</h2>
                        <p className="text-emerald-100">Understanding Your Rights & Governance</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-200" />
                        <span className="text-sm">Bill of Rights</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Vote className="w-5 h-5 text-emerald-200" />
                        <span className="text-sm">Electoral System</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-200" />
                        <span className="text-sm">Devolution</span>
                      </div>
                    </div>

                    <p className="text-emerald-100 text-lg leading-relaxed mb-6">
                      Get AI-powered explanations of Kenya's supreme law. Learn about your fundamental rights, 
                      how government works, and your role in democracy with simple, clear explanations.
                    </p>
                  </div>

                  <div className="hidden lg:block ml-8">
                    <Link href="/constitution">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300 cursor-pointer border border-white/20"
                      >
                        <Scale className="w-12 h-12 mx-auto mb-3 text-white" />
                        <div className="text-lg font-semibold mb-2">Explore Now</div>
                        <div className="text-sm text-emerald-100 mb-4">AI-Powered Guide</div>
                        <div className="flex items-center justify-center gap-2 text-sm font-medium">
                          <span>Get Started</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    </Link>
                  </div>
                </div>

                {/* Mobile CTA */}
                <div className="lg:hidden mt-6">
                  <Link href="/constitution">
                    <Button 
                      size="lg" 
                      className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                    >
                      <Scale className="w-5 h-5 mr-2" />
                      Explore Constitution
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="lg:col-span-1"
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                  {/* Constitution Card - Featured */}
                  <Link href="/constitution">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 hover:border-teal-300 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                    >
                      {/* Special highlight indicator */}
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <Scale className="w-3 h-3" />
                          Important
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors duration-200">
                          <Scale className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Kenya Constitution</h3>
                          <p className="text-sm text-gray-600">Learn your rights & governance</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-emerald-200 text-emerald-700">
                              AI Guide
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-emerald-200 text-emerald-700">
                              2010
                            </Badge>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-teal-500 transition-colors duration-200" />
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/sentiment-analysis">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 hover:border-purple-200 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-200">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Sentiment Analysis</h3>
                          <p className="text-sm text-gray-600">Analyze political sentiment</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-purple-500 transition-colors duration-200" />
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/fact-check">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 hover:border-blue-200 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors duration-200">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Fact Check</h3>
                          <p className="text-sm text-gray-600">Verify political claims</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 transition-colors duration-200" />
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/media-bias">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 hover:border-orange-200 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors duration-200">
                          <Eye className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Media Bias</h3>
                          <p className="text-sm text-gray-600">Detect bias in media</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-orange-500 transition-colors duration-200" />
                      </div>
                    </motion.div>
                  </Link>

                  <Link href="/demo-voting">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:border-pink-200 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors duration-200">
                          <Vote className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Demo Voting</h3>
                          <p className="text-sm text-gray-600">Simulate elections</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-pink-500 transition-colors duration-200" />
                      </div>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Recent Activity
                    </CardTitle>
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {recentActivity.map((activity, index) => (
                      <ActivityItem
                        key={activity.id}
                        activity={activity}
                        index={index}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Analytics Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            
            {/* Trending Topics */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Trending Political Topics
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <Badge variant="secondary" className="text-xs">AI Powered</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : trendingTopics.length > 0 ? (
                    trendingTopics.slice(0, 6).map((topic, index) => (
                      <motion.div
                        key={topic.topic}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/80 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {topic.topic}
                            </h4>
                            {topic.trend && (
                              <div className={`flex items-center gap-1 ${
                                topic.trend === 'up' ? 'text-green-600' :
                                topic.trend === 'down' ? 'text-red-600' :
                                'text-yellow-600'
                              }`}>
                                {topic.trend === 'up' ? (
                                  <TrendingUp className="w-3 h-3" />
                                ) : topic.trend === 'down' ? (
                                  <ArrowUpRight className="w-3 h-3 rotate-90" />
                                ) : (
                                  <div className="w-3 h-0.5 bg-current" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {topic.mentions?.toLocaleString()} mentions
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                topic.sentiment > 0.6 ? 'border-green-200 text-green-700 bg-green-50' :
                                topic.sentiment < 0.4 ? 'border-red-200 text-red-700 bg-red-50' :
                                'border-yellow-200 text-yellow-700 bg-yellow-50'
                              }`}
                            >
                              {topic.sentiment > 0.6 ? 'Positive' :
                               topic.sentiment < 0.4 ? 'Negative' : 'Neutral'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {(Math.abs(topic.sentiment) * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {topic.sentiment > 0 ? 'positive' : topic.sentiment < 0 ? 'negative' : 'neutral'}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">Loading AI insights...</p>
                      <p className="text-sm">Connecting to real-time analysis</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Government Approval */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Government Approval
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <Badge variant="secondary" className="text-xs">AI Analysis</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke="#22c55e" 
                        strokeWidth="8" 
                        strokeDasharray={`${(govPopularity.approve / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {govPopularity.overall}%
                        </div>
                        <div className="text-sm text-gray-600">Overall Rating</div>
                        {govPopularity.trend && (
                          <div className={`flex items-center justify-center gap-1 mt-1 text-xs ${
                            govPopularity.trend === 'up' ? 'text-green-600' :
                            govPopularity.trend === 'down' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {govPopularity.trend === 'up' ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : govPopularity.trend === 'down' ? (
                              <ArrowUpRight className="w-3 h-3 rotate-90" />
                            ) : (
                              <div className="w-3 h-0.5 bg-current" />
                            )}
                            {govPopularity.trend}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {govPopularity.approve}%
                    </div>
                    <div className="text-xs text-gray-600">Approve</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {govPopularity.disapprove}%
                    </div>
                    <div className="text-xs text-gray-600">Disapprove</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">
                      {govPopularity.neutral}%
                    </div>
                    <div className="text-xs text-gray-600">Neutral</div>
                  </div>
                </div>
                {govPopularity.keyIssues && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Key Issues Affecting Approval:</div>
                    <div className="flex flex-wrap gap-1">
                      {govPopularity.keyIssues.slice(0, 3).map((issue: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}