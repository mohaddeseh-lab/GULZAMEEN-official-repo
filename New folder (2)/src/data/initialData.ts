import { CulturalItem, RegionInfo, NetworkNode, QuizQuestion, WordScrambleItem } from '../types';

export const REGIONS: RegionInfo[] = [
  {
    id: 'eastern',
    name: 'Eastern Balochistan',
    tagline: 'Coastal Plains & Woven Epic Songs',
    description: 'Home to the Suleiman mountain foothills, fertile river valleys, and historic trade routes where oral epics and woven storytelling flourished through generations of balladeers.',
    highlights: ['Suleiman Mountain Oral Traditions', 'Rind & Lashari Epic Ballads', 'Historic Kachhi Plain Pottery'],
    climate: 'Arid Plains & Mountainous Valley',
    famousArt: 'Deep Ruby Thread Needlework & Damboor Ballads',
    mapCoordinates: { x: 70, y: 35, width: 24, height: 30 }
  },
  {
    id: 'western',
    name: 'Western Balochistan',
    tagline: 'Highland Customs & Suroz Melodies',
    description: 'Highland plateau characterized by cool mountain breezes, ancient Chaghi & Kharan oasis craft, Suroz bow lute performances, and enduring nomadic pastoral customs.',
    highlights: ['Suroz Bow-Lute Performances', 'Chaghi Desert Nomadic Weaving', 'Zahirok Longing Songs'],
    climate: 'Highland Plateau & Cold Desert',
    famousArt: 'Kapuk Starburst Mirrorwork & Suroz Bow Music',
    mapCoordinates: { x: 30, y: 30, width: 28, height: 32 }
  },
  {
    id: 'southern',
    name: 'Southern Balochistan',
    tagline: 'Makran Coast & Palm Grove Rhythms',
    description: 'Stretching along the Arabian Sea and the lush Makran palm oases, celebrated for sea-faring folk chants, Gwadar market rhythms, and intricate Pashk dress embroidery.',
    highlights: ['Makran Coast Sea Shanties', 'Gwadar Dhol Beats & Lawaa Dance', 'Lush Date Palm Harvest Folk Songs'],
    climate: 'Subtropical Coastal & Palm Oasis',
    famousArt: 'Full-Frontal Pashk & Jup Intricate Silk Panels',
    mapCoordinates: { x: 45, y: 70, width: 35, height: 25 }
  }
];

export const INITIAL_CULTURAL_ITEMS: CulturalItem[] = [
  // --- EASTERN REGION ---
  {
    id: 'east-1',
    title: 'Epic Tale of Hani & Sheh Mureed',
    balochiTitle: 'Hani o Sheh Mureed e Kissa',
    region: 'eastern',
    category: 'kissa',
    description: 'The legendary 15th-century tale of unconditional devotion, chivalry, and spiritual sacrifice between chieftain Sheh Mureed and Hani of the Rind tribe.',
    details: [
      'Sheh Mureed, renowned for his unmatched archery skills with his bow "Kaman", surrendered his leadership to wander as an ascetic after a sacred pledge bound Hani to another chieftain.',
      'The epic is sung by bards (Pahlawan) using the Damboor lute across 100+ poetic couplets.',
      'Symbolizes honor, spiritual purity, and selfless commitment in Balochi folklore.'
    ],
    featured: true,
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: 'east-2',
    title: 'The Battle Ballads of Chakar & Gowahram',
    balochiTitle: 'Mir Chakar e Sheyr',
    region: 'eastern',
    category: 'kissa',
    description: 'An oral epic commemorating the 30-year conflict between Mir Chakar Rind and Mir Gowahram Lashari, celebrating tribal bravery and reconciliation.',
    details: [
      'Narrates tactical horse riding, sword craft, and tribal alliances across the Kachhi plain.',
      'Preserved entirely through poetic chants passed down by memory through generations.'
    ],
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: 'east-3',
    title: 'Zahirok (Song of Desert Longing)',
    balochiTitle: 'Zahirok e Saoth',
    region: 'eastern',
    category: 'saoth',
    description: 'A deeply melancholic vocal and Suroz melody expressing longing for distant loved ones, homeland pastures, or bygone eras.',
    details: [
      'Played on the Suroz (a four-stringed upright bowed lute with resonant strings).',
      'The microtonal glides mirror the vast quietude of desert winds.'
    ],
    createdAt: Date.now() - 86400000 * 10
  },
  {
    id: 'east-4',
    title: 'Traditional Sajji (Fire-Roasted Mutton)',
    balochiTitle: 'Balochi Sajji',
    region: 'eastern',
    category: 'recipes',
    description: 'Succulent whole leg or side of lamb skewers seasoned simply with rock salt and slow-roasted over fragrant wild logs.',
    details: [
      'Preparation: Skewer high-quality mutton or goat with wooden stakes.',
      'Cooking: Arrange stakes around an open fire ring filled with smoldering wild oak coals.',
      'Roast slowly for 2 to 3 hours until golden and crisp outside, cooked through inside.',
      'Served hot on traditional Naan with green chutney and fresh lemons.'
    ],
    mediaUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'east-5',
    title: 'Kapuk Motif Embroidery',
    balochiTitle: 'Kapuk e Duch',
    region: 'eastern',
    category: 'baloch_duch',
    description: 'Intricate needlework featuring small dove-like geometric motifs stitched with deep red and gold threads.',
    details: [
      'Technique: Counting thread warp and weft to craft tiny symmetrical diamond panels.',
      'Mirror accents (Aashtag) are integrated into the center of each geometric star.'
    ],
    patternMotifs: ['Geometric Dove', 'Diamond Grid', 'Gilded Border'],
    createdAt: Date.now() - 86400000 * 12
  },
  {
    id: 'east-jalar',
    title: 'Jalar Embroidery Border',
    balochiTitle: 'جالار',
    region: 'eastern',
    category: 'baloch_duch',
    description: 'Traditional Balochi embroidery border stitch (Jalar) featuring vibrant multi-colored vertical thread stripes woven meticulously along sleeve and dress edges.',
    mediaUrl: '/src/assets/images/embroidery_jalar_1785499548861.jpg',
    patternMotifs: ['Vertical Stripe Border', 'Multi-color Threadwork', 'Jalar Edge Stitch'],
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'east-6',
    title: 'Proverb on Land and Honor',
    balochiTitle: 'Zameen e waja, mard e ghairat',
    region: 'eastern',
    category: 'bathal',
    description: 'A classic Baloch saying emphasizing dignity and stewardship of one\'s homeland.',
    translation: 'The land is a person\'s dignity, and honor defines the human spirit.',
    createdAt: Date.now() - 86400000 * 8
  },

  // --- WESTERN REGION ---
  {
    id: 'west-1',
    title: 'Dosten & Shireen (Highland Love Tale)',
    balochiTitle: 'Dosten o Shireen e Kissa',
    region: 'western',
    category: 'kissa',
    description: 'A classic highland story of warrior Dosten who escaped captivity with the aid of his loyal steed to return to his betrothed Shireen.',
    details: [
      'Explores themes of resilience, horse-whispering, and keeping vows against overwhelming odds.',
      'Retold annually during highland spring gatherings in Nushki and Chaghi.'
    ],
    createdAt: Date.now() - 86400000 * 18
  },
  {
    id: 'west-2',
    title: 'Suroz Instrumental Solos',
    balochiTitle: 'Suroz e Naat',
    region: 'western',
    category: 'saoth',
    description: 'The Suroz is the soul instrument of Balochistan, bowed with horsehair to create evocative, bird-like harmonic resonances.',
    details: [
      'Master musicians sculpt the wooden soundbox from mulberry or wild olive wood.',
      'Features 3 main playing strings and 11-13 sympathetic metal resonance strings.'
    ],
    createdAt: Date.now() - 86400000 * 6
  },
  {
    id: 'west-3',
    title: 'Kaak (Stone Bread / Krch)',
    balochiTitle: 'Kaak e Roti',
    region: 'western',
    category: 'recipes',
    description: 'Thick leavened dough wrapped tightly around smooth heated river stones and baked directly over glowing coals.',
    details: [
      'Knead flour with milk, salt, cardamom, and a touch of clarified butter.',
      'Select smooth river pebbles and heat them inside open coals until white-hot.',
      'Wrap dough around hot stone and bake in ash coals until golden brown.',
      'Extremely durable food designed for highland nomads traversing long distances.'
    ],
    createdAt: Date.now() - 86400000 * 14
  },
  {
    id: 'west-4',
    title: 'Kantal Starburst Needlework',
    balochiTitle: 'Kantal Duch',
    region: 'western',
    category: 'baloch_duch',
    description: 'Highland geometric embroidery utilizing sharp angular starbursts and tiny circular glass mirrors.',
    patternMotifs: ['Eight-pointed Star', 'Terracotta Border', 'Silver Thread Highlight'],
    createdAt: Date.now() - 86400000 * 9
  },
  {
    id: 'west-sabzu',
    title: 'Sabzu Geometric Motif',
    balochiTitle: 'سبزو',
    region: 'western',
    category: 'baloch_duch',
    description: 'Classic Balochi geometric needlework motif (Sabzu) characterized by stepped triangular and diamond patterns in rich red, dark blue, and white thread tones.',
    mediaUrl: '/src/assets/images/embroidery_sabzu_1785499565991.jpg',
    patternMotifs: ['Stepped Triangle', 'Geometric Motif', 'Symmetrical Stitches'],
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'west-5',
    title: 'Proverb on Steadfast Word',
    balochiTitle: 'Musalman e qaul, chushin sang e pahr',
    region: 'western',
    category: 'bathal',
    description: 'Saying describing the sanctity of a promised word.',
    translation: 'A true word given by an honorable person is as permanent as a mountain rock.',
    createdAt: Date.now() - 86400000 * 3
  },

  // --- SOUTHERN REGION ---
  {
    id: 'south-1',
    title: 'Sea Chants of Makran Coast',
    balochiTitle: 'Makran e Daryaee Saoth',
    region: 'southern',
    category: 'saoth',
    description: 'Rhythmic chanting used by Gwadar fisherman when pulling nets or navigating Arabian sea tides.',
    details: [
      'Heavy polyrhythmic hand-clapping accompanied by Gwadar Dhol and Sorna oboe.',
      'Celebrates the bounty of the sea and protection under stormy skies.'
    ],
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'south-2',
    title: 'Khaddi Kabbab (Clay Pit Meat)',
    balochiTitle: 'Khaddi Kabbab',
    region: 'southern',
    category: 'recipes',
    description: 'Slow subterranean smoked meat cooked in sealed clay pits lined with palm fronds.',
    details: [
      'Dig an underground pit and line with red coals.',
      'Stuff marinated lamb with basmati rice, dry fruits, and aromatic spices.',
      'Seal the pit opening with stone slab and mud clay for 4-5 hours of smoke roasting.'
    ],
    createdAt: Date.now() - 86400000 * 11
  },
  {
    id: 'south-3',
    title: 'Pashk & Jup Intricate Dress',
    balochiTitle: 'Pashk o Jup',
    region: 'southern',
    category: 'baloch_duch',
    description: 'The iconic traditional long dress featuring a large front chest panel (Zih) and a deep pocket pouch (Jup).',
    details: [
      'Takes 3 to 6 months of meticulous hand-stitching to complete one chest piece.',
      'Colors range from vibrant terracottas and golds to deep ocean blues.'
    ],
    patternMotifs: ['Zih Chest Emblem', 'Jup Pocket Pocket Work', 'Sleeve Cuffs'],
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'south-paliwar',
    title: 'Paliwar Motif Block',
    balochiTitle: 'پلیوار',
    region: 'southern',
    category: 'baloch_duch',
    description: 'Historic Balochi embroidery motif block pattern (Paliwar) displaying intricate circular and cross geometric stamps used for hand-embroidery framing.',
    mediaUrl: '/src/assets/images/embroidery_paliwar_1785499585497.jpg',
    patternMotifs: ['Circular Emblem', 'Starburst Cross', 'Paliwar Motif Stamps'],
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'south-4',
    title: 'Legend of the Gwadar Pearl Diver',
    balochiTitle: 'Gwadar e Gohar e Kissa',
    region: 'southern',
    category: 'kissa',
    description: 'A coastal folk tale of courage where a young diver braved deep ocean waters to retrieve a rare pearl to save his village during drought.',
    createdAt: Date.now() - 86400000 * 16
  },
  {
    id: 'south-5',
    title: 'Proverb on Deep Friendship',
    balochiTitle: 'Mahr e dost, koh e burz',
    region: 'southern',
    category: 'bathal',
    description: 'A poetic coastal and oasis proverb about genuine friendship.',
    translation: 'True love for a cherished friend stands higher than the loftiest mountain peak.',
    createdAt: Date.now() - 86400000 * 2
  }
];

export const NETWORK_NODES: NetworkNode[] = [
  {
    id: 'core-1',
    label: 'Gulzameen',
    balochiName: 'Gulzameen Heritage Archive',
    category: 'core',
    description: 'The central repository of Balochistan heritage, unifying oral literature, music, cuisine, embroidery, and folk wisdom.',
    connections: ['node-kissa-1', 'node-saoth-1', 'node-duch-1', 'node-recipe-1', 'node-bathal-1'],
    iconName: 'Landmark',
    x: 50,
    y: 50
  },
  {
    id: 'node-kissa-1',
    label: 'Hani & Sheh Mureed Epic',
    balochiName: 'Hani o Sheh Mureed',
    category: 'kissa',
    description: 'Greatest 15th-century folk story celebrating devotion, chivalry, and tribal honor.',
    connections: ['core-1', 'node-saoth-1', 'node-bathal-1'],
    iconName: 'BookOpen',
    x: 25,
    y: 28
  },
  {
    id: 'node-saoth-1',
    label: 'Suroz & Zahirok Music',
    balochiName: 'Suroz o Zahirok',
    category: 'saoth',
    description: 'Microtonal bowed instrument tunes capturing longing and desert wind melodies.',
    connections: ['core-1', 'node-kissa-1', 'node-duch-1'],
    iconName: 'Music',
    x: 75,
    y: 25
  },
  {
    id: 'node-duch-1',
    label: 'Baloch Duch Embroidery',
    balochiName: 'Balochi Duch',
    category: 'baloch_duch',
    description: 'Geometric needlecraft with mirror work, representing family history and regional identity.',
    connections: ['core-1', 'node-saoth-1', 'node-recipe-1'],
    iconName: 'Sparkles',
    x: 80,
    y: 72
  },
  {
    id: 'node-recipe-1',
    label: 'Sajji & Kaak Culinary Arts',
    balochiName: 'Sajji o Kaak',
    category: 'recipes',
    description: 'Fire-roasted open pit meats and river stone baked bread from nomad traditions.',
    connections: ['core-1', 'node-duch-1', 'node-bathal-1'],
    iconName: 'Utensils',
    x: 22,
    y: 75
  },
  {
    id: 'node-bathal-1',
    label: 'Balochi Proverbs (Bathal)',
    balochiName: 'Balochi Bathal',
    category: 'bathal',
    description: 'Time-tested aphorisms and oral wisdom guiding tribal harmony and ethics.',
    connections: ['core-1', 'node-kissa-1', 'node-recipe-1'],
    iconName: 'Quote',
    x: 50,
    y: 88
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which iconic traditional Baloch instrument is an upright bowed lute made from mulberry wood with resonant strings?',
    options: ['Sitar', 'Suroz', 'Harmonium', 'Rubab'],
    correctAnswer: 1,
    explanation: 'The Suroz is the quintessential string instrument of Balochistan, bowed with horsehair to produce rich microtonal glides.'
  },
  {
    id: 2,
    question: 'What is the traditional Baloch stone-baked bread wrapped around heated river stones called?',
    options: ['Sajji', 'Kaak (Krch)', 'Puri', 'Naan-e-Tanoor'],
    correctAnswer: 1,
    explanation: 'Kaak (or Krch) is made by wrapping leavened dough around hot river stones and baking them directly in glowing embers.'
  },
  {
    id: 3,
    question: 'Which legendary 15th-century folk tale depicts the ultimate spiritual devotion of Sheh Mureed?',
    options: ['Heer Ranjha', 'Hani and Sheh Mureed', 'Sohni Mahiwal', 'Laila Majnu'],
    correctAnswer: 1,
    explanation: 'Hani and Sheh Mureed is the epic tale of chivalry, bowmanship, and selfless love in Balochi literature.'
  },
  {
    id: 4,
    question: 'In traditional Baloch embroidery (Baloch Duch), what is "Jup"?',
    options: ['A silver headpiece', 'A large deep pocket pouch in the tunic', 'A type of leather sandal', 'A wooden loom'],
    correctAnswer: 1,
    explanation: 'Jup is the distinctively large, deeply embroidered pocket pouch stitched into the lower panel of the traditional Pashk dress.'
  },
  {
    id: 5,
    question: 'What is "Zahirok" in Balochi music?',
    options: ['A fast festival dance rhythm', 'A melancholic song expressing deep longing and nostalgia', 'A wedding chant', 'A lullaby for children'],
    correctAnswer: 1,
    explanation: 'Zahirok is the soulful, expressive genre of Balochi music that captures longing for homeland, distant companions, and loved ones.'
  },
  {
    id: 6,
    question: 'What is the ancient subterranean irrigation system used across arid regions of Balochistan called?',
    options: ['Karez (Qanat)', 'Shaduf', 'Noria', 'Bawdi'],
    correctAnswer: 0,
    explanation: 'Karez is an ancient water management network of underground channels that carries groundwater from mountains without evaporation loss.'
  },
  {
    id: 7,
    question: 'Which iconic double-flute instrument consists of two joined reed pipes played simultaneously with continuous circular breathing?',
    options: ['Bansuri', 'Donali (Alghoza)', 'Shehnai', 'Pungi'],
    correctAnswer: 1,
    explanation: 'The Donali (or Alghoza) features two wooden reed flutes played together—one providing a continuous rhythmic drone and the other playing the melody.'
  },
  {
    id: 8,
    question: 'In Baloch tribal culture, what does the sacred code of conduct known as "Mayar" emphasize?',
    options: ['Trading & barter values', 'Asylum, protection, and sanctuary offered to anyone seeking refuge', 'Agricultural harvesting rules', 'Sea navigation laws'],
    correctAnswer: 1,
    explanation: 'Mayar is the ancient honor principle requiring a Baloch to protect and grant unconditional asylum to anyone who seeks shelter under their roof.'
  },
  {
    id: 9,
    question: 'Which archaeological site in Balochistan dates back to 7000 BCE, revealing early farming and dentistry in South Asia?',
    options: ['Mohenjo-daro', 'Mehrgarh', 'Harappa', 'Taxila'],
    correctAnswer: 1,
    explanation: 'Mehrgarh in Kacchi district is one of the oldest Neolithic archaeological settlements in South Asia, predating the Indus Valley Civilization.'
  },
  {
    id: 10,
    question: 'What is the traditional Baloch communal assembly or council where village elders gather to resolve disputes?',
    options: ['Jirga (Diwan)', 'Panchayat', 'Sabha', 'Majlis'],
    correctAnswer: 0,
    explanation: 'The Jirga (or traditional Diwan) brings tribal elders together under custom law (Riwaj) to arbitrate community issues peacefully.'
  },
  {
    id: 11,
    question: 'Which traditional Balochi dance is performed by men or women in a circle with synchronized clapping and footwork during celebrations?',
    options: ['Attan', 'Do-Chapi', 'Bhangra', 'Giddha'],
    correctAnswer: 1,
    explanation: 'Do-Chapi (meaning two-clap) is a rhythmic circle dance where dancers sway, clap, and step to the beat of the Dhol drum.'
  },
  {
    id: 12,
    question: 'What is "Chawat" in traditional Balochi attire?',
    options: ['Handcrafted leather sandals made by local artisans', 'A silk headscarf', 'A woolen winter cloak', 'A silver bangle'],
    correctAnswer: 0,
    explanation: 'Chawat are durable, handcrafted leather sandals traditional to Balochistan, designed to withstand rugged desert terrain.'
  },
  {
    id: 13,
    question: 'Which famous coastal port in Makran, Balochistan, sits along the Arabian Sea and serves as a historical maritime hub?',
    options: ['Gwadar', 'Karachi', 'Chabahar', 'Ormara'],
    correctAnswer: 0,
    explanation: 'Gwadar is a historic coastal deep-water port along the Arabian Sea, known for fishing heritage and ancient maritime trade routes.'
  },
  {
    id: 14,
    question: 'What is "Khadit" (or Landhi) in Balochi culinary tradition?',
    options: ['Salted and sun-dried meat prepared for harsh winter months', 'A sweet date pastry', 'Spiced tea brewed over charcoal', 'A fermented goat cheese'],
    correctAnswer: 0,
    explanation: 'Khadit (Landhi) is a traditional method of curing salted mutton or beef in cold mountain winds to preserve it for winter consumption.'
  },
  {
    id: 15,
    question: 'Which intricate embroidery motif in Baloch dress design is placed on the chest panel of the tunic?',
    options: ['Zih (Zup)', 'Gotta', 'Phulkari', 'Chikan'],
    correctAnswer: 0,
    explanation: 'The Zih is the elaborately stitched neck and chest panel that serves as the centerpiece of a handcrafted Balochi Pashk dress.'
  },
  {
    id: 16,
    question: 'What is the traditional Balochi long woolen cloak worn by men in cold mountain winters called?',
    options: ['Shal', 'Kosh', 'Kaba (Choga)', 'Patu'],
    correctAnswer: 2,
    explanation: 'The Kaba (or Choga) is a thick, hand-spun woolen cloak decorated with subtle embroidery, worn against harsh mountain cold.'
  },
  {
    id: 17,
    question: 'Which unique geological feature in Balochistan features active mud cones ejecting cold mud and minerals?',
    options: ['Hingol Mud Volcanoes', 'Thar Dunes', 'Kirthar Caves', 'Ziarat Valley'],
    correctAnswer: 0,
    explanation: 'The Hingol Mud Volcanoes (such as Chandragup) are famous geological formations in Hingol National Park along the Makran coast.'
  },
  {
    id: 18,
    question: 'What is the famous ancient juniper forest reserve located in northern Balochistan near Quetta?',
    options: ['Ziarat Juniper Forest', 'Changa Manga', 'Margalla Reserve', 'Deosai Plateau'],
    correctAnswer: 0,
    explanation: 'The Ziarat Juniper Forest is one of the oldest and largest natural juniper ecosystems in the world, with trees over 2,000 years old.'
  },
  {
    id: 19,
    question: 'What is "Mahl" or "Mehmandari" in Baloch cultural ethos?',
    options: ['Sacred hospitality towards guests', 'Camel racing', 'Carpet weaving', 'Archery practice'],
    correctAnswer: 0,
    explanation: 'Mehmandari (hospitality) is a foundational pillar of Baloch culture; guests are greeted with warm tea, dates, and generous feasts regardless of status.'
  },
  {
    id: 20,
    question: 'Which traditional stringed drone instrument with metal pegs often accompanies the Suroz in Balochi music ensembles?',
    options: ['Dambur (Tanbur)', 'Tabla', 'Flute', 'Santoor'],
    correctAnswer: 0,
    explanation: 'The Dambur (or Dambura) provides a hypnotic rhythmic drone that underpins traditional Balochi vocal ballads and instrumental solos.'
  }
];

export const WORD_SCRAMBLE_ITEMS: WordScrambleItem[] = [
  {
    id: 1,
    scrambled: 'ZSORU',
    word: 'SUROZ',
    hint: 'Master stringed instrument of Balochistan played with a bow.',
    meaning: 'Four-stringed upright lute considered the acoustic soul of Balochi music.'
  },
  {
    id: 2,
    scrambled: 'JISAI',
    word: 'SAJJI',
    hint: 'Famous fire-roasted mutton cooked over smoldering logs.',
    meaning: 'Traditional spit-roasted lamb seasoned with salt and embers.'
  },
  {
    id: 3,
    scrambled: 'SSIAK',
    word: 'KISSA',
    hint: 'Balochi word for folk story or epic tale.',
    meaning: 'Oral literature passed down through generations by balladeers.'
  },
  {
    id: 4,
    scrambled: 'KAHPS',
    word: 'PASHK',
    hint: 'Traditional long tunic worn with rich embroidery.',
    meaning: 'The elegant full-length dress featuring intricate chest panels (Zih).'
  },
  {
    id: 5,
    scrambled: 'LTHABA',
    word: 'BATHAL',
    hint: 'Traditional Balochi proverbs and folk aphorisms.',
    meaning: 'Proverbs conveying wisdom, honor, and community guidance.'
  },
  {
    id: 6,
    scrambled: 'ZERAK',
    word: 'KAREZ',
    hint: 'Ancient subterranean underground canal system for water.',
    meaning: 'Underground aqueduct channels delivering mountain water without evaporation.'
  },
  {
    id: 7,
    scrambled: 'ILADON',
    word: 'DONALI',
    hint: 'Traditional double reed flute played with circular breathing.',
    meaning: 'Twin wooden flutes that produce a melody and continuous drone simultaneously.'
  },
  {
    id: 8,
    scrambled: 'AAMRY',
    word: 'MAYAR',
    hint: 'Ethical code granting protection and sanctuary to guests.',
    meaning: 'Sacred Baloch tradition of protecting anyone seeking refuge.'
  },
  {
    id: 9,
    scrambled: 'RHAMGEHR',
    word: 'MEHRGARH',
    hint: 'Neolithic archaeological site dating back to 7000 BCE.',
    meaning: 'Ancient settlement revealing early farming and craft history in Balochistan.'
  },
  {
    id: 10,
    scrambled: 'RADWAG',
    word: 'GWADAR',
    hint: 'Historic coastal port town on the Arabian Sea.',
    meaning: 'Strategic maritime city known for fishing culture and ancient trade routes.'
  },
  {
    id: 11,
    scrambled: 'MRUBAD',
    word: 'DAMBUR',
    hint: 'Long-necked stringed drone instrument.',
    meaning: 'Rhythmic plucked instrument that accompanies Suroz and vocal performances.'
  },
  {
    id: 12,
    scrambled: 'TAWAHC',
    word: 'CHAWAT',
    hint: 'Handcrafted leather sandals made by traditional artisans.',
    meaning: 'Sturdy desert footwear crafted with genuine stitched leather.'
  },
  {
    id: 13,
    scrambled: 'ATRAIZ',
    word: 'ZIARAT',
    hint: 'Scenic valley home to 2,000-year-old ancient juniper trees.',
    meaning: 'High-altitude sanctuary renowned for pristine juniper forests and cool climate.'
  },
  {
    id: 14,
    scrambled: 'TIHDAK',
    word: 'KHADIT',
    hint: 'Salted, air-cured mutton preserved for winter seasons.',
    meaning: 'Traditional method of wind-drying seasoned meat in cold mountain villages.'
  },
  {
    id: 15,
    scrambled: 'LOGNIH',
    word: 'HINGOL',
    hint: 'National park famous for mud volcanoes and coastal rock formations.',
    meaning: 'Sprawling natural park along the Makran coast featuring active mud cones.'
  },
  {
    id: 16,
    scrambled: 'AGRIJ',
    word: 'JIRGA',
    hint: 'Communal council of elders assembled to resolve disputes.',
    meaning: 'Traditional judicial assembly upholding community peace and custom law.'
  },
  {
    id: 17,
    scrambled: 'IPAHC',
    word: 'CHAPI',
    hint: 'Rhythmic clapping step dance performed during folk festivals.',
    meaning: 'Synchronized group dance sways and claps performed in a circle.'
  },
  {
    id: 18,
    scrambled: 'LAHLA',
    word: 'HALAL',
    hint: 'Greeting ritual of sharing news and well-being with travelers.',
    meaning: 'Traditional news exchange etiquette when meeting friends or travelers.'
  },
  {
    id: 19,
    scrambled: 'NADIW',
    word: 'DIWAN',
    hint: 'Cultural gathering or assembly hall for poetry and oral recitation.',
    meaning: 'Traditional literary circle where poets and minstrels perform epics.'
  },
  {
    id: 20,
    scrambled: 'INARIM',
    word: 'MIRANI',
    hint: 'Historic dam and river valley reservoir in Dasht River basin.',
    meaning: 'Vast water reservoir supporting agriculture and ecology in southern Balochistan.'
  }
];
