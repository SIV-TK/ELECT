import type { Politician, Candidate } from '@/types';

export const politicians: Politician[] = [
  {
    id: 'raila-odinga',
    name: 'Raila Odinga',
    party: 'Azimio La Umoja',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'A veteran Kenyan politician who has served as the Prime Minister and has been a long-time opposition leader. Known for his role in Kenya\'s constitutional reforms.',
    trackRecord: {
      workHistory: ['Prime Minister of Kenya (2008-2013)', 'Member of Parliament for Langata', 'Minister of Energy', 'Minister of Roads, Public Works, and Housing'],
      promisesKept: ['Devolution advocacy leading to the 2010 constitution', 'Infrastructure development during premiership, like the Thika Superhighway'],
      promisesBroken: ['Pledge to reduce cost of living (during campaigns)', 'Unfulfilled promise to create 500,000 jobs annually'],
      contributions: ['Key figure in Kenya\'s second liberation', 'Champion of the 2010 constitution', 'Advocate for democratic reforms'],
    },
    legalOversight: {
      courtCases: ['Presidential election petition (2013, 2017, 2022)', 'Acquitted in the molasses plant scandal'],
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
    bio: 'The current President of Kenya, rising from a humble background to the highest office. He champions a "bottom-up" economic model.',
    trackRecord: {
      workHistory: ['President of Kenya (2022-Present)', 'Deputy President of Kenya (2013-2022)', 'Minister of Agriculture', 'Minister of Higher Education'],
      promisesKept: ['Establishment of the Hustler Fund', 'Digital transformation projects, including Wi-Fi hotspots'],
      promisesBroken: ['Promise to lower fuel prices within first 100 days', 'Pledge to reduce national debt significantly'],
      contributions: ['Advocacy for bottom-up economic model', 'Agricultural reforms during his ministerial tenure', 'Push for affordable housing program'],
    },
    legalOversight: {
      courtCases: ['ICC case for crimes against humanity (charges dropped)', 'Various land acquisition disputes reported in media'],
      hasAdverseFindings: true,
    },
    academicLife: {
        primarySchool: 'Kamagut Primary School',
        highSchool: 'Wareng Secondary School',
        university: 'University of Nairobi (PhD in Plant Ecology)',
        notableAchievements: ['Published several scientific papers on plant ecology'],
    }
  },
    {
    id: 'sakaja-johnson',
    name: 'Sakaja Johnson',
    party: 'United Democratic Alliance',
    level: 'Gubernatorial',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'The Governor of Nairobi County, known for his appeal to the youth and focus on urban development and social programs in the city.',
    trackRecord: {
      workHistory: ['Governor of Nairobi County (2022-Present)', 'Senator of Nairobi County (2017-2022)', 'Nominated Member of Parliament'],
      promisesKept: ['"Dishi na County" school feeding program in Nairobi', 'Streamlining business permits to create a friendlier business environment'],
      promisesBroken: ['Pledge to solve Nairobi\'s traffic menace within 2 years', 'Promise to construct 20 new markets for traders'],
      contributions: ['Youth empowerment programs through the Sakaja Foundation', 'Sponsorship of various bills in the Senate related to urban planning and development'],
    },
    legalOversight: {
      courtCases: ['Controversy and investigation over the validity of his degree certificate from Team University'],
      hasAdverseFindings: true,
    },
    academicLife: {
        primarySchool: 'Aga Khan Primary School',
        highSchool: 'Lenana School',
        university: 'Team University (Uganda), University of Nairobi (Actuarial Science - incomplete)',
        notableAchievements: ['Held leadership positions in student politics at the University of Nairobi'],
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
    bio: 'A veteran Kenyan politician.',
    votes: 0,
  },
  {
    id: 'william-ruto',
    name: 'William Ruto',
    party: 'United Democratic Alliance',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'The current President of Kenya.',
    votes: 0,
  },
  {
    id: 'george-wajackoyah',
    name: 'George Wajackoyah',
    party: 'Roots Party',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'An unconventional politician.',
    votes: 0,
  },
];

export const gubernatorialCandidates: Candidate[] = [
  {
    id: 'sakaja-johnson',
    name: 'Sakaja Johnson',
    party: 'UDA',
    level: 'Gubernatorial',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'Current Governor of Nairobi.',
    votes: 0,
  },
  {
    id: 'polycarp-igathe',
    name: 'Polycarp Igathe',
    party: 'Azimio',
    level: 'Gubernatorial',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'A corporate executive and politician.',
    votes: 0,
  },
];

export const senatorialCandidates: Candidate[] = [
  {
    id: 'edwin-sifuna',
    name: 'Edwin Sifuna',
    party: 'ODM',
    level: 'Senatorial',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'Current Senator for Nairobi.',
    votes: 0,
  },
  {
    id: 'margaret-wambui',
    name: 'Margaret Wambui',
    party: 'UDA',
    level: 'Senatorial',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'A Bishop and politician.',
    votes: 0,
  },
];

export const womenRepCandidates: Candidate[] = [
  {
    id: 'esther-passaris',
    name: 'Esther Passaris',
    party: 'ODM',
    level: 'WomenRep',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'Current Women Representative for Nairobi.',
    votes: 0,
  },
  {
    id: 'millicent-omanga',
    name: 'Millicent Omanga',
    party: 'UDA',
    level: 'WomenRep',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'A businesswoman and politician.',
    votes: 0,
  },
];

export const mcaCandidates: Candidate[] = [
  {
    id: 'robert-alakadwa',
    name: 'Robert Alai',
    party: 'ODM',
    level: 'MCA',
    ward: 'Karen',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'A well-known blogger and MCA.',
    votes: 0,
  },
  {
    id: 'jane-wanjiku',
    name: 'Jane Wanjiku',
    party: 'UDA',
    level: 'MCA',
    ward: 'Karen',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'A community leader and aspirant.',
    votes: 0,
  },
  {
    id: 'peter-kariuki',
    name: 'Peter Kariuki',
    party: 'Independent',
    level: 'MCA',
    ward: 'Karen',
    imageUrl: 'https://placehold.co/100x100.png',
    bio: 'An independent candidate focusing on local issues.',
    votes: 0,
  },
];
