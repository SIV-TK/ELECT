import { config } from 'dotenv';
config();

import '@/ai/flows/predict-election-outcome.ts';
import '@/ai/flows/get-campaign-advice.ts';
import '@/ai/flows/analyze-candidate-sentiment.ts';
import '@/ai/flows/predict-vote-distribution.ts';
import '@/ai/flows/summarize-politician.ts';
import '@/ai/flows/analyze-intel-veracity.ts';
