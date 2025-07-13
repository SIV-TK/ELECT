import type { Politician, Candidate } from '@/types';

export const politicians: Politician[] = [
  {
    id: 'raila-odinga',
    name: 'Raila Odinga',
    party: 'Azimio La Umoja',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/400x400.png',
    trackRecord: {
      workHistory: ['Prime Minister of Kenya (2008-2013)', 'Member of Parliament for Langata'],
      promisesKept: ['Devolution advocacy', 'Infrastructure development during premiership'],
      promisesBroken: ['Pledge to reduce cost of living (during campaigns)'],
      contributions: ['Key figure in Kenya\'s second liberation', 'Champion of the 2010 constitution'],
    },
    legalOversight: {
      courtCases: ['Presidential election petition (2013, 2017, 2022)'],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Maranda Primary School',
      highSchool: 'Maranda High School',
      university: 'Technical University of Magdeburg (Germany)',
      notableAchievements: ['Degree in Mechanical Engineering'],
    }
  },
  {
    id: 'william-ruto',
    name: 'William Ruto',
    party: 'United Democratic Alliance',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/400x400.png',
    trackRecord: {
      workHistory: ['President of Kenya (2022-Present)', 'Deputy President of Kenya (2013-2022)', 'Minister of Agriculture'],
      promisesKept: ['Hustler Fund initiative', 'Digital transformation projects'],
      promisesBroken: ['Promise to lower fuel prices within first 100 days'],
      contributions: ['Advocacy for bottom-up economic model', 'Agricultural reforms'],
    },
    legalOversight: {
      courtCases: ['ICC case (charges dropped)', 'Land acquisition disputes (media reports)'],
      hasAdverseFindings: true,
    },
    academicLife: {
        primarySchool: 'Kamagut Primary School',
        highSchool: 'Wareng Secondary School',
        university: 'University of Nairobi (PhD in Plant Ecology)',
        notableAchievements: ['Published several scientific papers'],
    }
  },
    {
    id: 'sakaja-johnson',
    name: 'Sakaja Johnson',
    party: 'United Democratic Alliance',
    level: 'Gubernatorial',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/400x400.png',
    trackRecord: {
      workHistory: ['Governor of Nairobi County (2022-Present)', 'Senator of Nairobi County (2017-2022)'],
      promisesKept: ['School feeding program in Nairobi', 'Streamlining business permits'],
      promisesBroken: ['Pledge to solve Nairobi\'s traffic menace within 2 years'],
      contributions: ['Youth empowerment programs', 'Arts and culture promotion'],
    },
    legalOversight: {
      courtCases: ['Degree certificate validity case'],
      hasAdverseFindings: true,
    },
    academicLife: {
        primarySchool: 'Aga Khan Primary School',
        highSchool: 'Lenana School',
        university: 'Team University (Uganda)',
        notableAchievements: ['Student leader at University of Nairobi (unconfirmed)'],
    }
  },
];

export const presidentialCandidates: Candidate[] = [
  {
    id: 'raila-odinga',
    name: 'Raila Odinga',
    party: 'Azimio La Umoja',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/100x100.png',
    votes: 0,
  },
  {
    id: 'william-ruto',
    name: 'William Ruto',
    party: 'United Democratic Alliance',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/100x100.png',
    votes: 0,
  },
    {
    id: 'george-wajackoyah',
    name: 'George Wajackoyah',
    party: 'Roots Party',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/100x100.png',
    votes: 0,
  },
];
