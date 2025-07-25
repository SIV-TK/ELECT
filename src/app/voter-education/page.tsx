"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Vote, Scale, Loader2, GraduationCap } from 'lucide-react';

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
  'Voting Process', 'Electoral System', 'Candidate Selection', 'Political Parties',
  'Constitution', 'Government Structure', 'Citizen Rights', 'Election Laws'
];

export default function VoterEducationHub() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<EducationContent | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Voter Education Hub</h1>
        <p className="text-muted-foreground">AI-powered civic education for informed participation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Learning Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedTopic(topic);
                    getEducation(topic);
                  }}
                >
                  {topic}
                </Button>
              ))}
              
              <div className="pt-4 border-t">
                <Input
                  placeholder="Ask a custom question..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="mb-2"
                />
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => getEducation(customQuery)}
                  disabled={!customQuery.trim()}
                >
                  Ask AI Tutor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {isLoading && (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Generating educational content...</p>
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
                  <div className="prose max-w-none">
                    <p>{content.content}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Key Points</h4>
                    <ul className="space-y-1">
                      {content.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Additional Resources</h4>
                    <div className="space-y-1">
                      {content.resources.map((resource, index) => (
                        <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                          • {resource}
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
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Learning</h3>
                <p className="text-muted-foreground">
                  Select a topic or ask a question to begin your civic education journey
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}