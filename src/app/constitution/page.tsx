"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Scale, 
  BookOpen, 
  Loader2, 
  MessageCircle, 
  Search,
  Users,
  Vote,
  Shield,
  Gavel,
  Globe,
  History,
  Download,
  ExternalLink,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Calendar,
  MapPin,
  FileText,
  Lightbulb,
  Star
} from 'lucide-react';

interface ConstitutionExplanation {
  explanation: string;
  relevantArticles: string[];
  practicalExample: string;
  citizenRights: string[];
}

interface Amendment {
  title: string;
  summary: string;
  source: string;
  date?: string;
  status?: string;
}

export default function ConstitutionPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<ConstitutionExplanation | null>(null);
  const [recentAmendments, setRecentAmendments] = useState<Amendment[]>([]);
  const [activeTab, setActiveTab] = useState('ask');

  const askAI = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/constitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, includeAmendments: true })
      });
      
      const data = await response.json();
      setExplanation(data.data);
    } catch (error) {
      console.error('Failed to get explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentAmendments = async () => {
    try {
      const response = await fetch('/api/constitution');
      const data = await response.json();
      setRecentAmendments(data.data || []);
    } catch (error) {
      console.error('Failed to fetch amendments:', error);
    }
  };

  useEffect(() => {
    fetchRecentAmendments();
  }, []);

  const quickQuestions = [
    { question: "What are my fundamental rights?", category: "Rights", icon: <Shield className="w-4 h-4" /> },
    { question: "How does the electoral system work?", category: "Elections", icon: <Vote className="w-4 h-4" /> },
    { question: "What is devolution in Kenya?", category: "Government", icon: <MapPin className="w-4 h-4" /> },
    { question: "How are laws made in Kenya?", category: "Legal", icon: <Gavel className="w-4 h-4" /> },
    { question: "What is the role of the Judiciary?", category: "Courts", icon: <Scale className="w-4 h-4" /> },
    { question: "How can I participate in governance?", category: "Participation", icon: <Users className="w-4 h-4" /> }
  ];

  const constitutionSections = [
    {
      title: "Bill of Rights",
      description: "Fundamental rights and freedoms of every person",
      icon: <Shield className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      articles: "Articles 19-59"
    },
    {
      title: "Electoral System",
      description: "How elections are conducted in Kenya",
      icon: <Vote className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      articles: "Articles 81-104"
    },
    {
      title: "Devolved Government",
      description: "County governments and their functions",
      icon: <MapPin className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      articles: "Articles 174-200"
    },
    {
      title: "Judiciary",
      description: "Court system and judicial independence",
      icon: <Scale className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      articles: "Articles 159-173"
    },
    {
      title: "Parliament",
      description: "National Assembly and Senate powers",
      icon: <Gavel className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      articles: "Articles 93-132"
    },
    {
      title: "Executive",
      description: "President and Cabinet responsibilities",
      icon: <Users className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-600",
      articles: "Articles 129-158"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Modern Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
            <Scale className="h-6 w-6" />
            <span className="font-semibold">AI-Powered Constitution Guide</span>
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Kenya Constitution 2010
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand your rights, learn about governance, and explore Kenya's supreme law with AI-powered explanations
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="text-sm px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              47 Counties Covered
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <FileText className="w-4 h-4 mr-2" />
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Updated 2010
            </Badge>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="ask" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Ask AI
            </TabsTrigger>
            <TabsTrigger value="explore" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Explore
            </TabsTrigger>
            <TabsTrigger value="amendments" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Updates
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ask" className="space-y-6">
            {/* AI Question Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                    Ask About the Constitution
                    <Badge variant="secondary" className="ml-auto">AI Powered</Badge>
                  </CardTitle>
                  <p className="text-gray-600">Get instant, clear explanations about any aspect of Kenya's Constitution</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="e.g., What are my fundamental rights as a Kenyan citizen?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && askAI()}
                        className="pl-10 py-6 text-lg border-2 border-gray-200 focus:border-blue-400"
                      />
                    </div>
                    <Button 
                      onClick={askAI} 
                      disabled={isLoading || !query.trim()}
                      size="lg"
                      className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Ask AI
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Popular Questions:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {quickQuestions.map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="outline"
                            onClick={() => setQuery(item.question)}
                            className="w-full justify-start h-auto p-4 text-left hover:bg-blue-50 hover:border-blue-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                {item.icon}
                              </div>
                              <div>
                                <div className="font-medium">{item.question}</div>
                                <div className="text-sm text-gray-500">{item.category}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 ml-auto" />
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Response */}
            <AnimatePresence>
              {explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Lightbulb className="h-6 w-6 text-yellow-600" />
                        AI Explanation
                        <Badge variant="outline" className="ml-auto">
                          <Star className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="prose max-w-none">
                        <div className="text-gray-800 text-lg leading-relaxed bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                          {explanation.explanation}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Relevant Articles
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {explanation.relevantArticles?.map((article, index) => (
                              <Badge key={index} variant="outline" className="px-3 py-1">
                                {article}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-green-600" />
                            Your Rights
                          </h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {explanation.citizenRights?.slice(0, 3).map((right, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{right}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-600" />
                          Practical Example
                        </h4>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                          <p className="text-gray-800">
                            {explanation.practicalExample}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!explanation && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Scale className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Ready to Learn</h3>
                    <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                      Ask any question about the Kenyan Constitution and get simple, clear explanations powered by AI
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Instant answers
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Simple language
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Real examples
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="explore" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {constitutionSections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    setQuery(`Explain ${section.title} in the Kenyan Constitution`);
                    setActiveTab('ask');
                  }}
                >
                  <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {section.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{section.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {section.articles}
                      </Badge>
                      <div className="flex items-center gap-2 mt-4 text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">Learn more</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="amendments" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-6 w-6 text-purple-600" />
                  Recent Constitutional Updates & Amendments
                </CardTitle>
                <p className="text-gray-600">Stay informed about proposed changes and updates to Kenya's Constitution</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAmendments.length > 0 ? (
                    recentAmendments.map((amendment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{amendment.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{amendment.summary}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {amendment.source}
                              </Badge>
                              {amendment.status && (
                                <Badge variant={amendment.status === 'Passed' ? 'default' : 'secondary'} className="text-xs">
                                  {amendment.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent amendments available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-6 w-6 text-green-600" />
                    Download Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Constitution of Kenya 2010 (PDF)
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Citizen's Handbook
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Interactive Constitution Guide
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-6 w-6 text-blue-600" />
                    Official Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Parliament of Kenya
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Scale className="w-4 h-4 mr-2" />
                    Kenya Law Reform Commission
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Gavel className="w-4 h-4 mr-2" />
                    Judiciary of Kenya
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}