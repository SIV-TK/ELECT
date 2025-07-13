// src/components/maps/kenya-map.tsx
"use client";

import React, { useState } from 'react';
import type { VoteDistribution } from '@/ai/flows/predict-vote-distribution';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { countyPaths } from './county-paths'; // Assuming paths are in a separate file

interface KenyaMapProps {
  data: VoteDistribution[];
}

// Function to determine color based on vote share
const getColor = (voteShare: number) => {
  if (voteShare > 75) return 'fill-primary';
  if (voteShare > 60) return 'fill-primary/80';
  if (voteShare > 50) return 'fill-primary/60';
  if (voteShare > 40) return 'fill-primary/40';
  return 'fill-primary/20';
};

export function KenyaMap({ data }: KenyaMapProps) {
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
                        colorClass,
                        { 'opacity-75': hoveredCounty && hoveredCounty.name !== county.name }
                      )}
                      onMouseEnter={() => setHoveredCounty(countyData ?? { name: county.name, predictedVoteShare: 0 })}
                      onMouseLeave={() => setHoveredCounty(null)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{county.name}</p>
                    {countyData && <p>Predicted Vote: {countyData.predictedVoteShare.toFixed(1)}%</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </g>
        </svg>
        <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-md border text-xs">
          <p className="font-bold mb-1">Legend (Vote %)</p>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/20"></div>{'< 40%'}</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/40"></div>40-50%</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/60"></div>50-60%</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/80"></div>60-75%</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary"></div>{'> 75%'}</div>
        </div>
      </div>
    </TooltipProvider>
  );
}

function cn(...inputs: any[]) {
  // A simplified version of the actual cn utility
  return inputs.filter(Boolean).join(' ');
}
