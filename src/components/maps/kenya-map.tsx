// src/components/maps/kenya-map.tsx
"use client";

import React, { useState } from 'react';
import type { VoteDistribution } from '@/ai/flows/predict-vote-distribution';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { countyPaths } from './county-paths';
import { cn } from '@/lib/utils';

interface KenyaMapProps {
  data: VoteDistribution[];
  sentimentMode?: boolean;
}

// Function to determine color based on vote share
const getColor = (voteShare: number, sentimentMode: boolean = false) => {
  if (sentimentMode) {
    // For sentiment mode, use a different color scale
    if (voteShare > 75) return 'fill-green-500'; // very positive
    if (voteShare > 60) return 'fill-green-400'; // positive
    if (voteShare > 50) return 'fill-green-300'; // slightly positive
    if (voteShare >= 50) return 'fill-yellow-200'; // neutral
    if (voteShare > 40) return 'fill-yellow-300'; // slightly negative
    if (voteShare > 25) return 'fill-red-300'; // negative
    return 'fill-red-500'; // very negative
  } else {
    // For vote share mode
    if (voteShare > 75) return 'fill-primary'; 
    if (voteShare > 60) return 'fill-primary/80';
    if (voteShare > 50) return 'fill-primary/60';
    if (voteShare > 40) return 'fill-primary/40';
    return 'fill-primary/20';
  }
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
              const colorClass = getColor(voteShare, sentimentMode);

              return (
                <Tooltip key={county.id}>
                  <TooltipTrigger asChild>
                    <path
                      id={county.id}
                      d={county.d}
                      className={cn(
                        "stroke-background stroke-2 transition-all duration-200",
                        colorClass,
                        { 'opacity-75': hoveredCounty && hoveredCounty.name !== county.name },
                        { 'hover:opacity-100': true }
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
        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm p-3 rounded-md border shadow-md text-xs">
          <p className="font-bold mb-2">Legend</p>
          {sentimentMode ? (
            <>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-green-500"></div>Very Positive</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-green-400"></div>Positive</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-green-300"></div>Slightly Positive</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-yellow-200"></div>Neutral</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-yellow-300"></div>Slightly Negative</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-red-300"></div>Negative</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500"></div>Very Negative</div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-primary/20"></div>{'< 40%'}</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-primary/40"></div>40-50%</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-primary/60"></div>50-60%</div>
              <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-sm bg-primary/80"></div>60-75%</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary"></div>{'> 75%'}</div>
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}


