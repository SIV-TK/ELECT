// src/components/maps/kenya-map.tsx
"use client";

import React, { useState } from 'react';
import type { VoteDistribution } from '@/ai/flows/predict-vote-distribution';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { countyPaths } from './county-paths'; // Assuming paths are in a separate file

interface KenyaMapProps {
  data: VoteDistribution[];
  sentimentMode?: boolean;
}

// Function to determine color based on vote share
const getColor = (voteShare: number) => {
  // If sentimentMode, use green/yellow/red for positive/neutral/negative
  if (voteShare > 66) return 'bg-green-400'; // positive
  if (voteShare > 33) return 'bg-yellow-300'; // neutral
  return 'bg-red-400'; // negative
};

export function KenyaMap({ data, sentimentMode = false }: KenyaMapProps) {
  const [hoveredCounty, setHoveredCounty] = useState<VoteDistribution | null>(null);

  const dataMap = new Map(data.map(item => [item.name, item]));

  return (
    <TooltipProvider>
      <div className="w-full aspect-square relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 763.82 763.55"
          className="w-full h-full"
        >
          <g>
            {countyPaths.map(county => {
              const countyData = dataMap.get(county.name);
              const voteShare = countyData?.predictedVoteShare ?? 0;
              const colorClass = getColor(voteShare);

              return (
                <Tooltip key={county.id}>
                  <TooltipTrigger asChild>
                    <path
                      id={county.id}
                      d={county.d}
                      className={cn(
                        "stroke-background stroke-2 transition-all duration-200",
                        sentimentMode
                          ? (voteShare > 66 ? 'fill-green-400' : voteShare > 33 ? 'fill-yellow-300' : 'fill-red-400')
                          : colorClass,
                        { 'opacity-75': hoveredCounty && hoveredCounty.name !== county.name }
                      )}
                      onMouseEnter={() => setHoveredCounty(countyData ?? { name: county.name, predictedVoteShare: 0 })}
                      onMouseLeave={() => setHoveredCounty(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{county.name}</p>
                    {countyData && sentimentMode ? (
                      <p>Sentiment: {voteShare > 66 ? 'Positive' : voteShare > 33 ? 'Neutral' : 'Negative'} ({((voteShare-50)/50).toFixed(2)})</p>
                    ) : (
                      countyData && <p>Predicted Vote: {countyData.predictedVoteShare.toFixed(1)}%</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </g>
        </svg>
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-md border text-xs">
          <p className="font-bold mb-1">Legend</p>
          {sentimentMode ? (
            <>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-400"></div>Positive</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-yellow-300"></div>Neutral</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-400"></div>Negative</div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/20"></div>{'< 40%'}</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/40"></div>40-50%</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/60"></div>50-60%</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/80"></div>60-75%</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary"></div>{'> 75%'}</div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

function cn(...inputs: any[]) {
  // A simplified version of the actual cn utility
  return inputs.filter(Boolean).join(' ');
}
