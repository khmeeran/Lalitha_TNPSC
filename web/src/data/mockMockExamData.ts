// TNPSC Quest - Full Mock Examination Simulation Data
// Formatted into official Commission sections (General Studies, General Tamil, Aptitude)

import { MockExamSection, MockExamQuestionItem } from "../types/learning";

export const MOCK_EXAM_SECTIONS: MockExamSection[] = [
  {
    id: "sec_gs",
    titleTa: "Section A: General Studies",
    titleEn: "Section A: General Studies",
    questionCount: 15,
    marksPerQuestion: 1.5,
    negativeMarks: 0,
  },
  {
    id: "sec_tamil",
    titleTa: "Section B: General Tamil",
    titleEn: "Section B: General Tamil",
    questionCount: 10,
    marksPerQuestion: 1.5,
    negativeMarks: 0,
  },
  {
    id: "sec_aptitude",
    titleTa: "Section C: Aptitude & Mental Ability",
    titleEn: "Section C: Aptitude & Mental Ability",
    questionCount: 5,
    marksPerQuestion: 1.5,
    negativeMarks: 0,
  },
];

export const MOCK_EXAM_QUESTIONS: MockExamQuestionItem[] = [
  // SECTION A: GENERAL STUDIES (15 Questions)
  {
    index: 1,
    sectionId: "sec_gs",
    syllabusUnit: 4,
    subjectTitle: "Indian History & Culture",
    questionTa: "Where was the Great Bath of the Indus Valley Civilization discovered?",
    questionEn: "Where was the Great Bath of the Indus Valley Civilization discovered?",
    options: [
      { id: "A", textTa: "Harappa", textEn: "Harappa" },
      { id: "B", textTa: "Mohenjo-daro", textEn: "Mohenjo-daro" },
      { id: "C", textTa: "Lothal", textEn: "Lothal" },
      { id: "D", textTa: "Kalibangan", textEn: "Kalibangan" },
    ],
    correctOptionId: "B",
    explanationTa: "The Great Bath was unearthed at Mohenjo-daro, lined with bitumen and burnt brick masonry.",
    explanationEn: "The Great Bath was unearthed at Mohenjo-daro, lined with bitumen and burnt brick masonry.",
  },
  {
    index: 2,
    sectionId: "sec_gs",
    syllabusUnit: 4,
    subjectTitle: "Indian History & Culture",
    questionTa: "Who first deciphered the Ashokan Brahmi inscriptions in 1837?",
    questionEn: "Who first deciphered the Ashokan Brahmi inscriptions in 1837?",
    options: [
      { id: "A", textTa: "Sir William Jones", textEn: "Sir William Jones" },
      { id: "B", textTa: "James Prinsep", textEn: "James Prinsep" },
      { id: "C", textTa: "Alexander Cunningham", textEn: "Alexander Cunningham" },
      { id: "D", textTa: "Mortimer Wheeler", textEn: "Mortimer Wheeler" },
    ],
    correctOptionId: "B",
    explanationTa: "James Prinsep of the Asiatic Society deciphered the Brahmi script in 1837.",
    explanationEn: "James Prinsep of the Asiatic Society deciphered the Brahmi script in 1837.",
  },
  {
    index: 3,
    sectionId: "sec_gs",
    syllabusUnit: 5,
    subjectTitle: "Indian Polity",
    questionTa: "In which year was the 42nd Constitutional Amendment Act enacted?",
    questionEn: "In which year was the 42nd Constitutional Amendment Act enacted?",
    options: [
      { id: "A", textTa: "1975", textEn: "1975" },
      { id: "B", textTa: "1976", textEn: "1976" },
      { id: "C", textTa: "1978", textEn: "1978" },
      { id: "D", textTa: "1980", textEn: "1980" },
    ],
    correctOptionId: "B",
    explanationTa: "The 42nd Amendment of 1976 amended the Preamble and introduced Part IV-A (Fundamental Duties).",
    explanationEn: "The 42nd Amendment of 1976 amended the Preamble and introduced Part IV-A (Fundamental Duties).",
  },
  {
    index: 4,
    sectionId: "sec_gs",
    syllabusUnit: 5,
    subjectTitle: "Indian Polity",
    questionTa: "Which Article of the Indian Constitution declares the abolition of untouchability?",
    questionEn: "Which Article of the Indian Constitution declares the abolition of untouchability?",
    options: [
      { id: "A", textTa: "Article 15", textEn: "Article 15" },
      { id: "B", textTa: "Article 16", textEn: "Article 16" },
      { id: "C", textTa: "Article 17", textEn: "Article 17" },
      { id: "D", textTa: "Article 18", textEn: "Article 18" },
    ],
    correctOptionId: "C",
    explanationTa: "Article 17 abolishes untouchability and forbids its practice in any form.",
    explanationEn: "Article 17 abolishes untouchability and forbids its practice in any form.",
  },
  {
    index: 5,
    sectionId: "sec_gs",
    syllabusUnit: 8,
    subjectTitle: "Tamil Nadu History & Culture",
    questionTa: "Under whose kingdom was the Sangam site of Keeladi situated during the classical age?",
    questionEn: "Under whose kingdom was the Sangam site of Keeladi situated during the classical age?",
    options: [
      { id: "A", textTa: "Cheras", textEn: "Cheras" },
      { id: "B", textTa: "Pandyas", textEn: "Pandyas" },
      { id: "C", textTa: "Cholas", textEn: "Cholas" },
      { id: "D", textTa: "Pallavas", textEn: "Pallavas" },
    ],
    correctOptionId: "B",
    explanationTa: "Located in the Vaigai river basin near ancient Madurai, Keeladi was in the Pandyan heartland.",
    explanationEn: "Located in the Vaigai river basin near ancient Madurai, Keeladi was in the Pandyan heartland.",
  },
  {
    index: 6,
    sectionId: "sec_gs",
    syllabusUnit: 8,
    subjectTitle: "Tamil Nadu History & Culture",
    questionTa: "Who captained the women's regiment named 'Udayal' under Queen Velu Nachiyar?",
    questionEn: "Who captained the women's regiment named 'Udayal' under Queen Velu Nachiyar?",
    options: [
      { id: "A", textTa: "Kuyili", textEn: "Kuyili" },
      { id: "B", textTa: "Nachiyar", textEn: "Nachiyar" },
      { id: "C", textTa: "Jhansi Rani", textEn: "Jhansi Rani" },
      { id: "D", textTa: "Muthu Vaduganathar", textEn: "Muthu Vaduganathar" },
    ],
    correctOptionId: "A",
    explanationTa: "Kuyili led the women's brigade 'Udayal' and executed a suicide attack destroying the British arsenal.",
    explanationEn: "Kuyili led the women's brigade 'Udayal' and executed a suicide attack destroying the British arsenal.",
  },
  {
    index: 7,
    sectionId: "sec_gs",
    syllabusUnit: 7,
    subjectTitle: "Indian National Movement",
    questionTa: "Where did the historic mutiny on 10 July 1806 break out?",
    questionEn: "Where did the historic mutiny on 10 July 1806 break out?",
    options: [
      { id: "A", textTa: "Meerut", textEn: "Meerut" },
      { id: "B", textTa: "Vellore", textEn: "Vellore" },
      { id: "C", textTa: "Tiruchirappalli", textEn: "Tiruchirappalli" },
      { id: "D", textTa: "Palayamkottai", textEn: "Palayamkottai" },
    ],
    correctOptionId: "B",
    explanationTa: "The Vellore Mutiny occurred at Vellore Fort against Commander-in-Chief Cradock's regulations.",
    explanationEn: "The Vellore Mutiny occurred at Vellore Fort against Commander-in-Chief Cradock's regulations.",
  },
  {
    index: 8,
    sectionId: "sec_gs",
    syllabusUnit: 7,
    subjectTitle: "Indian National Movement",
    questionTa: "Who founded the Swadeshi Steam Navigation Company at Thoothukudi in 1906?",
    questionEn: "Who founded the Swadeshi Steam Navigation Company at Thoothukudi in 1906?",
    options: [
      { id: "A", textTa: "Subramania Siva", textEn: "Subramania Siva" },
      { id: "B", textTa: "V.O. Chidambaranar", textEn: "V.O. Chidambaranar" },
      { id: "C", textTa: "Subramania Bharati", textEn: "Subramania Bharati" },
      { id: "D", textTa: "Tiruppur Kumaran", textEn: "Tiruppur Kumaran" },
    ],
    correctOptionId: "B",
    explanationTa: "V.O. Chidambaram Pillai (Kappalottiya Thamizhan) purchased the S.S. Gallia and S.S. Lawo.",
    explanationEn: "V.O. Chidambaram Pillai (Kappalottiya Thamizhan) purchased the S.S. Gallia and S.S. Lawo.",
  },
  {
    index: 9,
    sectionId: "sec_gs",
    syllabusUnit: 6,
    subjectTitle: "Indian Economy",
    questionTa: "In which year was the Reserve Bank of India (RBI) established?",
    questionEn: "In which year was the Reserve Bank of India (RBI) established?",
    options: [
      { id: "A", textTa: "1935", textEn: "1935" },
      { id: "B", textTa: "1947", textEn: "1947" },
      { id: "C", textTa: "1949", textEn: "1949" },
      { id: "D", textTa: "1950", textEn: "1950" },
    ],
    correctOptionId: "A",
    explanationTa: "RBI was established on 1 April 1935 based on the Hilton Young Commission recommendations.",
    explanationEn: "RBI was established on 1 April 1935 based on the Hilton Young Commission recommendations.",
  },
  {
    index: 10,
    sectionId: "sec_gs",
    syllabusUnit: 6,
    subjectTitle: "Indian Economy",
    questionTa: "On which date was NITI Aayog established replacing the Planning Commission?",
    questionEn: "On which date was NITI Aayog established replacing the Planning Commission?",
    options: [
      { id: "A", textTa: "1 January 2014", textEn: "1 January 2014" },
      { id: "B", textTa: "1 January 2015", textEn: "1 January 2015" },
      { id: "C", textTa: "15 August 2015", textEn: "15 August 2015" },
      { id: "D", textTa: "1 July 2017", textEn: "1 July 2017" },
    ],
    correctOptionId: "B",
    explanationTa: "NITI Aayog came into existence on 1 January 2015 via Union Cabinet resolution.",
    explanationEn: "NITI Aayog came into existence on 1 January 2015 via Union Cabinet resolution.",
  },
  {
    index: 11,
    sectionId: "sec_gs",
    syllabusUnit: 3,
    subjectTitle: "Geography of India",
    questionTa: "Which is the highest mountain peak in Tamil Nadu?",
    questionEn: "Which is the highest mountain peak in Tamil Nadu?",
    options: [
      { id: "A", textTa: "Doddabetta", textEn: "Doddabetta" },
      { id: "B", textTa: "Anamudi", textEn: "Anamudi" },
      { id: "C", textTa: "Shervaroy Hills", textEn: "Shervaroy Hills" },
      { id: "D", textTa: "Mahendragiri", textEn: "Mahendragiri" },
    ],
    correctOptionId: "A",
    explanationTa: "Doddabetta (2,637 m) in Nilgiris is the highest peak in TN (Anamudi is in Kerala).",
    explanationEn: "Doddabetta (2,637 m) in Nilgiris is the highest peak in TN (Anamudi is in Kerala).",
  },
  {
    index: 12,
    sectionId: "sec_gs",
    syllabusUnit: 3,
    subjectTitle: "Geography of India",
    questionTa: "At which place does the River Cauvery enter the territory of Tamil Nadu?",
    questionEn: "At which place does the River Cauvery enter the territory of Tamil Nadu?",
    options: [
      { id: "A", textTa: "Mettur", textEn: "Mettur" },
      { id: "B", textTa: "Hogenakkal", textEn: "Hogenakkal" },
      { id: "C", textTa: "Bhavani", textEn: "Bhavani" },
      { id: "D", textTa: "Mayanur", textEn: "Mayanur" },
    ],
    correctOptionId: "B",
    explanationTa: "The Cauvery river enters Dharmapuri district of Tamil Nadu at Hogenakkal falls.",
    explanationEn: "The Cauvery river enters Dharmapuri district of Tamil Nadu at Hogenakkal falls.",
  },
  {
    index: 13,
    sectionId: "sec_gs",
    syllabusUnit: 1,
    subjectTitle: "General Science",
    questionTa: "What is the average lifespan of human Red Blood Cells (RBC)?",
    questionEn: "What is the average lifespan of human Red Blood Cells (RBC)?",
    options: [
      { id: "A", textTa: "60 days", textEn: "60 days" },
      { id: "B", textTa: "100 days", textEn: "100 days" },
      { id: "C", textTa: "120 days", textEn: "120 days" },
      { id: "D", textTa: "150 days", textEn: "150 days" },
    ],
    correctOptionId: "C",
    explanationTa: "The lifespan of human erythrocytes (RBC) is approximately 120 days.",
    explanationEn: "The lifespan of human erythrocytes (RBC) is approximately 120 days.",
  },
  {
    index: 14,
    sectionId: "sec_gs",
    syllabusUnit: 1,
    subjectTitle: "General Science",
    questionTa: "Which pancreatic hormone regulates glucose levels in human blood?",
    questionEn: "Which pancreatic hormone regulates glucose levels in human blood?",
    options: [
      { id: "A", textTa: "Insulin", textEn: "Insulin" },
      { id: "B", textTa: "Thyroxine", textEn: "Thyroxine" },
      { id: "C", textTa: "Adrenaline", textEn: "Adrenaline" },
      { id: "D", textTa: "Estrogen", textEn: "Estrogen" },
    ],
    correctOptionId: "A",
    explanationTa: "Insulin secreted by beta cells of Islets of Langerhans regulates glucose metabolism.",
    explanationEn: "Insulin secreted by beta cells of Islets of Langerhans regulates glucose metabolism.",
  },
  {
    index: 15,
    sectionId: "sec_gs",
    syllabusUnit: 9,
    subjectTitle: "Tamil Nadu Development Administration",
    questionTa: "Where is the headquarters of the Tamil Nadu State Election Commission situated?",
    questionEn: "Where is the headquarters of the Tamil Nadu State Election Commission situated?",
    options: [
      { id: "A", textTa: "Madurai", textEn: "Madurai" },
      { id: "B", textTa: "Chennai (Koyambedu)", textEn: "Chennai (Koyambedu)" },
      { id: "C", textTa: "Tiruchirappalli", textEn: "Tiruchirappalli" },
      { id: "D", textTa: "Coimbatore", textEn: "Coimbatore" },
    ],
    correctOptionId: "B",
    explanationTa: "The TN State Election Commission is located in Koyambedu, Chennai.",
    explanationEn: "The TN State Election Commission is located in Koyambedu, Chennai.",
  },

  // SECTION B: GENERAL TAMIL (10 Questions)
  {
    index: 16,
    sectionId: "sec_tamil",
    syllabusUnit: 8,
    subjectTitle: "General Tamil Literature & Heritage",
    questionTa: "What is the total count of chapters (Adhikarams) and couplets (Kurals) in Thirukkural?",
    questionEn: "What is the total count of chapters (Adhikarams) and couplets (Kurals) in Thirukkural?",
    options: [
      { id: "A", textTa: "130 chapters, 1300 kurals", textEn: "130 chapters, 1300 kurals" },
      { id: "B", textTa: "133 chapters, 1330 kurals", textEn: "133 chapters, 1330 kurals" },
      { id: "C", textTa: "135 chapters, 1350 kurals", textEn: "135 chapters, 1350 kurals" },
      { id: "D", textTa: "140 chapters, 1400 kurals", textEn: "140 chapters, 1400 kurals" },
    ],
    correctOptionId: "B",
    explanationTa: "Thirukkural comprises 3 Paals (Aram, Porul, Inbam), 133 Adhikarams, and 1,330 couplets.",
    explanationEn: "Thirukkural comprises 3 Paals (Aram, Porul, Inbam), 133 Adhikarams, and 1,330 couplets.",
  },
  {
    index: 17,
    sectionId: "sec_tamil",
    syllabusUnit: 8,
    subjectTitle: "General Tamil Literature & Heritage",
    questionTa: "In the first Kural 'Agara mudhala...', which figure of speech is employed?",
    questionEn: "In the first Kural 'Agara mudhala...', which figure of speech is employed?",
    options: [
      { id: "A", textTa: "Eduthukkaattu Uvamaiyini", textEn: "Eduthukkaattu Uvamaiyini" },
      { id: "B", textTa: "Vaetrumaiyini", textEn: "Vaetrumaiyini" },
      { id: "C", textTa: "Solporul Pinvaru Nilaiyini", textEn: "Solporul Pinvaru Nilaiyini" },
      { id: "D", textTa: "Pirithu Mozhithalani", textEn: "Pirithu Mozhithalani" },
    ],
    correctOptionId: "A",
    explanationTa: "Since the comparative particle is implicit, it is an example of Eduthukkaattu Uvamaiyini.",
    explanationEn: "Since the comparative particle is implicit, it is an example of Eduthukkaattu Uvamaiyini.",
  },
  {
    index: 18,
    sectionId: "sec_tamil",
    syllabusUnit: 8,
    subjectTitle: "General Tamil Literature & Heritage",
    questionTa: "Which Tamil scholar is celebrated with the title 'Thamizh Thendral'?",
    questionEn: "Which Tamil scholar is celebrated with the title 'Thamizh Thendral'?",
    options: [
      { id: "A", textTa: "Thiru. V. Kalyanasundaranar", textEn: "Thiru. V. Kalyanasundaranar" },
      { id: "B", textTa: "U. Ve. Swaminatha Iyer", textEn: "U. Ve. Swaminatha Iyer" },
      { id: "C", textTa: "Maraimalai Adigal", textEn: "Maraimalai Adigal" },
      { id: "D", textTa: "Bharathidasan", textEn: "Bharathidasan" },
    ],
    correctOptionId: "A",
    explanationTa: "Thiru. V. Kalyanasundaranar (Thiru.Vi.Ka) was fondly styled as 'Thamizh Thendral'.",
    explanationEn: "Thiru. V. Kalyanasundaranar (Thiru.Vi.Ka) was fondly styled as 'Thamizh Thendral'.",
  },
  {
    index: 19,
    sectionId: "sec_tamil",
    syllabusUnit: 8,
    subjectTitle: "General Tamil Literature & Heritage",
    questionTa: "Who authored the monumental Tamil epic Silappathikaram?",
    questionEn: "Who authored the monumental Tamil epic Silappathikaram?",
    options: [
      { id: "A", textTa: "Seethalai Saathanar", textEn: "Seethalai Saathanar" },
      { id: "B", textTa: "Ilango Adigal", textEn: "Ilango Adigal" },
      { id: "C", textTa: "Thiruthakkadevar", textEn: "Thiruthakkadevar" },
      { id: "D", textTa: "Kambar", textEn: "Kambar" },
    ],
    correctOptionId: "B",
    explanationTa: "Ilango Adigal, the ascetic brother of Cheran Senguttuvan, composed Silappathikaram.",
    explanationEn: "Ilango Adigal, the ascetic brother of Cheran Senguttuvan, composed Silappathikaram.",
  },
  {
    index: 20,
    sectionId: "sec_tamil",
    syllabusUnit: 8,
    subjectTitle: "General Tamil Literature & Heritage",
    questionTa: "Which epic among the Five Great Epics (Aimberum Kaappiyangal) belongs to Buddhist philosophy?",
    questionEn: "Which epic among the Five Great Epics (Aimberum Kaappiyangal) belongs to Buddhist philosophy?",
    options: [
      { id: "A", textTa: "Civaka Cintamani", textEn: "Civaka Cintamani" },
      { id: "B", textTa: "Manimekalai", textEn: "Manimekalai" },
      { id: "C", textTa: "Valayapathi", textEn: "Valayapathi" },
      { id: "D", textTa: "Kundalakesi", textEn: "Kundalakesi" },
    ],
    correctOptionId: "B",
    explanationTa: "Manimekalai authored by Seethalai Saathanar expounds Theravada Buddhist ethics.",
    explanationEn: "Manimekalai authored by Seethalai Saathanar expounds Theravada Buddhist ethics.",
  },

  // SECTION C: APTITUDE & MENTAL ABILITY (5 Questions)
  {
    index: 21,
    sectionId: "sec_aptitude",
    syllabusUnit: 10,
    subjectTitle: "Aptitude & Mental Ability",
    questionTa: "If the simple interest on a sum at 10% per annum for 2 years is ₹500, what is the principal sum?",
    questionEn: "If the simple interest on a sum at 10% per annum for 2 years is ₹500, what is the principal sum?",
    options: [
      { id: "A", textTa: "₹2,000", textEn: "₹2,000" },
      { id: "B", textTa: "₹2,500", textEn: "₹2,500" },
      { id: "C", textTa: "₹3,000", textEn: "₹3,000" },
      { id: "D", textTa: "₹5,000", textEn: "₹5,000" },
    ],
    correctOptionId: "B",
    explanationTa: "Principal P = (SI × 100) / (N × R) = (500 × 100) / (2 × 10) = ₹2,500.",
    explanationEn: "Principal P = (SI × 100) / (N × R) = (500 × 100) / (2 × 10) = ₹2,500.",
  },
  {
    index: 22,
    sectionId: "sec_aptitude",
    syllabusUnit: 10,
    subjectTitle: "Aptitude & Mental Ability",
    questionTa: "A and B can do a piece of work in 10 and 15 days respectively. In how many days can both complete it working together?",
    questionEn: "A and B can do a piece of work in 10 and 15 days respectively. In how many days can both complete it working together?",
    options: [
      { id: "A", textTa: "5 days", textEn: "5 days" },
      { id: "B", textTa: "6 days", textEn: "6 days" },
      { id: "C", textTa: "8 days", textEn: "8 days" },
      { id: "D", textTa: "12 days", textEn: "12 days" },
    ],
    correctOptionId: "B",
    explanationTa: "Combined days = (A × B) / (A + B) = (10 × 15) / (25) = 6 days.",
    explanationEn: "Combined days = (A × B) / (A + B) = (10 × 15) / (25) = 6 days.",
  },
  {
    index: 23,
    sectionId: "sec_aptitude",
    syllabusUnit: 10,
    subjectTitle: "Aptitude & Mental Ability",
    questionTa: "What is the next number in the geometric series: 4, 8, 16, 32, ...?",
    questionEn: "What is the next number in the geometric series: 4, 8, 16, 32, ...?",
    options: [
      { id: "A", textTa: "48", textEn: "48" },
      { id: "B", textTa: "64", textEn: "64" },
      { id: "C", textTa: "56", textEn: "56" },
      { id: "D", textTa: "72", textEn: "72" },
    ],
    correctOptionId: "B",
    explanationTa: "Each term is multiplied by common ratio 2. 32 × 2 = 64.",
    explanationEn: "Each term is multiplied by common ratio 2. 32 × 2 = 64.",
  },
  {
    index: 24,
    sectionId: "sec_aptitude",
    syllabusUnit: 10,
    subjectTitle: "Aptitude & Mental Ability",
    questionTa: "The ratio of boys to girls in a class is 4 : 5. If the total strength is 45, what is the number of girls?",
    questionEn: "The ratio of boys to girls in a class is 4 : 5. If the total strength is 45, what is the number of girls?",
    options: [
      { id: "A", textTa: "20", textEn: "20" },
      { id: "B", textTa: "25", textEn: "25" },
      { id: "C", textTa: "30", textEn: "30" },
      { id: "D", textTa: "15", textEn: "15" },
    ],
    correctOptionId: "B",
    explanationTa: "Total ratio parts = 4 + 5 = 9. Value of 1 part = 45 / 9 = 5. Girls = 5 × 5 = 25.",
    explanationEn: "Total ratio parts = 4 + 5 = 9. Value of 1 part = 45 / 9 = 5. Girls = 5 × 5 = 25.",
  },
  {
    index: 25,
    sectionId: "sec_aptitude",
    syllabusUnit: 10,
    subjectTitle: "Aptitude & Mental Ability",
    questionTa: "What is the area of a square whose side measures 10 cm?",
    questionEn: "What is the area of a square whose side measures 10 cm?",
    options: [
      { id: "A", textTa: "40 sq.cm", textEn: "40 sq.cm" },
      { id: "B", textTa: "100 sq.cm", textEn: "100 sq.cm" },
      { id: "C", textTa: "20 sq.cm", textEn: "20 sq.cm" },
      { id: "D", textTa: "50 sq.cm", textEn: "50 sq.cm" },
    ],
    correctOptionId: "B",
    explanationTa: "Area of square = side × side = 10 × 10 = 100 sq.cm.",
    explanationEn: "Area of square = side × side = 10 × 10 = 100 sq.cm.",
  },
];

export function calculateExamScorecard(
  userAnswers: Record<number, string>,
  timeSpentSeconds: number
) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const sectionalPerformance: Record<string, { correct: number; total: number; marks: number }> = {
    sec_gs: { correct: 0, total: 15, marks: 0 },
    sec_tamil: { correct: 0, total: 10, marks: 0 },
    sec_aptitude: { correct: 0, total: 5, marks: 0 },
  };

  MOCK_EXAM_QUESTIONS.forEach((q) => {
    const ans = userAnswers[q.index];
    if (!ans) {
      unansweredCount++;
    } else if (ans === q.correctOptionId) {
      correctCount++;
      if (sectionalPerformance[q.sectionId]) {
        sectionalPerformance[q.sectionId].correct++;
        sectionalPerformance[q.sectionId].marks += 1.5;
      }
    } else {
      incorrectCount++;
    }
  });

  const totalMarksEarned = correctCount * 1.5;
  const maxMarks = MOCK_EXAM_QUESTIONS.length * 1.5;
  const percentage = Math.round((totalMarksEarned / maxMarks) * 100);
  const percentileRank = Math.min(99, Math.round(50 + percentage * 0.49));

  return {
    totalQuestions: MOCK_EXAM_QUESTIONS.length,
    attemptedCount: correctCount + incorrectCount,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalMarksEarned,
    maxMarks,
    percentage,
    percentileRank,
    sectionalPerformance,
    timeSpentMinutes: Math.round(timeSpentSeconds / 60),
    velanFinalAssessmentTa:
      percentage >= 80
        ? "Tremendous achievement Lalitha! You demonstrated top-tier qualifications to excel in the Commission exams!"
        : "Great effort! A few more rounds of targeted revision in General Studies will guarantee top ranks!",
    velanFinalAssessmentEn:
      percentage >= 80
        ? "Outstanding scholarly performance! You have attained Commission honor standard!"
        : "Commendable effort! Focus further on Section A and Section C to secure top rank!",
  };
}
