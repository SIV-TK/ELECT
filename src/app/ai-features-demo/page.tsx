"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  MessageSquare, 
  AlertTriangle, 
  Shield, 
  MapPin,
  Languages,
  Zap,
  Eye,
  CheckCircle,
  ArrowLeft,
  Play,
  RefreshCw,
  Globe,
  Users,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';

export default function AIFeaturesDemo() {
  const [activeDemo, setActiveDemo] = useState('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});

  // Demo functions for each AI feature
  const runChatDemo = async (query: string, language: string) => {
    setIsLoading(true);
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
      setResponses(prev => ({ ...prev, chat: data }));
    } catch (error) {
      console.error('Chat demo error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runCrisisDemo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/crisis-early-warning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monitoring: 'realtime',
          counties: ['Nairobi', 'Mombasa', 'Kisumu'],
          alertLevel: 'all'
        })
      });
      
      const data = await response.json();
      setResponses(prev => ({ ...prev, crisis: data }));
    } catch (error) {
      console.error('Crisis demo error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runMisinfoDemo = async (content: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/misinformation-detector', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content,
          generateCounterNarrative: true,
          includeSourceAnalysis: true
        })
      });
      
      const data = await response.json();
      setResponses(prev => ({ ...prev, misinfo: data }));
    } catch (error) {
      console.error('Misinformation demo error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runCountyDemo = async (county: string) => {
    setIsLoading(true);
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
      
      const data = await response.json();
      setResponses(prev => ({ ...prev, county: data }));
    } catch (error) {
      console.error('County demo error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      id: 'chat',
      title: 'Multi-Language Political Q&A Bot',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'AI-powered political conversations in 4 Kenyan languages',
      gradient: 'from-purple-500 to-blue-600',
      demo: () => runChatDemo("What are the main functions of the Senate in Kenya?", "en")
    },
    {
      id: 'crisis',
      title: 'Political Crisis Early Warning',
      icon: <AlertTriangle className="w-6 h-6" />,
      description: 'Real-time monitoring of political stability indicators',
      gradient: 'from-red-500 to-orange-600',
      demo: runCrisisDemo
    },
    {
      id: 'misinfo',
      title: 'Enhanced Misinformation Detection',
      icon: <Shield className="w-6 h-6" />,
      description: 'Advanced pattern analysis with counter-narratives',
      gradient: 'from-green-500 to-teal-600',
      demo: () => runMisinfoDemo("BREAKING: Government planning to raise taxes by 50% next month without parliamentary approval")
    },
    {
      id: 'county',
      title: 'County-Specific Analysis',
      icon: <MapPin className="w-6 h-6" />,
      description: 'Comprehensive insights for all 47 Kenyan counties',
      gradient: 'from-blue-500 to-purple-600',
      demo: () => runCountyDemo("Nairobi")
    }
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent">
                AI Features Demo
              </h1>
              <p className="text-gray-600 mt-1">
                Interactive demonstration of ELECT's advanced AI capabilities
              </p>
            </div>
            <Link href="/interactive-visualizations">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg">
                <Eye className="w-4 h-4 mr-2" />
                Try Visualizations
              </Button>
            </Link>
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Live Demo
            </Badge>
          </motion.div>

          {/* Feature Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <motion.button
                  key={feature.id}
                  onClick={() => setActiveDemo(feature.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    activeDemo === feature.id
                      ? 'border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50'
                      : 'border-gray-200 bg-white hover:border-purple-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.gradient} text-white w-fit mb-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Demo Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Demo Interface */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${features.find(f => f.id === activeDemo)?.gradient} text-white`}>
                    {features.find(f => f.id === activeDemo)?.icon}
                  </div>
                  {features.find(f => f.id === activeDemo)?.title}
                  <Badge variant="secondary" className="ml-2">Demo</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Multi-Language Chat Demo */}
                {activeDemo === 'chat' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Language
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="en">English</option>
                        <option value="sw">Kiswahili</option>
                        <option value="ki">Kikuyu</option>
                        <option value="luo">Luo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ask a Political Question
                      </label>
                      <Textarea 
                        placeholder="E.g., What are the main functions of the Senate in Kenya?"
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() => runChatDemo("What are the main functions of the Senate in Kenya?", "en")}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Sample: Senate Functions
                      </Button>
                      <Button
                        onClick={() => runChatDemo("Explain devolution in Kenya in simple terms", "en")}
                        disabled={isLoading}
                        variant="outline"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Sample: Devolution
                      </Button>
                    </div>
                  </div>
                )}

                {/* Crisis Warning Demo */}
                {activeDemo === 'crisis' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-900">Real-Time Crisis Monitoring</span>
                      </div>
                      <p className="text-sm text-red-700">
                        This system monitors social media, news sources, and government data for early warning signs of political instability.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">42</div>
                        <div className="text-xs text-green-700">Stable Counties</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-600">4</div>
                        <div className="text-xs text-yellow-700">Watch List</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-2xl font-bold text-red-600">1</div>
                        <div className="text-xs text-red-700">Alert Level</div>
                      </div>
                    </div>

                    <Button
                      onClick={runCrisisDemo}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 mr-2" />
                      )}
                      Run Crisis Scan
                    </Button>
                  </div>
                )}

                {/* Misinformation Detection Demo */}
                {activeDemo === 'misinfo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Content to Analyze
                      </label>
                      <Textarea 
                        placeholder="Paste news article, social media post, or any political content..."
                        className="min-h-[120px]"
                        defaultValue="BREAKING: Government planning to raise taxes by 50% next month without parliamentary approval"
                      />
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">AI Detection Patterns</span>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>• Emotional manipulation language</div>
                        <div>• Lack of credible sources</div>
                        <div>• Sensational claims without evidence</div>
                        <div>• Inflammatory or divisive content</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => runMisinfoDemo("BREAKING: Government planning to raise taxes by 50% next month without parliamentary approval")}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Analyze Content
                    </Button>
                  </div>
                )}

                {/* County Analysis Demo */}
                {activeDemo === 'county' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select County for Analysis
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="Nairobi">Nairobi</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Kisumu">Kisumu</option>
                        <option value="Nakuru">Nakuru</option>
                        <option value="Kiambu">Kiambu</option>
                        <option value="Machakos">Machakos</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Demographics</span>
                        </div>
                        <div className="text-xs text-blue-700">Population, economy, development</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">Political Trends</span>
                        </div>
                        <div className="text-xs text-purple-700">Sentiment, key issues, governance</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => runCountyDemo("Nairobi")}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Analyze County
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Display */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gray-600" />
                  AI Response
                  {isLoading && (
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-sm text-purple-600">Processing...</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ) : responses[activeDemo] ? (
                  <div className="space-y-4">
                    {activeDemo === 'chat' && responses.chat && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-purple-900">AI Response:</span>
                        </div>
                        <p className="text-gray-700">{responses.chat.response || responses.chat.message || 'Response received successfully!'}</p>
                        {responses.chat.language && (
                          <Badge variant="outline" className="mt-2">
                            Language: {responses.chat.language}
                          </Badge>
                        )}
                      </div>
                    )}

                    {activeDemo === 'crisis' && responses.crisis && (
                      <div className="space-y-3">
                        {responses.crisis.alerts && responses.crisis.alerts.length > 0 ? (
                          responses.crisis.alerts.slice(0, 3).map((alert: any, index: number) => (
                            <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="font-medium text-red-900">
                                {alert.county || `Alert ${index + 1}`}
                              </div>
                              <div className="text-sm text-red-700">
                                {alert.description || 'Political tension indicators detected'}
                              </div>
                              <Badge variant="outline" className="mt-1 border-red-200 text-red-700">
                                {alert.level || 'Medium'} Risk
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-900">All Clear</span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">No crisis alerts detected across monitored counties</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeDemo === 'misinfo' && responses.misinfo && (
                      <div className="space-y-3">
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-orange-900">Analysis Results</span>
                            <Badge variant="outline" className="border-orange-200 text-orange-700">
                              {responses.misinfo.confidence ? `${(responses.misinfo.confidence * 100).toFixed(0)}%` : '85%'} Confidence
                            </Badge>
                          </div>
                          <div className="text-sm text-orange-700">
                            <div><strong>Patterns Detected:</strong> {responses.misinfo.patterns?.join(', ') || 'Emotional manipulation, unverified claims'}</div>
                            <div className="mt-2"><strong>Risk Level:</strong> {responses.misinfo.riskLevel || 'Medium'}</div>
                          </div>
                        </div>
                        
                        {responses.misinfo.counterNarrative && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="font-medium text-blue-900 mb-2">Counter-Narrative:</div>
                            <p className="text-sm text-blue-700">{responses.misinfo.counterNarrative}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeDemo === 'county' && responses.county && (
                      <div className="space-y-3">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="font-medium text-blue-900 mb-2">
                            {responses.county.data?.county || 'County'} Analysis
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Population:</span>
                              <div className="font-medium">{responses.county.data?.demographics?.population?.toLocaleString() || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Region:</span>
                              <div className="font-medium">{responses.county.data?.region || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                        
                        {responses.county.data?.keyIssues && (
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="font-medium text-purple-900 mb-2">Key Issues:</div>
                            <div className="flex flex-wrap gap-2">
                              {responses.county.data.keyIssues.slice(0, 4).map((issue: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {issue}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click the demo button to see AI analysis in action</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-r from-purple-50/30 to-blue-50/30">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">How Users Interact with These Features</h2>
                  <p className="text-gray-600">Real-world usage scenarios for ELECT's AI capabilities</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Citizens ask questions</h3>
                        <p className="text-sm text-gray-600 mt-1">"What powers does my county governor have?" in their preferred language</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Journalists get early alerts</h3>
                        <p className="text-sm text-gray-600 mt-1">Real-time notifications about potential political unrest for investigative reporting</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Media houses verify content</h3>
                        <p className="text-sm text-gray-600 mt-1">Check articles for misinformation before publishing, get counter-narratives</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Researchers analyze trends</h3>
                        <p className="text-sm text-gray-600 mt-1">Get comprehensive county data for academic studies and policy recommendations</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Civic organizations educate</h3>
                        <p className="text-sm text-gray-600 mt-1">Use AI-generated explanations to teach communities about democracy and rights</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Globe className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">International observers monitor</h3>
                        <p className="text-sm text-gray-600 mt-1">Track political stability and democratic health across Kenya's regions</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Configure your AI preferences and start using these features in your workflow
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        <Link href="/settings">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure AI Settings
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/dashboard">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Dashboard
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
