import type { AnalyzeIntelVeracityOutput } from "@/ai/flows/analyze-intel-veracity";
import type { TallyAnomalyOutput } from "@/ai/flows/analyze-tally-anomaly";

export type { AnalyzeIntelVeracityOutput, TallyAnomalyOutput };



export interface LiveTally {
  id: string;
  officerId: string;
  pollingStation: string;
  registeredVoters: number;
  voteDistribution: { id: string; votes: number }[];
  timestamp: Date;
  verifications: number;
  county: string;
  subCounty: string;
  ward: string;
  formUrl?: string; // Optional URL to the form image
}

export type TallyAnalysisState = {
  status: 'loading' | 'complete' | 'error';
  result?: TallyAnomalyOutput;
};

export const pollingStations = [
  // Nairobi
  { name: "KICC", registeredVoters: 2500, county: "Nairobi", subCounty: "Starehe", ward: "Nairobi Central" },
  { name: "Uhuru Park", registeredVoters: 3500, county: "Nairobi", subCounty: "Starehe", ward: "Nairobi Central" },
  { name: "Westlands Primary", registeredVoters: 1800, county: "Nairobi", subCounty: "Westlands", ward: "Parklands/Highridge" },
  { name: "Dagoretti Market", registeredVoters: 1200, county: "Nairobi", subCounty: "Dagoretti", ward: "Mutuini" },
  // Mombasa
  { name: "Moi Avenue Primary", registeredVoters: 1800, county: "Mombasa", subCounty: "Mvita", ward: "Mji wa Kale" },
  { name: "Likoni Ferry", registeredVoters: 2100, county: "Mombasa", subCounty: "Likoni", ward: "Likoni" },
  { name: "Changamwe Social Hall", registeredVoters: 1700, county: "Mombasa", subCounty: "Changamwe", ward: "Changamwe" },
  // Kisumu
  { name: "Kisumu Social Hall", registeredVoters: 2200, county: "Kisumu", subCounty: "Kisumu Central", ward: "Market Milimani" },
  { name: "Jomo Kenyatta Grounds", registeredVoters: 2600, county: "Kisumu", subCounty: "Kisumu Central", ward: "Shaurimoyo" },
  { name: "Ahero Primary", registeredVoters: 1400, county: "Kisumu", subCounty: "Nyando", ward: "Ahero" },
  // Uasin Gishu
  { name: "Eldoret Town Hall", registeredVoters: 2800, county: "Uasin Gishu", subCounty: "Kapseret", ward: "Kapseret" },
  { name: "Langas Primary", registeredVoters: 1600, county: "Uasin Gishu", subCounty: "Langas", ward: "Langas" },
  // Nyeri
  { name: "Nyeri Primary", registeredVoters: 1500, county: "Nyeri", subCounty: "Nyeri Town", ward: "Kiganjo/Mathari" },
  { name: "Tetu Market", registeredVoters: 1100, county: "Nyeri", subCounty: "Tetu", ward: "Dedan Kimathi" },
  // Garissa
  { name: "Garissa Primary", registeredVoters: 1300, county: "Garissa", subCounty: "Garissa Township", ward: "Waberi" },
  // Turkana
  { name: "Lodwar Primary", registeredVoters: 1200, county: "Turkana", subCounty: "Turkana Central", ward: "Kanamkemer" },
  // Meru
  { name: "Meru Market", registeredVoters: 1700, county: "Meru", subCounty: "Imenti North", ward: "Municipality" },
  // Kakamega
  { name: "Kakamega Primary", registeredVoters: 2000, county: "Kakamega", subCounty: "Kakamega Central", ward: "Shieywe" },
  // Bungoma
  { name: "Bungoma DEB", registeredVoters: 1500, county: "Bungoma", subCounty: "Kanduyi", ward: "Township" },
  // Machakos
  { name: "Machakos Primary", registeredVoters: 1800, county: "Machakos", subCounty: "Machakos Town", ward: "Machakos Central" },
  // Kitui
  { name: "Kitui Primary", registeredVoters: 1400, county: "Kitui", subCounty: "Kitui Central", ward: "Township" },
  // Kisii
  { name: "Kisii Primary", registeredVoters: 1600, county: "Kisii", subCounty: "Kisii Central", ward: "Township" },
  // Embu
  { name: "Embu Market", registeredVoters: 1200, county: "Embu", subCounty: "Manyatta", ward: "Blue Valley" },
  // Nandi
  { name: "Kapsabet Primary", registeredVoters: 1300, county: "Nandi", subCounty: "Emgwen", ward: "Kapsabet" },
  // Kericho
  { name: "Kericho Primary", registeredVoters: 1400, county: "Kericho", subCounty: "Ainamoi", ward: "Kericho Town" },
  // Narok
  { name: "Narok Primary", registeredVoters: 1200, county: "Narok", subCounty: "Narok North", ward: "Narok Town" },
  // Makueni
  { name: "Wote Primary", registeredVoters: 1100, county: "Makueni", subCounty: "Wote", ward: "Wote" },
  // Laikipia
  { name: "Nanyuki Primary", registeredVoters: 1300, county: "Laikipia", subCounty: "Laikipia East", ward: "Nanyuki" },
  // Isiolo
  { name: "Isiolo Primary", registeredVoters: 1000, county: "Isiolo", subCounty: "Isiolo", ward: "Township" },
  // Marsabit
  { name: "Marsabit Primary", registeredVoters: 900, county: "Marsabit", subCounty: "Saku", ward: "Marsabit Town" },
  // Samburu
  { name: "Maralal Primary", registeredVoters: 800, county: "Samburu", subCounty: "Samburu Central", ward: "Maralal" },
  // Taita Taveta
  { name: "Voi Primary", registeredVoters: 1100, county: "Taita Taveta", subCounty: "Voi", ward: "Voi Town" },
  // Kwale
  { name: "Kwale Primary", registeredVoters: 1000, county: "Kwale", subCounty: "Matuga", ward: "Kwale Town" },
  // Lamu
  { name: "Lamu Primary", registeredVoters: 700, county: "Lamu", subCounty: "Lamu", ward: "Lamu Town" },
  // Baringo
  { name: "Kabarnet Primary", registeredVoters: 900, county: "Baringo", subCounty: "Baringo Central", ward: "Kabarnet" },
  // West Pokot
  { name: "Kapenguria Primary", registeredVoters: 800, county: "West Pokot", subCounty: "Kapenguria", ward: "Kapenguria" },
  // Trans Nzoia
  { name: "Kitale Primary", registeredVoters: 1200, county: "Trans Nzoia", subCounty: "Kiminini", ward: "Kitale" },
  // Migori
  { name: "Migori Primary", registeredVoters: 1100, county: "Migori", subCounty: "Migori", ward: "Migori Town" },
  // Homa Bay
  { name: "Homa Bay Primary", registeredVoters: 1000, county: "Homa Bay", subCounty: "Homa Bay Town", ward: "Homa Bay Central" },
  // Siaya
  { name: "Siaya Primary", registeredVoters: 900, county: "Siaya", subCounty: "Siaya", ward: "Siaya Town" },
  // Nyamira
  { name: "Nyamira Primary", registeredVoters: 800, county: "Nyamira", subCounty: "Nyamira North", ward: "Nyamira Town" },
  // Vihiga
  { name: "Vihiga Primary", registeredVoters: 700, county: "Vihiga", subCounty: "Vihiga", ward: "Vihiga Town" },
  // Busia
  { name: "Busia Primary", registeredVoters: 600, county: "Busia", subCounty: "Busia", ward: "Busia Town" },
  // Tana River
  { name: "Hola Primary", registeredVoters: 500, county: "Tana River", subCounty: "Hola", ward: "Hola Town" },
  // Mandera
  { name: "Mandera Primary", registeredVoters: 400, county: "Mandera", subCounty: "Mandera East", ward: "Mandera Town" },
  // Wajir
  { name: "Wajir Primary", registeredVoters: 300, county: "Wajir", subCounty: "Wajir East", ward: "Wajir Town" },
];
