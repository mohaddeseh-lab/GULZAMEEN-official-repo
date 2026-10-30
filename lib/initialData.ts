import { RegionInfo, NetworkNode, QuizQuestion, WordScrambleItem } from './types';

export const REGIONS: RegionInfo[] = [
  {
    id: 'eastern',
    name: 'Eastern Balochistan',
    tagline: 'Coastal Plains & Woven Epic Songs',
    description:
      'Home to the Suleiman mountain foothills, fertile river valleys, and historic trade routes where oral epics and woven storytelling flourished through generations of balladeers.',
    highlights: [
      'Suleiman Mountain Oral Traditions',
      'Rind & Lashari Epic Ballads',
      'Historic Kachhi Plain Pottery',
    ],
    climate: 'Arid Plains & Mountainous Valley',
    famousArt: 'Deep Ruby Thread Needlework & Damboor Ballads',
    mapCoordinates: {
      x: 70,
      y: 35,
      width: 24,
      height: 30,
    },
  },
  {
    id: 'western',
    name: 'Western Balochistan',
    tagline: 'Highland Customs & Suroz Melodies',
    description:
      'Highland plateau characterized by cool mountain breezes, ancient Chaghi & Kharan oasis craft, Suroz bow lute performances, and enduring nomadic pastoral customs.',
    highlights: [
      'Suroz Bow-Lute Performances',
      'Chaghi Desert Nomadic Weaving',
      'Zahirok Longing Songs',
    ],
    climate: 'Highland Plateau & Cold Desert',
    famousArt: 'Kapuk Starburst Mirrorwork & Suroz Bow Music',
    mapCoordinates: {
      x: 30,
      y: 30,
      width: 28,
      height: 32,
    },
  },
  {
    id: 'southern',
    name: 'Southern Balochistan',
    tagline: 'Makran Coast & Palm Grove Rhythms',
    description:
      'Stretching along the Arabian Sea and the lush Makran palm oases, celebrated for sea-faring folk chants, Gwadar market rhythms, and intricate Pashk dress embroidery.',
    highlights: [
      'Makran Coast Sea Shanties',
      'Gwadar Dhol Beats & Lawaa Dance',
      'Lush Date Palm Harvest Folk Songs',
    ],
    climate: 'Subtropical Coastal & Palm Oasis',
    famousArt: 'Full-Frontal Pashk & Jup Intricate Silk Panels',
    mapCoordinates: {
      x: 45,
      y: 70,
      width: 35,
      height: 25,
    },
  },
  ];

  export const NETWORK_NODES: NetworkNode[] = [ { id: 'core-1', label: 'Gulzameen', balochiName: 'Gulzameen Heritage Archive', category: 'core', description: 'The central repository of Balochistan heritage, unifying oral literature, music, cuisine, embroidery, and folk wisdom.', connections: ['node-kissa-1', 'node-saoth-1', 'node-duch-1', 'node-recipe-1', 'node-bathal-1'], iconName: 'Landmark', x: 50, y: 50 }, { id: 'node-kissa-1', label: 'Hani & Sheh Mureed Epic', balochiName: 'Hani o Sheh Mureed', category: 'kissa', description: 'Greatest 15th-century folk story celebrating devotion, chivalry, and tribal honor.', connections: ['core-1', 'node-saoth-1', 'node-bathal-1'], iconName: 'BookOpen', x: 25, y: 28 }, { id: 'node-saoth-1', label: 'Suroz & Zahirok Music', balochiName: 'Suroz o Zahirok', category: 'saoth', description: 'Microtonal bowed instrument tunes capturing longing and desert wind melodies.', connections: ['core-1', 'node-kissa-1', 'node-duch-1'], iconName: 'Music', x: 75, y: 25 }, { id: 'node-duch-1', label: 'Baloch Duch Embroidery', balochiName: 'Balochi Duch', category: 'baloch_duch', description: 'Geometric needlecraft with mirror work, representing family history and regional identity.', connections: ['core-1', 'node-saoth-1', 'node-recipe-1'], iconName: 'Sparkles', x: 80, y: 72 }, { id: 'node-recipe-1', label: 'Sajji & Kaak Culinary Arts', balochiName: 'Sajji o Kaak', category: 'recipes', description: 'Fire-roasted open pit meats and river stone baked bread from nomad traditions.', connections: ['core-1', 'node-duch-1', 'node-bathal-1'], iconName: 'Utensils', x: 22, y: 75 }, { id: 'node-bathal-1', label: 'Balochi Proverbs (Bathal)', balochiName: 'Balochi Bathal', category: 'bathal', description: 'Time-tested aphorisms and oral wisdom guiding tribal harmony and ethics.', connections: ['core-1', 'node-kissa-1', 'node-recipe-1'], iconName: 'Quote', x: 50, y: 88 } ];

  export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      'Which iconic traditional Baloch instrument is an upright bowed lute made from mulberry wood with resonant strings?',
    options: ['Sitar', 'Suroz', 'Harmonium', 'Rubab'],
    correctAnswer: 1,
    explanation:
      'The Suroz is the quintessential string instrument of Balochistan, bowed with horsehair to produce rich microtonal glides.',
  },
  {
    id: 2,
    question:
      'What is the traditional Baloch stone-baked bread wrapped around heated river stones called?',
    options: ['Sajji', 'Kaak (Krch)', 'Puri', 'Naan-e-Tanoor'],
    correctAnswer: 1,
    explanation:
      'Kaak (or Krch) is made by wrapping leavened dough around hot river stones and baking them directly in glowing embers.',
  },
  {
    id: 3,
    question:
      'Which legendary 15th-century folk tale depicts the ultimate spiritual devotion of Sheh Mureed?',
    options: [
      'Heer Ranjha',
      'Hani and Sheh Mureed',
      'Sohni Mahiwal',
      'Laila Majnu',
    ],
    correctAnswer: 1,
    explanation:
      'Hani and Sheh Mureed is the epic tale of chivalry, bowmanship, and selfless love in Balochi literature.',
  },
  {
    id: 4,
    question: 'In traditional Baloch embroidery (Baloch Duch), what is "Jup"?',
    options: [
      'A silver headpiece',
      'A large deep pocket pouch in the tunic',
      'A type of leather sandal',
      'A wooden loom',
    ],
    correctAnswer: 1,
    explanation:
      'Jup is the distinctively large, deeply embroidered pocket pouch stitched into the lower panel of the traditional Pashk dress.',
  },
  {
    id: 5,
    question: 'What is "Zahirok" in Balochi music?',
    options: [
      'A fast festival dance rhythm',
      'A melancholic song expressing deep longing and nostalgia',
      'A wedding chant',
      'A lullaby for children',
    ],
    correctAnswer: 1,
    explanation:
      'Zahirok is the soulful, expressive genre of Balochi music that captures longing for homeland, distant companions, and loved ones.',
  },
  {
    id: 6,
    question:
      'What is the ancient subterranean irrigation system used across arid regions of Balochistan called?',
    options: ['Karez (Qanat)', 'Shaduf', 'Noria', 'Bawdi'],
    correctAnswer: 0,
    explanation:
      'Karez is an ancient water management network of underground channels that carries groundwater from mountains without evaporation loss.',
  },
  {
    id: 7,
    question:
      'Which iconic double-flute instrument consists of two joined reed pipes played simultaneously with continuous circular breathing?',
    options: ['Bansuri', 'Donali (Alghoza)', 'Shehnai', 'Pungi'],
    correctAnswer: 1,
    explanation:
      'The Donali (or Alghoza) features two wooden reed flutes played together—one providing a continuous rhythmic drone and the other playing the melody.',
  },
  {
    id: 8,
    question:
      'In Baloch tribal culture, what does the sacred code of conduct known as "Mayar" emphasize?',
    options: [
      'Trading & barter values',
      'Asylum, protection, and sanctuary offered to anyone seeking refuge',
      'Agricultural harvesting rules',
      'Sea navigation laws',
    ],
    correctAnswer: 1,
    explanation:
      'Mayar is the ancient honor principle requiring a Baloch to protect and grant unconditional asylum to anyone who seeks shelter under their roof.',
  },
  {
    id: 9,
    question:
      'Which archaeological site in Balochistan dates back to 7000 BCE, revealing early farming and dentistry in South Asia?',
    options: ['Mohenjo-daro', 'Mehrgarh', 'Harappa', 'Taxila'],
    correctAnswer: 1,
    explanation:
      'Mehrgarh in Kacchi district is one of the oldest Neolithic archaeological settlements in South Asia, predating the Indus Valley Civilization.',
  },
  {
    id: 10,
    question:
      'What is the traditional Baloch communal assembly or council where village elders gather to resolve disputes?',
    options: ['Jirga (Diwan)', 'Panchayat', 'Sabha', 'Majlis'],
    correctAnswer: 0,
    explanation:
      'The Jirga (or traditional Diwan) brings tribal elders together under custom law (Riwaj) to arbitrate community issues peacefully.',
  },
  {
    id: 11,
    question:
      'Which traditional Balochi dance is performed by men or women in a circle with synchronized clapping and footwork during celebrations?',
    options: ['Attan', 'Do-Chapi', 'Bhangra', 'Giddha'],
    correctAnswer: 1,
    explanation:
      'Do-Chapi (meaning two-clap) is a rhythmic circle dance where dancers sway, clap, and step to the beat of the Dhol drum.',
  },
  {
    id: 12,
    question: 'What is "Chawat" in traditional Balochi attire?',
    options: [
      'Handcrafted leather sandals made by local artisans',
      'A silk headscarf',
      'A woolen winter cloak',
      'A silver bangle',
    ],
    correctAnswer: 0,
    explanation:
      'Chawat are durable, handcrafted leather sandals traditional to Balochistan, designed to withstand rugged desert terrain.',
  },
  {
    id: 13,
    question:
      'Which famous coastal port in Makran, Balochistan, sits along the Arabian Sea and serves as a historical maritime hub?',
    options: ['Gwadar', 'Karachi', 'Chabahar', 'Ormara'],
    correctAnswer: 0,
    explanation:
      'Gwadar is a historic coastal deep-water port along the Arabian Sea, known for fishing heritage and ancient maritime trade routes.',
  },
  {
    id: 14,
    question:
      'What is "Khadit" (or Landhi) in Balochi culinary tradition?',
    options: [
      'Salted and sun-dried meat prepared for harsh winter months',
      'A sweet date pastry',
      'Spiced tea brewed over charcoal',
      'A fermented goat cheese',
    ],
    correctAnswer: 0,
    explanation:
      'Khadit (Landhi) is a traditional method of curing salted mutton or beef in cold mountain winds to preserve it for winter consumption.',
  },
  {
    id: 15,
    question:
      'Which intricate embroidery motif in Baloch dress design is placed on the chest panel of the tunic?',
    options: ['Zih (Zup)', 'Gotta', 'Phulkari', 'Chikan'],
    correctAnswer: 0,
    explanation:
      'The Zih is the elaborately stitched neck and chest panel that serves as the centerpiece of a handcrafted Balochi Pashk dress.',
  },
  {
    id: 16,
    question:
      'What is the traditional Balochi long woolen cloak worn by men in cold mountain winters called?',
    options: ['Shal', 'Kosh', 'Kaba (Choga)', 'Patu'],
    correctAnswer: 2,
    explanation:
      'The Kaba (or Choga) is a thick, hand-spun woolen cloak decorated with subtle embroidery, worn against harsh mountain cold.',
  },
  {
    id: 17,
    question:
      'Which unique geological feature in Balochistan features active mud cones ejecting cold mud and minerals?',
    options: [
      'Hingol Mud Volcanoes',
      'Thar Dunes',
      'Kirthar Caves',
      'Ziarat Valley',
    ],
    correctAnswer: 0,
    explanation:
      'The Hingol Mud Volcanoes (such as Chandragup) are famous geological formations in Hingol National Park along the Makran coast.',
  },
  {
    id: 18,
    question:
      'What is the famous ancient juniper forest reserve located in northern Balochistan near Quetta?',
    options: [
      'Ziarat Juniper Forest',
      'Changa Manga',
      'Margalla Reserve',
      'Deosai Plateau',
    ],
    correctAnswer: 0,
    explanation:
      'The Ziarat Juniper Forest is one of the oldest and largest natural juniper ecosystems in the world, with trees over 2,000 years old.',
  },
  {
    id: 19,
    question: 'What is "Mahl" or "Mehmandari" in Baloch cultural ethos?',
    options: [
      'Sacred hospitality towards guests',
      'Camel racing',
      'Carpet weaving',
      'Archery practice',
    ],
    correctAnswer: 0,
    explanation:
      'Mehmandari (hospitality) is a foundational pillar of Baloch culture; guests are greeted with warm tea, dates, and generous feasts regardless of status.',
  },
  {
    id: 20,
    question:
      'Which traditional stringed drone instrument with metal pegs often accompanies the Suroz in Balochi music ensembles?',
    options: ['Dambur (Tanbur)', 'Tabla', 'Flute', 'Santoor'],
    correctAnswer: 0,
    explanation:
      'The Dambur (or Dambura) provides a hypnotic rhythmic drone that underpins traditional Balochi vocal ballads and instrumental solos.',
  },
];

export const WORD_SCRAMBLE_ITEMS: WordScrambleItem[] = [
  {
    id: 1,
    scrambled: 'ZSORU',
    word: 'SUROZ',
    hint: 'Master stringed instrument of Balochistan played with a bow.',
    meaning:
      'Four-stringed upright lute considered the acoustic soul of Balochi music.',
  },
  {
    id: 2,
    scrambled: 'JISAI',
    word: 'SAJJI',
    hint: 'Famous fire-roasted mutton cooked over smoldering logs.',
    meaning: 'Traditional spit-roasted lamb seasoned with salt and embers.',
  },
  {
    id: 3,
    scrambled: 'SSIAK',
    word: 'KISSA',
    hint: 'Balochi word for folk story or epic tale.',
    meaning:
      'Oral literature passed down through generations by balladeers.',
  },
  {
    id: 4,
    scrambled: 'KAHPS',
    word: 'PASHK',
    hint: 'Traditional long tunic worn with rich embroidery.',
    meaning:
      'The elegant full-length dress featuring intricate chest panels (Zih).',
  },
  {
    id: 5,
    scrambled: 'LTHABA',
    word: 'BATHAL',
    hint: 'Traditional Balochi proverbs and folk aphorisms.',
    meaning:
      'Proverbs conveying wisdom, honor, and community guidance.',
  },
  {
    id: 6,
    scrambled: 'ZERAK',
    word: 'KAREZ',
    hint: 'Ancient subterranean underground canal system for water.',
    meaning:
      'Underground aqueduct channels delivering mountain water without evaporation.',
  },
  {
    id: 7,
    scrambled: 'ILADON',
    word: 'DONALI',
    hint: 'Traditional double reed flute played with circular breathing.',
    meaning:
      'Twin wooden flutes that produce a melody and continuous drone simultaneously.',
  },
  {
    id: 8,
    scrambled: 'AAMRY',
    word: 'MAYAR',
    hint: 'Ethical code granting protection and sanctuary to guests.',
    meaning:
      'Sacred Baloch tradition of protecting anyone seeking refuge.',
  },
  {
    id: 9,
    scrambled: 'RHAMGEHR',
    word: 'MEHRGARH',
    hint: 'Neolithic archaeological site dating back to 7000 BCE.',
    meaning:
      'Ancient settlement revealing early farming and craft history in Balochistan.',
  },
  {
    id: 10,
    scrambled: 'RADWAG',
    word: 'GWADAR',
    hint: 'Historic coastal port town on the Arabian Sea.',
    meaning:
      'Strategic maritime city known for fishing culture and ancient trade routes.',
  },
  {
    id: 11,
    scrambled: 'MRUBAD',
    word: 'DAMBUR',
    hint: 'Long-necked stringed drone instrument.',
    meaning:
      'Rhythmic plucked instrument that accompanies Suroz and vocal performances.',
  },
  {
    id: 12,
    scrambled: 'TAWAHC',
    word: 'CHAWAT',
    hint: 'Handcrafted leather sandals made by traditional artisans.',
    meaning:
      'Sturdy desert footwear crafted with genuine stitched leather.',
  },
  {
    id: 13,
    scrambled: 'ATRAIZ',
    word: 'ZIARAT',
    hint: 'Scenic valley home to 2,000-year-old ancient juniper trees.',
    meaning:
      'High-altitude sanctuary renowned for pristine juniper forests and cool climate.',
  },
  {
    id: 14,
    scrambled: 'TIHDAK',
    word: 'KHADIT',
    hint: 'Salted, air-cured mutton preserved for winter seasons.',
    meaning:
      'Traditional method of wind-drying seasoned meat in cold mountain villages.',
  },
  {
    id: 15,
    scrambled: 'LOGNIH',
    word: 'HINGOL',
    hint: 'National park famous for mud volcanoes and coastal rock formations.',
    meaning:
      'Sprawling natural park along the Makran coast featuring active mud cones.',
  },
  {
    id: 16,
    scrambled: 'AGRIJ',
    word: 'JIRGA',
    hint: 'Communal council of elders assembled to resolve disputes.',
    meaning:
      'Traditional judicial assembly upholding community peace and custom law.',
  },
  {
    id: 17,
    scrambled: 'IPAHC',
    word: 'CHAPI',
    hint: 'Rhythmic clapping step dance performed during folk festivals.',
    meaning:
      'Synchronized group dance sways and claps performed in a circle.',
  },
  {
    id: 18,
    scrambled: 'LAHLA',
    word: 'HALAL',
    hint: 'Greeting ritual of sharing news and well-being with travelers.',
    meaning:
      'Traditional news exchange etiquette when meeting friends or travelers.',
  },
  {
    id: 19,
    scrambled: 'NADIW',
    word: 'DIWAN',
    hint: 'Cultural gathering or assembly hall for poetry and oral recitation.',
    meaning:
      'Traditional literary circle where poets and minstrels perform epics.',
  },
  {
    id: 20,
    scrambled: 'INARIM',
    word: 'MIRANI',
    hint: 'Historic dam and river valley reservoir in Dasht River basin.',
    meaning:
      'Vast water reservoir supporting agriculture and ecology in southern Balochistan.',
  },
];