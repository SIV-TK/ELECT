"use client";

import React from 'react';
import type { VoteDistribution } from '@/ai/flows/predict-vote-distribution';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartKenyaMapProps {
  data: VoteDistribution[];
  sentimentMode?: boolean;
}

const getColor = (voteShare: number, sentimentMode: boolean = false) => {
  if (sentimentMode) {
    if (voteShare > 75) return '#22c55e';
    if (voteShare > 60) return '#4ade80';
    if (voteShare > 50) return '#86efac';
    if (voteShare >= 50) return '#fef08a';
    if (voteShare > 40) return '#fde047';
    if (voteShare > 25) return '#fca5a5';
    return '#ef4444';
  } else {
    if (voteShare > 75) return '#3b82f6';
    if (voteShare > 60) return '#60a5fa';
    if (voteShare > 50) return '#93c5fd';
    if (voteShare > 40) return '#bfdbfe';
    return '#dbeafe';
  }
};

export function ChartKenyaMap({ data, sentimentMode = false }: ChartKenyaMapProps) {
  // Sort data by vote share for better visualization
  const sortedData = [...data].sort((a, b) => b.predictedVoteShare - a.predictedVoteShare);
  
  // Take top 20 counties for better readability
  const topCounties = sortedData.slice(0, 20);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-primary">
            Vote Share: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96 bg-card rounded-lg border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Top 20 Counties by Predicted Vote Share</h3>
        <p className="text-sm text-muted-foreground">
          Interactive chart showing county-level predictions
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={topCounties}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis 
            label={{ value: 'Vote Share (%)', angle: -90, position: 'insideLeft' }}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="predictedVoteShare" radius={[4, 4, 0, 0]}>
            {topCounties.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColor(entry.predictedVoteShare, sentimentMode)} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: sentimentMode ? '#22c55e' : '#3b82f6'}}></div>
          High ({sentimentMode ? 'Very Positive' : '> 75%'})
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: sentimentMode ? '#4ade80' : '#60a5fa'}}></div>
          Good ({sentimentMode ? 'Positive' : '60-75%'})
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: sentimentMode ? '#fef08a' : '#93c5fd'}}></div>
          Medium ({sentimentMode ? 'Neutral' : '50-60%'})
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: sentimentMode ? '#fca5a5' : '#bfdbfe'}}></div>
          Low ({sentimentMode ? 'Negative' : '40-50%'})
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{backgroundColor: sentimentMode ? '#ef4444' : '#dbeafe'}}></div>
          Very Low ({sentimentMode ? 'Very Negative' : '< 40%'})
        </div>
      </div>
    </div>
  );
}