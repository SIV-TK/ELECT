"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Vote, Scale, Loader2, GraduationCap, Play, Award, Clock, Target } from 'lucide-react';

interface EducationContent {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  keyPoints: string[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
  }[];
  resources: string[];
}

const topics = [
  { name: 'Voting Process', icon: Vote, duration: '15 min', level: 'beginner' },
  { name: 'Electoral System', icon: Users, duration: '20 min', level: 'intermediate' },
  { name: 'Constitution', icon: Scale, duration: '25 min', level: 'advanced' },
  { name: 'Citizen Rights', icon: Award, duration: '18 min', level: 'beginner' },
  { name: 'Political Parties', icon: Users, duration: '22 min', level: 'intermediate' },
  { name: 'Government Structure', icon: BookOpen, duration: '30 min', level: 'advanced' }
];

export default function VoterEducationHub() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<EducationContent | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [stats, setStats] = useState({ totalModules: 6, activeQuizzes: 24, totalDuration: '2.5', successRate: 95 });

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/education-stats');
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Stats fetch failed:', error);
    }
  };

  const getEducation = async (topic: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/voter-education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      
      const data = await response.json();
      setContent(data);
      setQuizScore(null);
      setSelectedAnswers([]);
    } catch (error) {
      console.error('Education fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const submitQuiz = () => {
    if (!content) return;
    
    let correct = 0;
    content.quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) correct++;
    });
    
    setQuizScore((correct / content.quiz.length) * 100);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-xs sm:text-sm font-medium">AI-Powered Learning</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Voter Education Hub</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Master Kenyan civics with interactive lessons, quizzes, and AI guidance
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-2 sm:p-4 text-center">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{stats.totalModules}</div>
              <div className="text-xs sm:text-sm text-gray-600">Modules</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-2 sm:p-4 text-center">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{stats.activeQuizzes}</div>
              <div className="text-xs sm:text-sm text-gray-600">Quizzes</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-2 sm:p-4 text-center">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{stats.totalDuration}h</div>
              <div className="text-xs sm:text-sm text-gray-600">Duration</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur">
            <CardContent className="p-2 sm:p-4 text-center">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">{stats.successRate}%</div>
              <div className="text-xs sm:text-sm text-gray-600">Success</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur lg:sticky lg:top-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                  Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {topics.map((topic) => {
                  const IconComponent = topic.icon;
                  return (
                    <div
                      key={topic.name}
                      className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all active:scale-95 ${
                        selectedTopic === topic.name ? 'bg-blue-50 border-blue-200' : 'bg-white active:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedTopic(topic.name);
                        getEducation(topic.name);
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">{topic.name}</div>
                          <div className="flex items-center gap-1 sm:gap-2 mt-1">
                            <Badge variant="outline" className="text-xs px-1">{topic.level}</Badge>
                            <span className="text-xs text-gray-500">{topic.duration}</span>
                          </div>
                        </div>
                        <Play className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
                
                <div className="pt-3 sm:pt-4 border-t">
                  <Input
                    placeholder="Ask AI tutor..."
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    className="mb-2 text-sm"
                  />
                  <Button
                    variant="secondary"
                    className="w-full text-sm h-9"
                    onClick={() => getEducation(customQuery)}
                    disabled={!customQuery.trim()}
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Ask AI Tutor
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {isLoading && (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">Generating content...</p>
                </CardContent>
              </Card>
            )}

            {content && !isLoading && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {content.topic}
                      <Badge className={getLevelColor(content.level)}>
                        {content.level}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />

                    <div>
                      <h4 className="font-semibold mb-2">Key Points</h4>
                      <ul className="space-y-1">
                        {content.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-primary">•</span>
                            <span dangerouslySetInnerHTML={{ __html: point }} />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Additional Resources</h4>
                      <div className="space-y-1">
                        {content.resources.map((resource, index) => (
                          <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                            • <span dangerouslySetInnerHTML={{ __html: resource }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Knowledge Quiz
                    </CardTitle>
                    <CardDescription>Test your understanding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {content.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="space-y-2">
                        <h5 className="font-medium">{qIndex + 1}. {question.question}</h5>
                        <div className="space-y-1">
                          {question.options.map((option, oIndex) => (
                            <Button
                              key={oIndex}
                              variant={selectedAnswers[qIndex] === oIndex ? 'default' : 'outline'}
                              className="w-full justify-start text-left h-auto p-3"
                              onClick={() => {
                                const newAnswers = [...selectedAnswers];
                                newAnswers[qIndex] = oIndex;
                                setSelectedAnswers(newAnswers);
                              }}
                            >
                              {String.fromCharCode(65 + oIndex)}. {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={submitQuiz}
                      disabled={selectedAnswers.length !== content.quiz.length}
                      className="w-full"
                    >
                      Submit Quiz
                    </Button>

                    {quizScore !== null && (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Quiz Score</span>
                          <span className="text-lg font-bold">{quizScore.toFixed(0)}%</span>
                        </div>
                        <Progress value={quizScore} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">
                          {quizScore >= 80 ? 'Excellent! You have a strong understanding.' :
                           quizScore >= 60 ? 'Good job! Review the material for better understanding.' :
                           'Keep learning! Consider reviewing the content again.'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {!content && !isLoading && (
              <Card className="bg-white/90 backdrop-blur">
                <CardContent className="p-12 text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Learn?</h3>
                  <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                    Choose a learning module or ask our AI tutor to start your civic education journey
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {topics.slice(0, 3).map((topic) => (
                      <Button
                        key={topic.name}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTopic(topic.name);
                          getEducation(topic.name);
                        }}
                      >
                        {topic.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}