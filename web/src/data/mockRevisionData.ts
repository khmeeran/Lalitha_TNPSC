// TNPSC Quest - Master Spaced Repetition (SM-2) Flashcard Repository
// 10-Card Daily Limit Policy Compliant with Verified Provenance

import { FlashcardItem } from "../types/learning";

const today = "2026-11-23";
const yesterday = "2026-11-22";
const twoDaysAgo = "2026-11-21";

export const MOCK_FLASHCARDS: FlashcardItem[] = [
  // 1. Ashoka's Edicts (Overdue, high priority)
  {
    id: "card_ashoka_1",
    nodeId: "node_hist_3",
    realmId: "realm_4_ancient",
    frontTa: "Which Ashokan edict explicitly records the Kalinga War remorse and Dhamma Vijaya?",
    frontEn: "Which Ashokan edict explicitly records the Kalinga War remorse and Dhamma Vijaya?",
    backTa: "Major Rock Edict XIII. Also mentions Chola, Pandya, and Chera kingdoms.",
    backEn: "Major Rock Edict XIII. Also mentions Chola, Pandya, and Chera kingdoms.",
    keyFactsTa: ["Prakrit Language in Brahmi Script", "261 BCE Kalinga War", "Longest Major Rock Edict"],
    keyFactsEn: ["Prakrit Language in Brahmi Script", "261 BCE Kalinga War", "Longest Major Rock Edict"],
    mnemonicTa: "Code: 2 & 13 for Tamil Kings in Ashoka's Edicts!",
    mnemonicEn: "Code: 2 & 13 for Tamil Kings in Ashoka's Edicts!",
    provenance: "TNPSC Group 4 2022 • Q142",
    easeFactor: 2.1,
    intervalDays: 1,
    repetitions: 1,
    dueDate: yesterday, // Overdue by 1 day
    isOverdue: true,
  },

  // 2. Keeladi Dating (Fragile card, EF < 1.8)
  {
    id: "card_keeladi_1",
    nodeId: "node_tamil_1",
    realmId: "realm_8_heritage",
    frontTa: "According to Beta Analytic Carbon-14 dating, what is the antiquity of Keeladi?",
    frontEn: "According to Beta Analytic Carbon-14 dating, what is the antiquity of Keeladi?",
    backTa: "6th Century BCE (approx 580 BCE). Situated in Vaigai basin, Sivagangai district.",
    backEn: "6th Century BCE (approx 580 BCE). Situated in Vaigai basin, Sivagangai district.",
    keyFactsTa: ["Tamil-Brahmi graffiti on potsherds", "Brick drains and ring wells", "Roman Arretine ware"],
    keyFactsEn: ["Tamil-Brahmi graffiti on potsherds", "Brick drains and ring wells", "Roman Arretine ware"],
    mnemonicTa: "Vaigai Basin • Sivagangai Soil • 580 BCE Tamizhi!",
    mnemonicEn: "Vaigai Basin • Sivagangai Soil • 580 BCE Tamizhi!",
    provenance: "TNPSC Group 1 2024 • Q74",
    easeFactor: 1.7, // Fragile
    intervalDays: 2,
    repetitions: 2,
    dueDate: today,
    isOverdue: false,
  },

  // 3. Constitution 42nd Amendment
  {
    id: "card_polity_1",
    nodeId: "node_polity_1",
    realmId: "realm_5_constitution",
    frontTa: "Which three words were inserted into the Preamble by the 42nd Amendment Act (1976)?",
    frontEn: "Which three words were inserted into the Preamble by the 42nd Amendment Act (1976)?",
    backTa: "Socialist, Secular, and Integrity.",
    backEn: "Socialist, Secular, and Integrity.",
    keyFactsTa: ["Known as the Mini-Constitution", "Preamble amended only once in history"],
    keyFactsEn: ["Known as the Mini-Constitution", "Preamble amended only once in history"],
    mnemonicTa: "SSI: Socialist, Secular, Integrity!",
    mnemonicEn: "SSI: Socialist, Secular, Integrity!",
    provenance: "TNPSC Group 4 2024 • Q108",
    easeFactor: 2.5,
    intervalDays: 4,
    repetitions: 2,
    dueDate: today,
    isOverdue: false,
  },

  // 4. Uttiramerur Inscription
  {
    id: "card_chola_1",
    nodeId: "node_hist_6",
    realmId: "realm_4_ancient",
    frontTa: "Which inscription provides details of the Kudavolai system and village administration?",
    frontEn: "Which inscription provides details of the Kudavolai system and village administration?",
    backTa: "Uttiramerur Inscription in Kanchipuram (Parantaka Chola I, 919 & 921 CE).",
    backEn: "Uttiramerur Inscription in Kanchipuram (Parantaka Chola I, 919 & 921 CE).",
    keyFactsTa: ["Age qualification 35 to 70 years", "Must own taxable land and house", "Variyam committee system"],
    keyFactsEn: ["Age qualification 35 to 70 years", "Must own taxable land and house", "Variyam committee system"],
    mnemonicTa: "Parantaka • Uttiramerur • Kudavolai!",
    mnemonicEn: "Parantaka • Uttiramerur • Kudavolai!",
    provenance: "TNPSC Group 2 2022 • Q118",
    easeFactor: 2.3,
    intervalDays: 6,
    repetitions: 3,
    dueDate: today,
    isOverdue: false,
  },

  // 5. Article 32 Heart & Soul
  {
    id: "card_polity_2",
    nodeId: "node_polity_1",
    realmId: "realm_5_constitution",
    frontTa: "Which Article did Dr. Ambedkar describe as the 'Heart and Soul of the Constitution'?",
    frontEn: "Which Article did Dr. Ambedkar describe as the 'Heart and Soul of the Constitution'?",
    backTa: "Article 32 (Right to Constitutional Remedies via 5 Writs).",
    backEn: "Article 32 (Right to Constitutional Remedies via 5 Writs).",
    keyFactsTa: ["Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari", "Article 226 for High Courts"],
    keyFactsEn: ["Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari", "Article 226 for High Courts"],
    provenance: "TNPSC Group 4 2022 • Q95",
    easeFactor: 2.6,
    intervalDays: 8,
    repetitions: 3,
    dueDate: today,
    isOverdue: false,
  },

  // 6. Vellore Mutiny 1806
  {
    id: "card_freedom_1",
    nodeId: "node_freedom_1",
    realmId: "realm_7_freedom",
    frontTa: "On which exact date did the 1806 Vellore Mutiny break out, preceding 1857?",
    frontEn: "On which exact date did the 1806 Vellore Mutiny break out, preceding 1857?",
    backTa: "10 July 1806. Sparked by Commander-in-Chief John Cradock's dress regulations and turban ban.",
    backEn: "10 July 1806. Sparked by Commander-in-Chief John Cradock's dress regulations and turban ban.",
    keyFactsTa: ["1st and 23rd Regiments mutinied", "Tipu's tiger flag hoisted on fort", "Colonel Gillespie brutally suppressed it"],
    keyFactsEn: ["1st and 23rd Regiments mutinied", "Tipu's tiger flag hoisted on fort", "Colonel Gillespie brutally suppressed it"],
    mnemonicTa: "July 10, 1806: The First Spark at Vellore!",
    mnemonicEn: "July 10, 1806: The First Spark at Vellore!",
    provenance: "TNPSC Group 1 2022 • Q112",
    easeFactor: 2.2,
    intervalDays: 3,
    repetitions: 2,
    dueDate: today,
    isOverdue: false,
  },

  // 7. Thirukkural Unit 8
  {
    id: "card_tamil_2",
    nodeId: "node_tamil_3",
    realmId: "realm_8_heritage",
    frontTa: "In the Thirukkural couplet 'Thuppaarkku thuppaaya...', which poetic figure of speech (Ani) is used?",
    frontEn: "In the Thirukkural couplet 'Thuppaarkku thuppaaya...', which poetic figure of speech (Ani) is used?",
    backTa: "Sol Pinvaru Nilaiyini (The word 'Thuppu' repeats with varying meanings: food, creating, rain).",
    backEn: "Sol Pinvaru Nilaiyini (The word 'Thuppu' repeats with varying meanings: food, creating, rain).",
    keyFactsTa: ["Vaan Chirappu (Chapter 2)", "Thuppu means food, protection, and goodness"],
    keyFactsEn: ["Vaan Chirappu (Chapter 2)", "Thuppu means food, protection, and goodness"],
    provenance: "TNPSC Group 4 2024 • General Tamil Q3",
    easeFactor: 2.0,
    intervalDays: 5,
    repetitions: 2,
    dueDate: today,
    isOverdue: false,
  },

  // 8. Self-Respect Movement 1925
  {
    id: "card_tamil_3",
    nodeId: "node_tamil_5",
    realmId: "realm_8_heritage",
    frontTa: "In which year did Thanthai Periyar launch the Self-Respect Movement?",
    frontEn: "In which year did Thanthai Periyar launch the Self-Respect Movement?",
    backTa: "1925. Founded after resigning from Congress over communal representation at Kanchipuram.",
    backEn: "1925. Founded after resigning from Congress over communal representation at Kanchipuram.",
    keyFactsTa: ["Kudi Arasu journal started in 1925", "Self-respect marriages legalized later in 1967", "Caste abolition & women liberation"],
    keyFactsEn: ["Kudi Arasu journal started in 1925", "Self-respect marriages legalized later in 1967", "Caste abolition & women liberation"],
    provenance: "TNPSC Group 2 2024 • Unit 8 Q65",
    easeFactor: 2.4,
    intervalDays: 7,
    repetitions: 3,
    dueDate: today,
    isOverdue: false,
  },

  // 9. GST Council Article 279A
  {
    id: "card_econ_1",
    nodeId: "node_econ_1",
    realmId: "realm_6_economy",
    frontTa: "Which Constitutional Article empowers the constitution of the Goods and Services Tax (GST) Council?",
    frontEn: "Which Constitutional Article empowers the constitution of the Goods and Services Tax (GST) Council?",
    backTa: "Article 279A (Inserted by 101st Constitutional Amendment Act 2016).",
    backEn: "Article 279A (Inserted by 101st Constitutional Amendment Act 2016).",
    keyFactsTa: ["Chairperson: Union Finance Minister", "State finance ministers are members", "Voting: Union 1/3 weight, States 2/3 weight"],
    keyFactsEn: ["Chairperson: Union Finance Minister", "State finance ministers are members", "Voting: Union 1/3 weight, States 2/3 weight"],
    provenance: "TNPSC Group 1 2024 • GS Q98",
    easeFactor: 2.3,
    intervalDays: 4,
    repetitions: 2,
    dueDate: today,
    isOverdue: false,
  },

  // 10. Nilgiri Biosphere Reserve 1986
  {
    id: "card_geo_1",
    nodeId: "node_geo_1",
    realmId: "realm_3_geography",
    frontTa: "In which year was India's first biosphere reserve, the Nilgiri Biosphere Reserve, established?",
    frontEn: "In which year was India's first biosphere reserve, the Nilgiri Biosphere Reserve, established?",
    backTa: "1986. Spans across Tamil Nadu, Kerala, and Karnataka; UNESCO MAB reserve.",
    backEn: "1986. Spans across Tamil Nadu, Kerala, and Karnataka; UNESCO MAB reserve.",
    keyFactsTa: ["Encompasses Mudumalai, Mukurthi, and Silent Valley", "Endangered Nilgiri Tahr is flagship species"],
    keyFactsEn: ["Encompasses Mudumalai, Mukurthi, and Silent Valley", "Endangered Nilgiri Tahr is flagship species"],
    provenance: "TNPSC Group 4 2022 • Geography Q110",
    easeFactor: 2.5,
    intervalDays: 6,
    repetitions: 3,
    dueDate: today,
    isOverdue: false,
  },
];
