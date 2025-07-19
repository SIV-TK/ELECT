import type { Politician, Candidate } from '@/types';

export const politicians: Politician[] = [
  {
    id: 'anne-waiguru',
    name: 'Anne Waiguru',
    party: 'Jubilee',
    level: 'Gubernatorial',
    county: 'Kirinyaga',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'Governor of Kirinyaga, known for her reforms in county governance and women empowerment.',
    trackRecord: {
      workHistory: ['Governor of Kirinyaga', 'Cabinet Secretary for Devolution'],
      promisesKept: ['Improved health facilities', 'Women empowerment programs'],
      promisesBroken: ['Delayed road projects'],
      contributions: ['Promoted devolution and county autonomy'],
    },
    legalOversight: {
      courtCases: ['NYS scandal (acquitted)'],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Kiamugumo Primary',
      highSchool: 'Kenya High School',
      university: 'University of Nairobi (MBA)',
      notableAchievements: ['Top 40 Under 40 Women Award'],
    }
  },
  {
    id: 'millicent-omanga',
    name: 'Millicent Omanga',
    party: 'UDA',
    level: 'WomenRep',
    county: 'Nairobi',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'Former Nairobi Women Rep, known for her grassroots mobilization and social media presence.',
    trackRecord: {
      workHistory: ['Nairobi Women Rep', 'Businesswoman'],
      promisesKept: ['Supported women in business'],
      promisesBroken: ['Unfulfilled promise for youth employment'],
      contributions: ['Advocated for women and youth empowerment'],
    },
    legalOversight: {
      courtCases: [],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Mbagathi Primary',
      highSchool: 'Moi Girls Nairobi',
      university: 'University of Nairobi (Commerce)',
      notableAchievements: ['Social Media Influencer Award'],
    }
  },
  {
    id: 'mutula-kilonzo-jr',
    name: 'Mutula Kilonzo Jr.',
    party: 'Wiper',
    level: 'Gubernatorial',
    county: 'Makueni',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'Governor of Makueni, lawyer and advocate for transparent governance.',
    trackRecord: {
      workHistory: ['Governor of Makueni', 'Senator of Makueni'],
      promisesKept: ['Water projects for rural areas'],
      promisesBroken: ['Delayed hospital upgrades'],
      contributions: ['Promoted legal reforms in county government'],
    },
    legalOversight: {
      courtCases: [],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Makueni Primary',
      highSchool: 'Lenana School',
      university: 'University of Nairobi (Law)',
      notableAchievements: ['Law Society of Kenya Award'],
    }
  },
  {
    id: 'aaron-cheruiyot',
    name: 'Aaron Cheruiyot',
    party: 'UDA',
    level: 'Senatorial',
    county: 'Kericho',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'Senator for Kericho, known for his youth leadership and legislative work.',
    trackRecord: {
      workHistory: ['Senator for Kericho'],
      promisesKept: ['Improved education funding'],
      promisesBroken: ['Unfulfilled promise for new stadium'],
      contributions: ['Advocated for youth in politics'],
    },
    legalOversight: {
      courtCases: [],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Kericho Primary',
      highSchool: 'Kericho High School',
      university: 'Moi University (Communication)',
      notableAchievements: ['Youngest Senator Award'],
    }
  },
  {
    id: 'junet-mohamed',
    name: 'Junet Mohamed',
    party: 'ODM',
    level: 'MP',
    constituency: 'Suna East',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'MP for Suna East, vocal in parliamentary debates and party politics.',
    trackRecord: {
      workHistory: ['MP for Suna East'],
      promisesKept: ['Improved local roads'],
      promisesBroken: ['Unfulfilled promise for new market'],
      contributions: ['Strengthened party grassroots'],
    },
    legalOversight: {
      courtCases: [],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Migori Primary',
      highSchool: 'Kisii High School',
      university: 'University of Nairobi (Business)',
      notableAchievements: ['Best Debater Award'],
    }
  },
  // ...existing politicians...
  {
    id: 'martha-karua',
    name: 'Martha Karua',
    party: 'NARC Kenya',
    level: 'Presidential',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'A prominent Kenyan lawyer and politician, known for her advocacy for justice and women’s rights.',
    trackRecord: {
      workHistory: ['Minister of Justice (2005-2009)', 'Member of Parliament for Gichugu'],
      promisesKept: ['Advocated for constitutional reforms', 'Promoted gender equality in government'],
      promisesBroken: ['Failed to pass some anti-corruption bills'],
      contributions: ['Key role in constitutional review process', 'Champion for women’s rights'],
    },
    legalOversight: {
      courtCases: ['Election petition (2013)'],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Kabare Primary School',
      highSchool: 'Kabare Girls High School',
      university: 'University of Nairobi (Law)',
      notableAchievements: ['Kenya Jurist of the Year Award'],
    }
  },
  {
    id: 'john-mbadi',
    name: 'John Mbadi',
    party: 'ODM',
    level: 'MP',
    constituency: 'Suba South',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'A seasoned parliamentarian and party leader, known for his strong stance on fiscal responsibility.',
    trackRecord: {
      workHistory: ['MP for Suba South', 'ODM National Chairman'],
      promisesKept: ['Improved local infrastructure'],
      promisesBroken: ['Unfulfilled promise to build a new hospital'],
      contributions: ['Advocated for budgetary discipline in parliament'],
    },
    legalOversight: {
      courtCases: [],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Mbita Primary School',
      highSchool: 'Mbita High School',
      university: 'University of Nairobi (Commerce)',
      notableAchievements: ['Best MP Award 2019'],
    }
  },
  {
    id: 'gladys-wanga',
    name: 'Gladys Wanga',
    party: 'ODM',
    level: 'Gubernatorial',
    county: 'Homa Bay',
    imageUrl: 'https://placehold.co/400x400.png',
    bio: 'Governor of Homa Bay, known for her focus on health and education reforms.',
    trackRecord: {
      workHistory: ['Governor of Homa Bay', 'Women Rep for Homa Bay'],
      promisesKept: ['Launched free maternal healthcare program'],
      promisesBroken: ['Delayed construction of county roads'],
      contributions: ['Promoted girls’ education initiatives'],
    },
    legalOversight: {
      courtCases: ['Audit queries on county spending'],
      hasAdverseFindings: false,
    },
    academicLife: {
      primarySchool: 'Homa Bay Primary',
      highSchool: 'Asumbi Girls High School',
      university: 'Kenya Methodist University (Health Sciences)',
      notableAchievements: ['Health Leadership Award 2022'],
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
