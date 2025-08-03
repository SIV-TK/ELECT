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
  MapPin,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Languages
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';

function UserProfileButton() {
  const { user, signOut } = useFirebaseAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleLogout = async () => {
    await signOut();
    setIsDropdownOpen(false);
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.length > 1 
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false);
  }, [user?.photoURL]);

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden ring-2 ring-white/20 hover:ring-white/40">
          {user?.photoURL && !imageError ? (
            <img 
              src={user.photoURL} 
              alt={getUserDisplayName()}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="font-bold text-sm">{getUserInitials()}</span>
          )}
        </div>
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsDropdownOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-20 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* User Info Header */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
                    {user?.photoURL && !imageError ? (
                      <img 
                        src={user.photoURL} 
                        alt={getUserDisplayName()}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span className="font-bold">{getUserInitials()}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {user?.email || 'No email'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors duration-200 group"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    window.location.href = '/settings';
                  }}
                >
                  <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors duration-200">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                    Account Settings
                  </span>
                </motion.button>

                <div className="border-t border-gray-100 my-2" />

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors duration-200 group"
                  onClick={handleLogout}
                >
                  <div className="p-1.5 rounded-md bg-gray-100 text-gray-600 group-hover:bg-red-100 group-hover:text-red-600 transition-colors duration-200">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-red-700">
                    Sign Out
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
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
  const { toast } = useToast();
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
  const [aiChatResponse, setAiChatResponse] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [crisisAlerts, setCrisisAlerts] = useState<any[]>([]);

  const [countyAnalysisData, setCountyAnalysisData] = useState<any>(null);
  const [selectedCounty, setSelectedCounty] = useState('Nairobi');
  const [isCountyLoading, setIsCountyLoading] = useState(false);

  // Interactive Visualization & Insights state
  const [visualizationPreview, setVisualizationPreview] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [heatMapData, setHeatMapData] = useState<any>(null);
  const [policyComparisonData, setPolicyComparisonData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [selectedVisualization, setSelectedVisualization] = useState<string | null>(null);

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

  // AI Chat function
  const handleAiChat = async (query: string, language = 'en') => {
    if (!query.trim()) return;
    
    setIsChatLoading(true);
    try {
      const response = await fetch('/api/ai-chat-multilang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: language,
          includeContext: true
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAiChatResponse(data.response);
      }
    } catch (error) {
      console.error('AI Chat error:', error);
      setAiChatResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Crisis monitoring function
  const fetchCrisisAlerts = async () => {
    try {
      const response = await fetch('/api/crisis-early-warning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          county: null, // Get national alerts
          timeframe: '24h',
          includePreventiveMeasures: false
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setCrisisAlerts(data.data.alerts.slice(0, 3)); // Show top 3 alerts
      } else {
        // Set empty alerts if API fails
        setCrisisAlerts([]);
      }
    } catch (error) {
      console.error('Crisis alerts error:', error);
      setCrisisAlerts([]);
    }
  };



  // County analysis function
  const fetchCountyAnalysis = async (county = 'Nairobi') => {
    if (!county) return;
    
    setSelectedCounty(county);
    setIsCountyLoading(true);
    setCountyAnalysisData(null); // Clear previous data
    
    try {
      const response = await fetch('/api/county-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          county: county,
          analysisType: 'comprehensive',
          includeComparisons: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('County analysis response:', data); // Debug log
      
      if (data.success && data.data) {
        setCountyAnalysisData(data.data);
      } else {
        console.error('County analysis failed:', data.error || 'No data returned');
        // Set fallback data to prevent endless loading
        setCountyAnalysisData({
          county,
          region: 'Unknown',
          demographics: { population: 'N/A', capital: 'N/A' },
          sentimentAnalysis: { overall: 'neutral' },
          keyIssues: ['infrastructure', 'healthcare', 'education'],
          currentGovernance: {
            governance: {
              leadership_effectiveness: 'medium',
              service_delivery: 'fair'
            }
          }
        });
      }
    } catch (error) {
      console.error('County analysis error:', error);
      // Set fallback data to prevent endless loading
      setCountyAnalysisData({
        county,
        region: 'Unknown',
        demographics: { population: 'N/A', capital: 'N/A' },
        sentimentAnalysis: { overall: 'neutral' },
        keyIssues: ['infrastructure', 'healthcare', 'education'],
        currentGovernance: {
          governance: {
            leadership_effectiveness: 'medium',
            service_delivery: 'fair'
          }
        }
      });
    } finally {
      setIsCountyLoading(false);
    }
  };

  // Interactive Visualization & Insights handlers
  const generateAIDashboard = async (type = 'election-monitoring') => {
    try {
      const response = await fetch('/api/ai-dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          timeframe: '7days',
          includeWidgets: true,
          autoOptimize: true
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.dashboard);
        setSelectedVisualization('ai-dashboards');
      }
    } catch (error) {
      console.error('AI Dashboard generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI dashboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateHeatMap = async (type = 'election-outcomes') => {
    try {
      const response = await fetch('/api/predictive-heatmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          timeframe: '1month',
          granularity: 'county',
          includeFactors: true
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setHeatMapData(data.heatMap);
        setSelectedVisualization('heatmaps');
      }
    } catch (error) {
      console.error('Heat map generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate heat map. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generatePolicyComparison = async (parties = ['UDA', 'ODM']) => {
    try {
      const response = await fetch('/api/policy-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parties,
          categories: ['economic', 'social', 'governance'],
          includeManifestos: true,
          includeImplementation: true,
          comparisonType: 'detailed'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setPolicyComparisonData(data.comparison);
        setSelectedVisualization('policy-comparison');
      }
    } catch (error) {
      console.error('Policy comparison error:', error);
      toast({
        title: "Error",
        description: "Failed to generate policy comparison. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateTimeline = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 3); // Last 3 months
      
      const response = await fetch('/api/political-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeframe: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          },
          categories: ['elections', 'legislation', 'governance'],
          includeConnections: true,
          includeAnalysis: true,
          granularity: 'day'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTimelineData(data.timeline);
        setSelectedVisualization('timeline');
      }
    } catch (error) {
      console.error('Timeline generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate timeline. Please try again.",
        variant: "destructive"
      });
    }
  };

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

    // Don't auto-fetch county analysis on page load
    
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
              <UserProfileButton />
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

                  {/* NEW AI Features Demo Link */}
                  <Link href="/ai-features-demo">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 hover:border-blue-300 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                    >
                      {/* Special highlight indicator */}
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          <Zap className="w-3 h-3" />
                          NEW
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-200">
                          <Brain className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">AI Features Demo</h3>
                          <p className="text-sm text-gray-600">Try new AI capabilities</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-purple-200 text-purple-700">
                              Live Demo
                            </Badge>
                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-blue-200 text-blue-700">
                              4 Features
                            </Badge>
                          </div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 transition-colors duration-200" />
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

          {/* NEW AI FEATURES SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI-Powered Intelligence
                </h2>
                <p className="text-gray-600">Advanced AI features for comprehensive political analysis</p>
              </div>
              <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                High Priority Features
              </Badge>
            </div>

            {/* Interactive Visualization & Insights Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Interactive Visualization & Insights
                  </h3>
                  <p className="text-gray-600 text-sm">Dynamic dashboards and predictive analytics for political intelligence</p>
                </div>
                <Badge className="ml-auto bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs">
                  Latest
                </Badge>
                <Link href="/interactive-visualizations">
                  <Button variant="outline" size="sm" className="ml-2">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* AI-Generated Political Dashboards */}
                <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => generateAIDashboard()}
                      onMouseEnter={() => setVisualizationPreview('ai-dashboards')}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-emerald-100">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                        Dynamic
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-emerald-900 mb-2 text-sm">AI Dashboards</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Auto-generating dashboards that adapt to current political events
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-7 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                      View Dashboard
                    </Button>
                  </CardContent>
                </Card>

                {/* Predictive Heat Maps */}
                <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/80 to-red-50/80 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => generateHeatMap()}
                      onMouseEnter={() => setVisualizationPreview('heatmaps')}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-orange-100">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                        Predictive
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-orange-900 mb-2 text-sm">Heat Maps</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Predict election outcomes and policy support across counties
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-7 border-orange-300 text-orange-700 hover:bg-orange-50">
                      View Maps
                    </Button>
                  </CardContent>
                </Card>

                {/* Policy Comparison Tool */}
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => generatePolicyComparison()}
                      onMouseEnter={() => setVisualizationPreview('policy-comparison')}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-blue-100">
                        <Scale className="w-4 h-4 text-blue-600" />
                      </div>
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                        Compare
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Policy Comparison</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Interactive analysis of party manifestos and policies
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-7 border-blue-300 text-blue-700 hover:bg-blue-50">
                      Compare Policies
                    </Button>
                  </CardContent>
                </Card>

                {/* Political Timeline Generator */}
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/80 to-pink-50/80 hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => generateTimeline()}
                      onMouseEnter={() => setVisualizationPreview('timeline')}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-purple-100">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                        Timeline
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">Event Timeline</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      Interactive political event mapping with connections
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-7 border-purple-300 text-purple-700 hover:bg-purple-50">
                      View Timeline
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Visualization Results Display */}
              {selectedVisualization && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-r from-gray-50/50 to-white/80">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {selectedVisualization === 'ai-dashboards' && <BarChart3 className="w-5 h-5 text-emerald-600" />}
                          {selectedVisualization === 'heatmaps' && <MapPin className="w-5 h-5 text-orange-600" />}
                          {selectedVisualization === 'policy-comparison' && <Scale className="w-5 h-5 text-blue-600" />}
                          {selectedVisualization === 'timeline' && <Clock className="w-5 h-5 text-purple-600" />}
                          {selectedVisualization === 'ai-dashboards' && 'AI-Generated Dashboard'}
                          {selectedVisualization === 'heatmaps' && 'Predictive Heat Map'}
                          {selectedVisualization === 'policy-comparison' && 'Policy Comparison'}
                          {selectedVisualization === 'timeline' && 'Political Timeline'}
                        </CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedVisualization(null)}
                        >
                          Close
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* AI Dashboard Results */}
                      {selectedVisualization === 'ai-dashboards' && dashboardData && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                              <h4 className="font-semibold text-emerald-900 mb-2">Dashboard Type</h4>
                              <p className="text-sm text-emerald-700 capitalize">{dashboardData.type?.replace('-', ' ')}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                              <h4 className="font-semibold text-emerald-900 mb-2">Widgets Generated</h4>
                              <p className="text-sm text-emerald-700">{dashboardData.widgets?.length || 0} widgets</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                              <h4 className="font-semibold text-emerald-900 mb-2">AI Insights</h4>
                              <p className="text-sm text-emerald-700">{dashboardData.insights?.length || 0} insights</p>
                            </div>
                          </div>
                          {dashboardData.summary && (
                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">AI-Generated Summary</h4>
                              <p className="text-sm text-gray-600">{dashboardData.summary}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Heat Map Results */}
                      {selectedVisualization === 'heatmaps' && heatMapData && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <h4 className="font-semibold text-orange-900 mb-2">Prediction Type</h4>
                              <p className="text-sm text-orange-700 capitalize">{heatMapData.type?.replace('-', ' ')}</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <h4 className="font-semibold text-orange-900 mb-2">Counties Analyzed</h4>
                              <p className="text-sm text-orange-700">{heatMapData.regions?.length || 0} counties</p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <h4 className="font-semibold text-orange-900 mb-2">Confidence</h4>
                              <p className="text-sm text-orange-700">{Math.round((heatMapData.confidence?.overall || 0.5) * 100)}%</p>
                            </div>
                          </div>
                          {heatMapData.insights && (
                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {heatMapData.insights.map((insight: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Policy Comparison Results */}
                      {selectedVisualization === 'policy-comparison' && policyComparisonData && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-2">Parties Compared</h4>
                              <p className="text-sm text-blue-700">{policyComparisonData.parties?.length || 0} parties</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-2">Policy Categories</h4>
                              <p className="text-sm text-blue-700">{Object.keys(policyComparisonData.policies || {}).length} categories</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-semibold text-blue-900 mb-2">Alignment Score</h4>
                              <p className="text-sm text-blue-700">{Math.round((policyComparisonData.alignment?.overallAlignment || 0.5) * 100)}%</p>
                            </div>
                          </div>
                          {policyComparisonData.insights && (
                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Analysis Insights</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {policyComparisonData.insights.map((insight: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Timeline Results */}
                      {selectedVisualization === 'timeline' && timelineData && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-900 mb-2">Events Mapped</h4>
                              <p className="text-sm text-purple-700">{timelineData.events?.length || 0} events</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-900 mb-2">Time Period</h4>
                              <p className="text-sm text-purple-700">{timelineData.summary?.timeSpan || 'Last 3 months'}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <h4 className="font-semibold text-purple-900 mb-2">Connections Found</h4>
                              <p className="text-sm text-purple-700">{timelineData.connections?.length || 0} connections</p>
                            </div>
                          </div>
                          {timelineData.analysis?.insights && (
                            <div className="p-4 bg-white rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-2">Timeline Analysis</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {timelineData.analysis.insights.map((insight: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-purple-500 mt-1">•</span>
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Loading State */}
                      {!dashboardData && !heatMapData && !policyComparisonData && !timelineData && (
                        <div className="flex items-center justify-center p-8">
                          <div className="flex items-center gap-3 text-gray-600">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                            <span>Generating visualization...</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Multi-Language Political Q&A Bot */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-900">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    Multi-Language Political Q&A Bot
                    <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-700">
                      NEW
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Ask political questions in English, Kiswahili, Kikuyu, or Luo and get AI-powered responses with Kenyan context.
                  </p>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-3 py-2 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="sw">Kiswahili</option>
                      <option value="ki">Kikuyu</option>
                      <option value="luo">Luo</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Input
                      placeholder="Ask me about Kenyan politics..."
                      value={chatQuery}
                      onChange={(e) => setChatQuery(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !isChatLoading) {
                          handleAiChat(chatQuery, selectedLanguage);
                        }
                      }}
                      disabled={isChatLoading}
                    />
                    <Button 
                      onClick={() => handleAiChat(chatQuery, selectedLanguage)}
                      disabled={isChatLoading || !chatQuery.trim()}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isChatLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Brain className="w-4 h-4" />
                          </motion.div>
                          AI Thinking...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Ask AI
                        </>
                      )}
                    </Button>
                  </div>

                  {aiChatResponse && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white rounded-lg border border-purple-200 mt-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">AI Response:</span>
                      </div>
                      <p className="text-sm text-gray-700">{aiChatResponse}</p>
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAiChat("What are the key political issues in Kenya today?", selectedLanguage)}
                      disabled={isChatLoading}
                    >
                      Sample: Key Issues
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAiChat("Explain devolution in Kenya", selectedLanguage)}
                      disabled={isChatLoading}
                    >
                      Sample: Devolution
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Crisis Early Warning System */}
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Political Crisis Early Warning
                    <Badge variant="secondary" className="ml-2 text-xs bg-red-100 text-red-700">
                      LIVE
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Real-time monitoring of political stability indicators across all 47 counties.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border border-red-100">
                      <div className="text-2xl font-bold text-red-600">
                        {crisisAlerts.length}
                      </div>
                      <div className="text-xs text-gray-600">Active Alerts</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                      <div className="text-2xl font-bold text-green-600">
                        {47 - crisisAlerts.length}
                      </div>
                      <div className="text-xs text-gray-600">Stable Counties</div>
                    </div>
                  </div>

                  {crisisAlerts.length > 0 ? (
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {crisisAlerts.map((alert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border-l-4 ${
                            alert.level === 'HIGH' || alert.level === 'CRITICAL' ? 'border-red-500 bg-red-50' :
                            alert.level === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
                            'border-blue-500 bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm text-gray-900">
                                {alert.location || `Alert ${index + 1}`}
                              </div>
                              <div className="text-xs text-gray-600">
                                {alert.indicators?.length > 0 
                                  ? `Indicators: ${alert.indicators.slice(0, 2).join(', ')}` 
                                  : 'Routine monitoring in progress'}
                              </div>
                              {alert.score && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Risk Score: {(alert.score * 100).toFixed(0)}%
                                </div>
                              )}
                            </div>
                            <Badge 
                              variant="outline"
                              className={`text-xs ${
                                alert.level === 'HIGH' || alert.level === 'CRITICAL' ? 'border-red-200 text-red-700' :
                                alert.level === 'MEDIUM' ? 'border-yellow-200 text-yellow-700' :
                                'border-blue-200 text-blue-700'
                              }`}
                            >
                              {alert.level || 'LOW'}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-medium text-green-900">All Clear</div>
                      <div className="text-xs text-green-700">No crisis alerts detected</div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    onClick={fetchCrisisAlerts}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Refresh Alerts
                  </Button>
                </CardContent>
              </Card>



              {/* County-Specific Analysis */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-indigo-900">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">County Analysis</div>
                      <div className="text-sm text-indigo-600 font-normal">AI-Powered Insights</div>
                    </div>
                    <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                      47 Counties
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  {isCountyLoading ? (
                    <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-xl border border-indigo-200">
                      <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-lg font-semibold text-indigo-900 mb-2">Processing Analysis</div>
                      <div className="text-sm text-indigo-600">Gathering insights for {selectedCounty} County</div>
                    </div>
                  ) : countyAnalysisData ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-indigo-900">{countyAnalysisData.county} County</h3>
                        <Badge variant="outline" className="border-indigo-300 text-indigo-700 bg-indigo-50">
                          {countyAnalysisData.region} Region
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">
                            {countyAnalysisData.demographics?.population?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">Population</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="text-lg font-bold text-green-600 capitalize">
                            {countyAnalysisData.sentimentAnalysis?.overall || 'Neutral'}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">Public Sentiment</div>
                        </div>
                      </div>

                      {countyAnalysisData.keyIssues && (
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Priority Areas:</div>
                          <div className="flex flex-wrap gap-2">
                            {countyAnalysisData.keyIssues.slice(0, 3).map((issue: string, index: number) => (
                              <Badge key={index} className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200 capitalize">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {countyAnalysisData.currentGovernance?.governance && (
                        <div className="pt-4 border-t border-indigo-100">
                          <div className="text-sm font-semibold text-gray-700 mb-3">Governance Assessment:</div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                              <div className="text-xs text-gray-600">Leadership</div>
                              <div className="font-semibold text-purple-700 capitalize">{countyAnalysisData.currentGovernance.governance.leadership_effectiveness}</div>
                            </div>
                            <div className="p-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                              <div className="text-xs text-gray-600">Service Delivery</div>
                              <div className="font-semibold text-cyan-700 capitalize">{countyAnalysisData.currentGovernance.governance.service_delivery}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-xl border-2 border-dashed border-indigo-300">
                      <MapPin className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                      <div className="text-lg font-semibold text-indigo-900 mb-2">Ready to Analyze</div>
                      <div className="text-sm text-indigo-600">Select a county and click analyze for comprehensive AI insights</div>
                    </div>
                  )}

                  <div className="text-center">
                    <select
                      value={selectedCounty}
                      onChange={(e) => setSelectedCounty(e.target.value)}
                      className="w-full p-3 border-2 border-indigo-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white/80 backdrop-blur-sm"
                    >
                      {['Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'].map(county => (
                        <option key={county} value={county}>{county} County</option>
                      ))}
                    </select>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => fetchCountyAnalysis(selectedCounty)}
                    disabled={isCountyLoading || !selectedCounty}
                  >
                    {isCountyLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Analyzing {selectedCounty}...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Analyze {selectedCounty} County
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Feature Usage Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="mt-8"
            >
              <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50/30 to-blue-50/30">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Zap className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">How to Use These AI Features</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MessageSquare className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">AI Chat</h4>
                        <p className="text-sm text-gray-600">Ask political questions in your preferred language and get contextual responses</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Crisis Alerts</h4>
                        <p className="text-sm text-gray-600">Monitor real-time political stability and receive early warnings</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>

                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">County Analysis</h4>
                        <p className="text-sm text-gray-600">Detailed political and economic insights for all 47 counties</p>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>💡 Pro Tip:</strong> Configure your AI preferences in <Link href="/settings" className="text-purple-600 hover:underline">Settings</Link> to customize language, alerts, and analysis depth for the best experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}