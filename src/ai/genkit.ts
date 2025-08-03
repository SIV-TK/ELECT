import {genkit} from 'genkit';
import {deepseek} from 'genkitx-deepseek';

export const ai = genkit({
  plugins: [
    deepseek({
      apiKey: process.env.DEEPSEEK_API_KEY || 'sk-3cd6995fe396452b801d4fc7721a0e6c',
    })
  ]
});
