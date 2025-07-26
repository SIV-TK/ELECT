"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Scale, BookOpen, Loader2, MessageCircle } from 'lucide-react';

export default function ConstitutionPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const askAI = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/constitution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      setExplanation(data.data);
    } catch (error) {
      console.error('Failed to get explanation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "What are my rights as a Kenyan citizen?",
    "How does the electoral system work?",
    "What is devolution in Kenya?",
    "What are the three arms of government?",
    "How can I participate in governance?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full mb-4">
            <Scale className="h-5 w-5" />
            <span className="text-sm font-medium">AI Constitution Guide</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Kenya Constitution 2010</h1>
          <p className="text-gray-600 text-lg">
            Ask AI to explain any part of the Kenyan Constitution in simple terms
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Ask About the Constitution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., What are my fundamental rights?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askAI()}
                className="flex-1"
              />
              <Button onClick={askAI} disabled={isLoading || !query.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ask AI'}
              </Button>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(q)}
                    className="text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {explanation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                AI Explanation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-gray-800">{explanation.explanation}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Relevant Articles</h4>
                <div className="flex flex-wrap gap-2">
                  {explanation.relevantArticles.map((article, index) => (
                    <Badge key={index} variant="outline">{article}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Practical Example</h4>
                <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                  {explanation.practicalExample}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Your Rights</h4>
                <ul className="space-y-1">
                  {explanation.citizenRights.map((right, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600">•</span>
                      {right}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {!explanation && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Scale className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Learn</h3>
              <p className="text-gray-600">
                Ask any question about the Kenyan Constitution and get simple, clear explanations
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}