import { TopicItem } from "@/types";

export const ALL_TOPICS: TopicItem[] = [
  // ==========================================
  // CLASS 3 TOPICS
  // ==========================================
  {
    id: "class-3-math-multiplication",
    slug: "multiplication-basics",
    title: "Multiplication (गुणा)",
    hindiTitle: "गुणा (बार-बार जोड़ना)",
    classId: "class-3",
    subjectId: "mathematics",
    chapterNumber: 4,
    description: "Learn multiplication as repeated addition, master times tables up to 10, and solve real-world word problems.",
    notes: {
      available: true,
      readTime: "8 min read",
      overview: "Multiplication is one of the four foundational operations in arithmetic. It represents a quick and easy way to add the same number multiple times (बार-बार जोड़ने की सरल प्रक्रिया).",
      sections: [
        {
          id: "intro",
          heading: "What is Multiplication? (गुणा क्या है?)",
          hindiHeading: "गुणा की परिभाषा",
          content: "When equal groups of things are combined together, we use multiplication instead of adding repeatedly. The sign for multiplication is '×'.",
          definitions: [
            {
              term: "Multiplicand (गुण्य)",
              definition: "The number that is being multiplied (जिस संख्या को गुणा किया जाता है)।",
            },
            {
              term: "Multiplier (गुणक)",
              definition: "The number by which we multiply (वह संख्या जिससे गुणा किया जाता है)।",
            },
            {
              term: "Product (गुणनफल)",
              definition: "The final answer obtained after multiplication (गुणा करने पर प्राप्त उत्तर)।",
            },
          ],
          callout: {
            type: "important",
            title: "Golden Rule of Zero",
            text: "Any number multiplied by 0 always equals 0 (e.g., 5 × 0 = 0). Any number multiplied by 1 stays the same (e.g., 9 × 1 = 9).",
          },
        },
        {
          id: "repeated-addition",
          heading: "Multiplication as Repeated Addition",
          hindiHeading: "बार-बार जोड़ के रूप में गुणा",
          content: "Look at this visual breakdown to understand how repeated addition turns into multiplication:",
          examples: [
            {
              title: "Example 1: Apple Baskets",
              explanation: "If there are 4 baskets and each basket contains 3 apples:\n3 + 3 + 3 + 3 = 12 apples.\nIn multiplication: 4 groups of 3 = 4 × 3 = 12 apples.",
            },
            {
              title: "Example 2: Wheels on Bicycles",
              explanation: "5 bicycles, each having 2 wheels:\n2 + 2 + 2 + 2 + 2 = 10 wheels.\nIn multiplication: 5 × 2 = 10 wheels.",
            },
          ],
          table: {
            caption: "Repeated Addition vs Multiplication Form",
            headers: ["Addition Form", "Groups Form", "Multiplication Expression", "Product"],
            rows: [
              ["4 + 4 + 4", "3 groups of 4", "3 × 4", "12"],
              ["5 + 5 + 5 + 5", "4 groups of 5", "4 × 5", "20"],
              ["6 + 6", "2 groups of 6", "2 × 6", "12"],
              ["7 + 7 + 7", "3 groups of 7", "3 × 7", "21"],
            ],
          },
        },
        {
          id: "properties",
          heading: "Key Properties of Multiplication",
          hindiHeading: "गुणा के प्रमुख गुण",
          content: "Remember these rules whenever calculating products in everyday mental math:",
          bulletPoints: [
            "Order Property: Changing the order of numbers does not change the product (4 × 5 = 5 × 4 = 20).",
            "Identity Property: Multiplying any number by 1 gives the same number (18 × 1 = 18).",
            "Zero Property: Multiplying any number by zero gives 0 (25 × 0 = 0).",
            "Ten Multiplier: To multiply by 10, simply add one zero to the end of the number (7 × 10 = 70).",
          ],
        },
      ],
    },
    video: {
      available: true,
      title: "Class 3 Maths: Multiplication as Repeated Addition (Hindi & English)",
      youtubeId: "vBqOqT8t1kI",
      duration: "14:20",
      channel: "Digital School Mathematics",
      thumbnailUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80",
      description: "Interactive visual lesson showing multiplication models using counters, blocks, and real-life scenarios for young learners.",
    },
    worksheet: {
      available: true,
      title: "Class 3 Mathematics: Multiplication Practice Sheet 1",
      fileUrl: "/worksheets/class3-math-multiplication.pdf",
      fileName: "class3-math-multiplication.pdf",
      questionsCount: 15,
      totalMarks: 25,
      difficulty: "Easy",
      instructions: [
        "Read each word problem carefully before writing the multiplication sentence.",
        "Write the answer with correct units (e.g., apples, rupees, wheels).",
        "Time limit: 30 minutes.",
      ],
      sampleQuestions: [
        "1. Convert 4 + 4 + 4 + 4 + 4 into a multiplication sentence and calculate the product.",
        "2. A box contains 6 pencils. How many pencils are there in 8 such boxes?",
        "3. Find the missing number: 7 × ___ = 42.",
        "4. Rahul saves ₹10 every day. How much money does he save in 9 days?",
      ],
    },
    book: {
      available: true,
      title: "NCERT Math-Magic Class 3 — Chapter 4: How Many Times?",
      hindiTitle: "गणित का जादू — पाठ 4: कितने गुना?",
      publisher: "NCERT",
      edition: "2026-27 Revised Edition",
      chapterNumber: 4,
      pages: 18,
      fileUrl: "/books/ncert-class3-math-ch4.pdf",
      fileName: "ncert-class3-math-ch4.pdf",
      coverColor: "#059669",
    },
  },

  {
    id: "class-3-evs-plant-parts",
    slug: "parts-of-a-plant",
    title: "Parts of a Plant (पौधों के भाग)",
    hindiTitle: "पौधों के विभिन्न भाग एवं उनके कार्य",
    classId: "class-3",
    subjectId: "environmental-studies",
    chapterNumber: 2,
    description: "Explore the root, stem, leaf, flower, and fruit systems of plants and how they help plants grow and survive.",
    notes: {
      available: true,
      readTime: "7 min read",
      overview: "Just like humans have different body parts, plants also have various organs that perform specialized jobs to keep them alive, nourished, and healthy.",
      sections: [
        {
          id: "plant-structure",
          heading: "The Two Main Systems of a Plant",
          hindiHeading: "पौधे के दो मुख्य तंत्र",
          content: "A plant's body is divided into two primary systems: the Root System (underground) and the Shoot System (above ground).",
          definitions: [
            {
              term: "Root System (जड़ तंत्र)",
              definition: "The underground part that anchors the plant and absorbs water and mineral salts from the soil.",
            },
            {
              term: "Shoot System (प्ररोह तंत्र)",
              definition: "The part of the plant above the ground consisting of stem, branches, leaves, buds, flowers, and fruits.",
            },
          ],
        },
        {
          id: "functions",
          heading: "Functions of Different Plant Parts",
          hindiHeading: "पौधे के भागों के कार्य",
          content: "Every part plays a vital role in the plant's life cycle:",
          bulletPoints: [
            "Roots (जड़ें): Hold the plant firmly in the soil; absorb water and essential nutrients.",
            "Stem (तना): Acts as the backbone; transports water from roots to leaves and food from leaves to all parts.",
            "Leaves (पत्तियां): Known as the 'Kitchen of the Plant'; make food using sunlight, water, and air (Photosynthesis).",
            "Flowers (फूल): The most attractive part; helps the plant produce seeds for reproduction.",
            "Fruits (फल): Protect the seeds inside them; store food.",
          ],
          table: {
            caption: "Edible Plant Parts We Eat Everyday",
            headers: ["Plant Part", "Hindi Name", "Examples We Eat"],
            rows: [
              ["Roots", "जड़", "Carrot (गाजर), Radish (मूली), Beetroot (चुकंदर)"],
              ["Stem", "तना", "Potato (आलू), Ginger (अदरक), Sugarcane (गन्ना)"],
              ["Leaves", "पत्ती", "Spinach (पालक), Cabbage (पत्तागोभी), Mint (पुदीना)"],
              ["Seeds", "बीज", "Peas (मटर), Wheat (गेहूं), Rice (चावल)"],
            ],
          },
        },
      ],
    },
    video: {
      available: true,
      title: "Class 3 EVS: Parts of a Plant & Their Functions Animated Lesson",
      youtubeId: "TD60-3G_GK8",
      duration: "11:45",
      channel: "Digital School Science",
      thumbnailUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80",
      description: "Visual animated journey through root hairs, xylem stems, chloroplast leaves, and blooming flowers.",
    },
    worksheet: {
      available: true,
      title: "Class 3 EVS: Plant Anatomy & Functions Worksheet",
      fileUrl: "/worksheets/class3-evs-plant-parts.pdf",
      fileName: "class3-evs-plant-parts.pdf",
      questionsCount: 12,
      totalMarks: 20,
      difficulty: "Easy",
      instructions: ["Draw and label the parts of a plant neatly.", "Match each edible plant part with its correct vegetable."],
      sampleQuestions: [
        "1. Why are leaves called the kitchen or food factory of a plant?",
        "2. Name any two roots that we eat as food.",
        "3. Which part of the plant absorbs water from the soil?",
      ],
    },
    book: {
      available: true,
      title: "NCERT Looking Around Class 3 — Chapter 2: The Plant Fairy",
      hindiTitle: "आस-पास कक्षा ३ — पाठ २: पौधों की परी",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 2,
      pages: 14,
      fileUrl: "/books/ncert-class3-evs-ch2.pdf",
      fileName: "ncert-class3-evs-ch2.pdf",
      coverColor: "#16a34a",
    },
  },

  // ==========================================
  // CLASS 4 TOPICS
  // ==========================================
  {
    id: "class-4-math-time",
    slug: "time-and-calendar",
    title: "Time and Clock (समय और घड़ी)",
    hindiTitle: "समय: टिक-टिक करती घड़ी एवं कैलेंडर",
    classId: "class-4",
    subjectId: "mathematics",
    chapterNumber: 4,
    description: "Understand 12-hour and 24-hour clocks, calculate elapsed time, read train timetables, and master calendar days.",
    notes: {
      available: true,
      readTime: "9 min read",
      overview: "Time management and reading time accurately is an indispensable life skill. In this topic, we study clock hands, 12-hour vs 24-hour clock formats, and AM/PM conventions.",
      sections: [
        {
          id: "clock-reading",
          heading: "Reading the Clock Face",
          hindiHeading: "घड़ी देखना सीखना",
          content: "A standard clock dial is divided into 12 major intervals with numbers from 1 to 12. Each interval between numbers represents 5 minutes.",
          bulletPoints: [
            "Hour hand (छोटी सुई): Takes 12 hours to complete one full round.",
            "Minute hand (बड़ी सुई): Takes 60 minutes (1 hour) to complete one full round.",
            "Seconds hand (तेज चलने वाली पतली सुई): Takes 60 seconds (1 minute) to complete one full round.",
            "1 hour = 60 minutes | 1 minute = 60 seconds.",
          ],
        },
        {
          id: "am-pm",
          heading: "AM and PM Convention",
          hindiHeading: "ए.एम. (AM) और पी.एम. (PM)",
          content: "A day has 24 hours. The clock face has only 12 numbers, so the hour hand goes round the clock twice a day.",
          definitions: [
            {
              term: "a.m. (Ante Meridiem)",
              definition: "From 12:00 midnight to 11:59 in the morning (रात 12 बजे से दोपहर 12 बजे से पहले तक)।",
            },
            {
              term: "p.m. (Post Meridiem)",
              definition: "From 12:00 noon to 11:59 at night (दोपहर 12 बजे से रात 12 बजे से पहले तक)।",
            },
          ],
          table: {
            caption: "12-Hour Clock vs 24-Hour Railway Time",
            headers: ["Time in Words", "12-Hour Format", "24-Hour Railway Format"],
            rows: [
              ["Morning 6 o'clock", "06:00 AM", "06:00 Hours"],
              ["Noon 12 o'clock", "12:00 PM", "12:00 Hours"],
              ["Afternoon 3 o'clock", "03:00 PM", "15:00 Hours"],
              ["Night 8:30", "08:30 PM", "20:30 Hours"],
              ["Midnight 12 o'clock", "12:00 AM", "00:00 or 24:00 Hours"],
            ],
          },
        },
      ],
    },
    video: {
      available: true,
      title: "Class 4 Maths: Tick-Tick-Tick Time and 24-Hour Clock",
      youtubeId: "J2p5rS8Q9Ww",
      duration: "16:10",
      channel: "Digital School Mathematics",
      thumbnailUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
      description: "Master railway time, conversion between AM/PM, and solving word problems on travel duration.",
    },
    worksheet: {
      available: true,
      title: "Class 4 Maths: Time Calculations & Elapsed Duration",
      fileUrl: "/worksheets/class4-math-time.pdf",
      fileName: "class4-math-time.pdf",
      questionsCount: 15,
      totalMarks: 25,
      difficulty: "Medium",
      sampleQuestions: [
        "1. Convert 19:45 hours into 12-hour format with AM/PM.",
        "2. A movie started at 03:15 PM and ended at 05:45 PM. What was the duration of the movie?",
        "3. Draw clock hands showing quarter past eight.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Math-Magic Class 4 — Chapter 4: Tick-Tick-Tick",
      hindiTitle: "गणित का जादू कक्षा ४ — पाठ ४: टिक-टिक-टिक",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 4,
      pages: 16,
      fileUrl: "/books/ncert-class4-math-ch4.pdf",
      fileName: "ncert-class4-math-ch4.pdf",
      coverColor: "#059669",
    },
  },

  // ==========================================
  // CLASS 5 TOPICS
  // ==========================================
  {
    id: "class-5-math-fractions",
    slug: "fractions-and-parts",
    title: "Fractions (भिन्न)",
    hindiTitle: "भिन्न (हिस्से और पूरे)",
    classId: "class-5",
    subjectId: "mathematics",
    chapterNumber: 4,
    description: "Understand numerator and denominator, proper and improper fractions, equivalent fractions, and visual representations.",
    notes: {
      available: true,
      readTime: "10 min read",
      overview: "A fraction represents a part of a whole quantity (पूर्ण का एक भाग). When an object or collection is divided into equal parts, each part is expressed as a fraction.",
      sections: [
        {
          id: "fraction-components",
          heading: "Parts of a Fraction (भिन्न के भाग)",
          hindiHeading: "अंश और हर की समझ",
          content: "Every fraction is written in the form of a/b, where 'a' is on top and 'b' is below the horizontal dividing bar.",
          definitions: [
            {
              term: "Numerator (अंश)",
              definition: "The top number that indicates how many equal parts have been selected or considered.",
            },
            {
              term: "Denominator (हर)",
              definition: "The bottom number that shows the total number of equal parts into which the whole is divided. Denominator can never be 0.",
            },
          ],
          callout: {
            type: "tip",
            title: "Memory Tip",
            text: "'D' for Denominator, 'D' for Down! The denominator always sits at the bottom.",
          },
        },
        {
          id: "fraction-types",
          heading: "Types of Fractions (भिन्नों के प्रकार)",
          hindiHeading: "उचित, अनुचित एवं मिश्रित भिन्न",
          content: "Fractions are classified based on the relationship between their numerator and denominator:",
          table: {
            caption: "Classification of Fractions with Examples",
            headers: ["Type of Fraction", "Condition", "Explanation", "Examples"],
            rows: [
              ["Proper Fraction (उचित भिन्न)", "Numerator < Denominator", "Value is always less than 1", "1/2, 3/4, 5/8"],
              ["Improper Fraction (अनुचित भिन्न)", "Numerator ≥ Denominator", "Value is equal to or greater than 1", "7/4, 5/3, 9/2"],
              ["Mixed Fraction (मिश्र भिन्न)", "Whole Number + Proper Fraction", "Combination of whole and part", "1 ¾, 2 ½, 3 ⅖"],
              ["Unit Fraction (इकाई भिन्न)", "Numerator is 1", "Single part of a whole", "1/3, 1/5, 1/10"],
              ["Equivalent Fractions (तुल्य भिन्न)", "Represent identical value", "Formed by multiplying/dividing num and den by same number", "1/2 = 2/4 = 4/8"],
            ],
          },
        },
        {
          id: "equivalent-fractions",
          heading: "Finding Equivalent Fractions",
          hindiHeading: "समतुल्य भिन्न ज्ञात करने की विधि",
          content: "To find equivalent fractions, multiply or divide both the numerator and denominator by the exact same non-zero number:",
          examples: [
            {
              title: "Example 1: Multiplying",
              explanation: "For 2/3:\n(2 × 2) / (3 × 2) = 4/6\n(2 × 3) / (3 × 3) = 6/9\nTherefore, 2/3, 4/6, and 6/9 are equivalent fractions.",
            },
            {
              title: "Example 2: Simplifying / Dividing",
              explanation: "For 12/16:\n(12 ÷ 4) / (16 ÷ 4) = 3/4 (Simplest form).",
            },
          ],
        },
      ],
    },
    video: {
      available: true,
      title: "Class 5 Maths: Parts and Wholes — Fractions Explained Simply",
      youtubeId: "CA9ZX03JyVU",
      duration: "18:30",
      channel: "Digital School Mathematics",
      thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
      description: "Visual pizza and chocolate bar demonstrations to master fractions, proper/improper types, and equivalent fractions.",
    },
    worksheet: {
      available: true,
      title: "Class 5 Mathematics: Fractions Comprehensive Practice Sheet",
      fileUrl: "/worksheets/class5-math-fractions.pdf",
      fileName: "class5-math-fractions.pdf",
      questionsCount: 18,
      totalMarks: 30,
      difficulty: "Medium",
      instructions: ["Show working steps for conversions.", "Reduce final answers to simplest terms."],
      sampleQuestions: [
        "1. Write three equivalent fractions for 3/5.",
        "2. Convert the improper fraction 17/4 into a mixed fraction.",
        "3. Out of 24 students in a class, 3/4 love mathematics. How many students love mathematics?",
        "4. Which is greater: 2/3 or 3/5? Show by cross-multiplication or common denominator.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Math-Magic Class 5 — Chapter 4: Parts and Wholes",
      hindiTitle: "गणित का जादू कक्षा ५ — पाठ ४: हिस्से और पूरे",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 4,
      pages: 20,
      fileUrl: "/books/ncert-class5-math-ch4.pdf",
      fileName: "ncert-class5-math-ch4.pdf",
      coverColor: "#059669",
    },
  },

  {
    id: "class-5-evs-seeds",
    slug: "seeds-and-germination",
    title: "Seeds and Germination (बीज और अंकुरण)",
    hindiTitle: "बीज, बीज, बीज — अंकुरण एवं प्रकीर्णन",
    classId: "class-5",
    subjectId: "environmental-studies",
    chapterNumber: 5,
    description: "Understand seed dormancy, conditions needed for germination (water, air, warmth), and incredible seed dispersal methods.",
    notes: {
      available: true,
      readTime: "8 min read",
      overview: "Every giant tree begins as a tiny seed. Inside every seed lies a dormant baby plant (embryo) waiting for the right conditions to sprout and grow.",
      sections: [
        {
          id: "seed-parts",
          heading: "Anatomy of a Seed (बीज की आंतरिक संरचना)",
          hindiHeading: "बीज के मुख्य अंग",
          content: "Soak a chickpea (चना) or bean seed in water overnight to examine these distinct parts:",
          bulletPoints: [
            "Seed Coat (बीजचोल): The outer protective covering that safeguards the delicate embryo inside.",
            "Cotyledons (बीजपत्र): The seed leaves that store food for the baby plant until it grows true leaves and sunlight.",
            "Embryo (भ्रूण): The baby plant containing the radicle (future root) and plumule (future shoot).",
          ],
        },
        {
          id: "germination-conditions",
          heading: "Conditions for Germination",
          hindiHeading: "अंकुरण के लिए आवश्यक परिस्थितियां",
          content: "Seeds require three indispensable factors to germinate successfully:",
          definitions: [
            { term: "Water (जल)", definition: "Softens the seed coat and activates enzymes to digest stored starch." },
            { term: "Air / Oxygen (वायु)", definition: "Required for cellular respiration to generate energy for cell division." },
            { term: "Warmth (उचित तापमान)", definition: "Enzymes operate optimally at room temperature (neither freezing cold nor boiling hot)." },
          ],
          callout: {
            type: "important",
            title: "Crucial Fact",
            text: "Seeds do NOT require sunlight for germination underground! Sunlight is only required after green leaves emerge for photosynthesis.",
          },
        },
        {
          id: "dispersal",
          heading: "Seed Dispersal Agents (बीज प्रकीर्णन के साधन)",
          hindiHeading: "बीज एक जगह से दूसरी जगह कैसे पहुंचते हैं?",
          content: "If all seeds fell under the parent plant, they would compete for water, light, and minerals and die. Nature uses clever dispersal agents:",
          table: {
            caption: "Methods of Seed Dispersal in Nature",
            headers: ["Agent", "Adaptation / Feature", "Examples"],
            rows: [
              ["Wind (हवा द्वारा)", "Lightweight, winged, or hairy parachute seeds", "Dandelion (मदार), Maple, Cotton"],
              ["Water (जल द्वारा)", "Fibrous or spongy outer coat that floats", "Coconut (नारियल), Lotus (कमल)"],
              ["Animals & Birds (पशु-पक्षियों द्वारा)", "Hooks, spines, or delicious fleshy fruits with hard seeds", "Xanthium (गोखरू), Mango, Guava"],
              ["Explosion / Bursting (झटके से फटना)", "Pods dry and burst suddenly throwing seeds far", "Peas (मटर), Balsam, Ladyfinger"],
            ],
          },
        },
      ],
    },
    video: {
      available: true,
      title: "Class 5 EVS: Seeds, Seeds, Seeds & Sprouting Experiments",
      youtubeId: "Wn9m0aE8vKg",
      duration: "13:50",
      channel: "Digital School Science",
      thumbnailUrl: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
      description: "Time-lapse germination footage and real experiments with soaked vs dry chana seeds.",
    },
    worksheet: {
      available: true,
      title: "Class 5 EVS: Seeds Anatomy & Dispersal Worksheet",
      fileUrl: "/worksheets/class5-evs-seeds.pdf",
      fileName: "class5-evs-seeds.pdf",
      questionsCount: 14,
      totalMarks: 25,
      difficulty: "Medium",
      sampleQuestions: [
        "1. Why do seeds not sprout if they are kept submerged completely under boiled water with oil on top?",
        "2. Explain how Xanthium (गोखरू) seeds travel from one place to another.",
        "3. Which part of the seed stores food for the growing embryo?",
      ],
    },
    book: {
      available: true,
      title: "NCERT Looking Around Class 5 — Chapter 5: Seeds, Seeds, Seeds",
      hindiTitle: "आस-पास कक्षा ५ — पाठ ५: बीज, बीज, बीज",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 5,
      pages: 15,
      fileUrl: "/books/ncert-class5-evs-ch5.pdf",
      fileName: "ncert-class5-evs-ch5.pdf",
      coverColor: "#16a34a",
    },
  },

  // ==========================================
  // CLASS 6 TOPICS
  // ==========================================
  {
    id: "class-6-science-food-components",
    slug: "food-components",
    title: "Food Components (भोजन के घटक)",
    hindiTitle: "भोजन के घटक — पोषक तत्व एवं संतुलित आहार",
    classId: "class-6",
    subjectId: "science",
    chapterNumber: 1,
    description: "Carbohydrates, fats, proteins, vitamins, minerals, dietary fibers, balanced diet, and deficiency disease prevention.",
    notes: {
      available: true,
      readTime: "11 min read",
      overview: "Food provides our body with energy to perform daily work, repairs worn-out tissues, and protects us against illnesses. The chemical constituents of food needed by our body are called nutrients (पोषक तत्व).",
      sections: [
        {
          id: "nutrients-overview",
          heading: "Major Nutrients in Our Food",
          hindiHeading: "हमारे भोजन के मुख्य पोषक तत्व",
          content: "The major nutrients present in food are carbohydrates, proteins, fats, vitamins, and minerals. In addition, food contains dietary fibers (roughage) and water.",
          table: {
            caption: "Nutrients, Functions, and Dietary Sources",
            headers: ["Nutrient", "Primary Function", "Rich Dietary Sources"],
            rows: [
              ["Carbohydrates (कार्बोहाइड्रेट)", "Provide instant energy (ऊर्जा प्रदान करना)", "Rice, Wheat, Potato, Sugar, Banana"],
              ["Fats (वसा)", "Provide concentrated stored energy", "Butter, Ghee, Cooking Oils, Nuts, Cheese"],
              ["Proteins (प्रोटीन)", "Growth, muscle building, and tissue repair", "Milk, Pulses (दालें), Eggs, Paneer, Fish, Soybeans"],
              ["Vitamins (विटामिन)", "Immunity and protection against infections", "Fresh fruits, Green leafy vegetables, Milk, Carrots"],
              ["Minerals (खनिज लवण)", "Proper formation of bones, teeth, and blood", "Spinach (Iron), Milk (Calcium), Iodised Salt (Iodine)"],
              ["Dietary Fiber (रुक्षांश)", "Aids peristalsis and prevents constipation", "Whole grains, Pulses, Apples, Raw salads"],
            ],
          },
        },
        {
          id: "tests-for-nutrients",
          heading: "Laboratory Tests for Nutrients",
          hindiHeading: "पोषक तत्वों की रासायनिक जांच",
          content: "Simple chemical reagents allow us to test what nutrients are present in food samples:",
          definitions: [
            {
              term: "Starch Test (स्टार्च की जांच)",
              definition: "Add 2-3 drops of dilute Iodine solution to food paste. Appearance of a Blue-Black color confirms the presence of starch.",
            },
            {
              term: "Protein Test (प्रोटीन की जांच)",
              definition: "Add 10 drops of water + 2 drops of Copper Sulphate + 10 drops of Caustic Soda to mashed food. A Violet color indicates proteins.",
            },
            {
              term: "Fat Test (वसा की जांच)",
              definition: "Wrap food in clean paper and crush it. An oily translucent patch that lets light filter through confirms fats.",
            },
          ],
        },
        {
          id: "deficiency-diseases",
          heading: "Deficiency Diseases (अभावजन्य रोग)",
          hindiHeading: "पोषक तत्वों की कमी से होने वाले रोग",
          content: "Diseases that occur due to lack of nutrients over a prolonged period are called deficiency diseases:",
          bulletPoints: [
            "Vitamin A deficiency → Night blindness (रतौंधी): Poor vision, loss of vision in darkness.",
            "Vitamin B1 deficiency → Beriberi (बेरी-बेरी): Weak muscles and very little energy to work.",
            "Vitamin C deficiency → Scurvy (स्कर्वी): Bleeding gums, wounds take longer time to heal.",
            "Vitamin D / Calcium deficiency → Rickets (रिकेट्स): Bones become soft, fragile, and bent.",
            "Iodine deficiency → Goitre (घेंघा): Swollen gland in neck, mental disability in children.",
            "Iron deficiency → Anaemia (एनीमिया/रक्ताल्पता): Weakness, fatigue, pale skin.",
          ],
        },
      ],
    },
    video: {
      available: true,
      title: "Class 6 Science: Components of Food & Balanced Diet Explained",
      youtubeId: "Y8E_H6GvWQs",
      duration: "19:40",
      channel: "Digital School Science",
      thumbnailUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
      description: "Visual demonstrations of the Iodine test, Copper Sulphate test, and detailed nutritional food pyramids.",
    },
    worksheet: {
      available: true,
      title: "Class 6 Science: Food Components & Deficiency Diseases Worksheet",
      fileUrl: "/worksheets/class6-science-food-components.pdf",
      fileName: "class6-science-food-components.pdf",
      questionsCount: 20,
      totalMarks: 30,
      difficulty: "Medium",
      sampleQuestions: [
        "1. Why is roughage considered essential even though it provides no energy to our body?",
        "2. Name the vitamin produced by our body when exposed to morning sunlight.",
        "3. What reagent is used to detect the presence of starch in raw potato?",
        "4. Match the deficiency disease with its corresponding deficient nutrient.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Science Class 6 — Chapter 1: Components of Food",
      hindiTitle: "विज्ञान कक्षा ६ — पाठ १: भोजन के घटक",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 1,
      pages: 14,
      fileUrl: "/books/ncert-class6-science-ch1.pdf",
      fileName: "ncert-class6-science-ch1.pdf",
      coverColor: "#2563eb",
    },
  },

  {
    id: "class-6-science-separation",
    slug: "separation-of-substances",
    title: "Separation of Substances (पदार्थों का पृथक्करण)",
    hindiTitle: "पदार्थों का पृथक्करण — हस्तचयन, निष्पावन, निथारना एवं वाष्पन",
    classId: "class-6",
    subjectId: "science",
    chapterNumber: 3,
    description: "Handpicking, threshing, winnowing, sieving, sedimentation, decantation, filtration, and evaporation techniques.",
    notes: {
      available: true,
      readTime: "9 min read",
      overview: "In daily life, we constantly separate useful components from mixtures, or remove impurities from grain, water, and milk.",
      sections: [
        {
          id: "solid-solid",
          heading: "Methods for Separating Solid-Solid Mixtures",
          hindiHeading: "ठोस से ठोस का पृथक्करण",
          content: "Depending on differences in particle size, weight, and color:",
          definitions: [
            { term: "Handpicking (हस्तचयन)", definition: "Manually picking out slightly larger impurities like stones and husk from food grains." },
            { term: "Threshing (थ्रेशिंग)", definition: "Beating stalks of harvested crops against hard surfaces to free grain seeds." },
            { term: "Winnowing (निष्पावन)", definition: "Separating heavier grain components from lighter chaff using wind gusts." },
            { term: "Sieving (चालन)", definition: "Using fine mesh screens to separate particles of different sizes (e.g., flour from bran)." },
          ],
        },
        {
          id: "insoluble-liquids",
          heading: "Separating Insoluble Solids from Liquids",
          hindiHeading: "द्रव में अघुलनशील ठोस का पृथक्करण",
          content: "When sand or mud is mixed with water, three sequential physical processes clean the liquid:",
          bulletPoints: [
            "Sedimentation (अवसादन): Allowing the heavy particles to settle to the bottom undisturbed.",
            "Decantation (निथारना): Pouring off the clean upper liquid into another vessel without disturbing the settled sediment.",
            "Filtration (निस्पंदन / छानना): Passing the liquid mixture through a porous filter paper to catch fine suspended particles.",
          ],
        },
      ],
    },
    video: {
      available: true,
      title: "Class 6 Science: Separation of Substances Lab Experiments",
      youtubeId: "Jc0kI3k9_uY",
      duration: "15:15",
      channel: "Digital School Science",
      thumbnailUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
      description: "Laboratory demonstrations of winnowing, funnel filtration, and salt recovery by evaporation.",
    },
    worksheet: {
      available: true,
      title: "Class 6 Science: Separation Methods Practice Sheet",
      fileUrl: "/worksheets/class6-science-separation.pdf",
      fileName: "class6-science-separation.pdf",
      questionsCount: 15,
      totalMarks: 25,
      difficulty: "Medium",
      sampleQuestions: [
        "1. How would you obtain clear drinking water from a sample of muddy pond water?",
        "2. Which property difference is utilized in winnowing?",
        "3. Explain the difference between sedimentation and decantation.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Science Class 6 — Chapter 3: Separation of Substances",
      hindiTitle: "विज्ञान कक्षा ६ — पाठ ३: पदार्थों का पृथक्करण",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 3,
      pages: 13,
      fileUrl: "/books/ncert-class6-science-ch3.pdf",
      fileName: "ncert-class6-science-ch3.pdf",
      coverColor: "#2563eb",
    },
  },

  {
    id: "class-6-math-integers",
    slug: "integers",
    title: "Integers (पूर्णांक)",
    hindiTitle: "पूर्णांक — धनात्मक, ऋणात्मक एवं संख्या रेखा",
    classId: "class-6",
    subjectId: "mathematics",
    chapterNumber: 6,
    description: "Positive numbers, negative numbers, zero, number line representation, and addition/subtraction rules.",
    notes: {
      available: true,
      readTime: "9 min read",
      overview: "When we need to represent quantities below zero (such as freezing temperatures, debts, or submarine depths below sea level), natural numbers and whole numbers are not enough. We introduce negative numbers to form Integers.",
      sections: [
        {
          id: "integer-definition",
          heading: "The Set of Integers (पूर्णांकों का समुच्चय)",
          hindiHeading: "पूर्णांकों की परिभाषा",
          content: "The collection of positive numbers (+1, +2, +3...), zero (0), and negative numbers (-1, -2, -3...) together form the integers (Z).",
          definitions: [
            { term: "Positive Integers (धनात्मक पूर्णांक)", definition: "Numbers greater than zero (+1, +2, +3...)" },
            { term: "Negative Integers (ऋणात्मक पूर्णांक)", definition: "Numbers less than zero (-1, -2, -3...)" },
            { term: "Zero (शून्य)", definition: "Neither positive nor negative. It acts as the boundary origin on the number line." },
          ],
        },
        {
          id: "number-line",
          heading: "Integers on the Number Line",
          hindiHeading: "संख्या रेखा पर पूर्णांक",
          content: "On a horizontal number line:\n• Zero is placed at the center.\n• Moving to the right increases the value (addition).\n• Moving to the left decreases the value (subtraction).\n• Any number to the right of another number is always GREATER (e.g., -2 > -5, 0 > -10).",
          table: {
            caption: "Rules for Adding and Subtracting Integers",
            headers: ["Signs of Numbers", "Operation to Perform", "Sign of Final Result", "Example"],
            rows: [
              ["Both Positive (+, +)", "Add their absolute values", "Positive (+)", "(+4) + (+6) = +10"],
              ["Both Negative (-, -)", "Add their absolute values", "Negative (-)", "(-4) + (-6) = -10"],
              ["Opposite Signs (+, -)", "Subtract smaller from larger", "Sign of the number with greater absolute value", "(+9) + (-4) = +5"],
              ["Opposite Signs (-, +)", "Subtract smaller from larger", "Sign of the number with greater absolute value", "(-9) + (+4) = -5"],
            ],
          },
        },
      ],
    },
    // Note: Video is intentionally omitted for demonstration of dynamic availability!
    video: {
      available: false,
      title: "",
      youtubeId: "",
      duration: "",
      channel: "",
      thumbnailUrl: "",
    },
    worksheet: {
      available: true,
      title: "Class 6 Mathematics: Integers on Number Line & Operations",
      fileUrl: "/worksheets/class6-math-integers.pdf",
      fileName: "class6-math-integers.pdf",
      questionsCount: 16,
      totalMarks: 25,
      difficulty: "Medium",
      sampleQuestions: [
        "1. Write the opposite of: 'Loss of ₹700' and '326 BC'.",
        "2. Represent -6 on a number line.",
        "3. Evaluate: (-13) + (+18) + (-5).",
        "4. Fill with > or <: -25 ___ -15.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Mathematics Class 6 — Chapter 6: Integers",
      hindiTitle: "गणित कक्षा ६ — पाठ ६: पूर्णांक",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 6,
      pages: 18,
      fileUrl: "/books/ncert-class6-math-ch6.pdf",
      fileName: "ncert-class6-math-ch6.pdf",
      coverColor: "#059669",
    },
  },

  // ==========================================
  // CLASS 7 TOPICS
  // ==========================================
  {
    id: "class-7-science-digestive-system",
    slug: "human-digestive-system",
    title: "Human Digestive System (मानव पाचन तंत्र)",
    hindiTitle: "मानव पाचन तंत्र — आहारनाल, पाचक ग्रंथियां एवं पोषण",
    classId: "class-7",
    subjectId: "science",
    chapterNumber: 2,
    description: "Detailed journey of food through the alimentary canal: mouth, esophagus, stomach, small intestine, liver, pancreas, and large intestine.",
    notes: {
      available: true,
      readTime: "12 min read",
      overview: "Nutrition in animals is a complex holozoic process involving ingestion, digestion, absorption, assimilation, and egestion. The human digestive system consists of the alimentary canal and associated digestive glands.",
      sections: [
        {
          id: "five-steps",
          heading: "Five Stages of Holozoic Nutrition",
          hindiHeading: "पोषण के पांच मुख्य चरण",
          content: "Human nutrition occurs in five chronological stages:",
          numberedPoints: [
            "Ingestion (अंतर्ग्रहण): The process of taking food into the body through the mouth cavity.",
            "Digestion (पाचन): The breakdown of complex insoluble food substances into simple, soluble chemical forms.",
            "Absorption (अवशोषण): The passage of digested nutrients through the intestinal wall into the bloodstream.",
            "Assimilation (स्वांगीकरण): The utilization of absorbed nutrients by body cells for energy, growth, and tissue repair.",
            "Egestion (मलत्याग / निष्कासन): The elimination of undigested and unabsorbed food residues from the body through the anus.",
          ],
        },
        {
          id: "alimentary-canal",
          heading: "Organs of the Alimentary Canal (आहारनाल के अंग)",
          hindiHeading: "मुख से गुदा तक भोजन की यात्रा",
          content: "The continuous muscular tube stretching from mouth to anus is approximately 9 meters long in an adult:",
          table: {
            caption: "Digestive Organs, Secretions, and Digestive Actions",
            headers: ["Organ", "Secretions / Enzymes", "Primary Digestive Function"],
            rows: [
              ["Buccal Cavity (मुख गुहा)", "Saliva (Salivary Amylase / टायलिन)", "Teeth masticate food; Saliva breaks down starch into simple maltose sugar."],
              ["Esophagus (ग्रासनली)", "Mucus", "Peristaltic muscular contractions push food bolus downwards into the stomach."],
              ["Stomach (आमाशय)", "Gastric Juice (HCl + Pepsin + Mucus)", "HCl kills bacteria and activates acidic medium; Pepsin digests proteins into peptones."],
              ["Small Intestine (क्षुद्रांत्र)", "Bile + Pancreatic Juice + Intestinal Juice", "Complete digestion of fats, carbohydrates, and proteins; Villi absorb nutrients."],
              ["Large Intestine (बृहदांत्र)", "None", "Reabsorbs excess water and salts; stores semi-solid feces in rectum."],
            ],
          },
        },
        {
          id: "accessory-glands",
          heading: "The Secretory Glands: Liver & Pancreas",
          hindiHeading: "यकृत और अग्न्याशय का महत्व",
          content: "Two vital accessory organs pour juices directly into the duodenum of the small intestine:",
          definitions: [
            {
              term: "Liver (यकृत)",
              definition: "The largest gland in the human body. Secretes reddish-brown Bile Juice (पित्त रस) stored in the Gallbladder. Bile emulsifies large fat globules into tiny droplets.",
            },
            {
              term: "Pancreas (अग्न्याशय)",
              definition: "A cream-colored gland located beneath the stomach. Secretes Pancreatic juice containing Trypsin (proteins), Lipase (fats), and Amylase (carbohydrates).",
            },
            {
              term: "Villi (दीर्घरोम / रसांकुर)",
              definition: "Millions of microscopic finger-like projections on the inner wall of the small intestine that increase surface area for rapid absorption of nutrients into blood capillaries.",
            },
          ],
          callout: {
            type: "important",
            title: "Why Doesn't Stomach Acid Burn the Stomach?",
            text: "The inner lining of the stomach secretes a protective layer of thick Mucus (श्लेष्मा) that shields the delicate muscular wall from its own corrosive Hydrochloric Acid (pH 1.5–2.0).",
          },
        },
      ],
    },
    video: {
      available: true,
      title: "Class 7 Science: Human Digestive System 3D Animated Walkthrough",
      youtubeId: "b20VRR9C37Q",
      duration: "21:10",
      channel: "Digital School Biology",
      thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      description: "High-definition anatomical 3D animation tracing food from mastication in the mouth to peristalsis, stomach churning, bile emulsification, and villi absorption.",
    },
    worksheet: {
      available: true,
      title: "Class 7 Science: Human Digestive System Mastery Worksheet",
      fileUrl: "/worksheets/class7-science-digestive-system.pdf",
      fileName: "class7-science-digestive-system.pdf",
      questionsCount: 22,
      totalMarks: 35,
      difficulty: "Advanced",
      instructions: [
        "Draw a neat diagram of the human alimentary canal and label: Stomach, Liver, Gallbladder, Pancreas, Small Intestine.",
        "Answer all short-reasoning questions concisely.",
      ],
      sampleQuestions: [
        "1. Where is bile produced? Which component of the food does it help to digest?",
        "2. What are villi? What is their exact location and function in human nutrition?",
        "3. Name the type of carbohydrate that can be digested by ruminants (cows, goats) but not by humans. Give the reason.",
        "4. Why does a piece of plain roti or bread begin to taste sweet after being chewed for two minutes?",
      ],
    },
    book: {
      available: true,
      title: "NCERT Science Class 7 — Chapter 2: Nutrition in Animals",
      hindiTitle: "विज्ञान कक्षा ७ — पाठ २: प्राणियों में पोषण",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 2,
      pages: 18,
      fileUrl: "/books/ncert-class7-science-ch2.pdf",
      fileName: "ncert-class7-science-ch2.pdf",
      coverColor: "#2563eb",
    },
  },

  {
    id: "class-7-science-light",
    slug: "light-and-reflection",
    title: "Light & Reflection (प्रकाश एवं परावर्तन)",
    hindiTitle: "प्रकाश — परावर्तन, समतल एवं गोलीय दर्पण",
    classId: "class-7",
    subjectId: "science",
    chapterNumber: 15,
    description: "Rectilinear propagation of light, reflection by plane mirrors, concave & convex mirrors, lenses, and rainbow colors.",
    notes: {
      available: true,
      readTime: "10 min read",
      overview: "Light travels along straight lines. When light hits a polished or reflective surface like a mirror, its direction of travel changes. This bounce-back phenomenon is called reflection.",
      sections: [
        {
          id: "plane-mirror",
          heading: "Image Formed by a Plane Mirror",
          hindiHeading: "समतल दर्पण द्वारा बना प्रतिबिंब",
          content: "Characteristics of an image seen in your household bathroom mirror:",
          bulletPoints: [
            "The image is erect (सीधा) and of the exact same size as the object.",
            "The image is formed at the same distance behind the mirror as the object is in front of it.",
            "The image is virtual (आभासी) — it cannot be captured or projected onto a screen.",
            "Lateral Inversion (पार्श्व परिवर्तन): The left side of the object appears on the right side of the image, and vice-versa (which is why AMBULANCE is written inverted on emergency vehicles).",
          ],
        },
        {
          id: "spherical-mirrors",
          heading: "Spherical Mirrors: Concave vs Convex",
          hindiHeading: "गोलीय दर्पण: अवतल एवं उत्तल",
          content: "If the reflecting surface of a mirror is curved like the surface of a polished steel spoon:",
          table: {
            caption: "Comparison of Concave and Convex Mirrors",
            headers: ["Feature", "Concave Mirror (अवतल दर्पण)", "Convex Mirror (उत्तल दर्पण)"],
            rows: [
              ["Reflecting Surface", "Curved inwards (गुहा की तरह अंदर धंसा)", "Curved outwards (उभरा हुआ)"],
              ["Nature of Image", "Real and inverted (can form virtual magnified if very close)", "Always virtual, erect, and diminished (छोटा)"],
              ["Field of View", "Narrow, converges light rays to focus", "Wide field of view, diverges rays"],
              ["Common Uses", "Dentist inspection mirrors, car headlights, shaving mirrors", "Rear-view side mirrors of vehicles, street security mirrors"],
            ],
          },
        },
      ],
    },
    video: {
      available: true,
      title: "Class 7 Science: Light, Spherical Mirrors and Lenses Explained",
      youtubeId: "kGq6u8yP1v0",
      duration: "17:45",
      channel: "Digital School Physics",
      thumbnailUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      description: "Laser ray box demonstrations showing rectilinear light paths, focal points, and prism rainbow dispersion.",
    },
    worksheet: {
      available: true,
      title: "Class 7 Science: Light, Mirrors and Ray Optics Worksheet",
      fileUrl: "/worksheets/class7-science-light.pdf",
      fileName: "class7-science-light.pdf",
      questionsCount: 16,
      totalMarks: 25,
      difficulty: "Medium",
      sampleQuestions: [
        "1. Why is a convex mirror preferred as a rear-view mirror in automobiles?",
        "2. State two differences between a real image and a virtual image.",
        "3. Name the seven colors of white sunlight dispersed through a glass prism.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Science Class 7 — Chapter 15: Light",
      hindiTitle: "विज्ञान कक्षा ७ — पाठ १५: प्रकाश",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 15,
      pages: 16,
      fileUrl: "/books/ncert-class7-science-ch15.pdf",
      fileName: "ncert-class7-science-ch15.pdf",
      coverColor: "#2563eb",
    },
  },

  // ==========================================
  // CLASS 8 TOPICS
  // ==========================================
  {
    id: "class-8-science-cell-structure",
    slug: "cell-structure-and-functions",
    title: "Cell: Structure & Functions (कोशिका: संरचना एवं कार्य)",
    hindiTitle: "कोशिका — जीवन की मौलिक इकाई, कोशिकांग एवं तुलना",
    classId: "class-8",
    subjectId: "science",
    chapterNumber: 8,
    description: "Cell discovery, unicellular vs multicellular organisms, cell membrane, cytoplasm, nucleus, organelles, and plant vs animal cell comparison.",
    notes: {
      available: true,
      readTime: "12 min read",
      overview: "Just as bricks assemble to build a house, cells assemble to construct the body of every living organism on planet Earth. The cell is the fundamental structural and functional unit of life.",
      sections: [
        {
          id: "discovery",
          heading: "Discovery of the Cell",
          hindiHeading: "कोशिका की खोज का इतिहास",
          content: "In 1665, British scientist Robert Hooke observed thin slices of bottle cork under a primitive magnifying device. He noticed honey-comb like partition boxes and coined the term 'Cell' (Latin: little room). Antonie van Leeuwenhoek later observed living free cells in pond water.",
          callout: {
            type: "info",
            title: "Size Extremes",
            text: "Smallest cell: Mycoplasma / PPLO (0.1 to 0.5 micrometers). Largest single cell: The egg of an ostrich (approx. 170 mm × 130 mm). Longest human cell: Nerve cell / Neuron (up to 1 meter).",
          },
        },
        {
          id: "organelles",
          heading: "Major Cell Components & Organelles",
          hindiHeading: "कोशिका के प्रमुख अंगक",
          content: "Every eukaryotic cell consists of three fundamental regions:",
          definitions: [
            {
              term: "Cell Membrane / Plasma Membrane (कोशिका झिल्ली)",
              definition: "Porous, selectively permeable outer boundary that regulates the transport of substances into and out of the cell.",
            },
            {
              term: "Cytoplasm (कोशिका द्रव्य)",
              definition: "Jelly-like fluid matrix between the cell membrane and nucleus containing specialized cell organelles.",
            },
            {
              term: "Nucleus (केंद्रक)",
              definition: "The control master brain of the cell. Houses chromosomes carrying genetic genes (DNA) responsible for hereditary inheritance.",
            },
            {
              term: "Mitochondria (माइटोकॉन्ड्रिया)",
              definition: "The 'Powerhouse of the Cell' where cellular respiration takes place to generate ATP energy.",
            },
            {
              term: "Plastids / Chloroplasts (हरितलवक)",
              definition: "Pigment-containing organelles found strictly in plant cells. Chloroplasts contain chlorophyll for photosynthesis.",
            },
          ],
        },
        {
          id: "plant-vs-animal",
          heading: "Comparison: Plant Cell vs Animal Cell",
          hindiHeading: "पादप कोशिका एवं जंतु कोशिका में अंतर",
          content: "Key differences that allow plants to remain rigid, withstand wind pressure, and manufacture food:",
          table: {
            caption: "Differences Between Plant and Animal Cells",
            headers: ["Feature / Organelle", "Plant Cell (पादप कोशिका)", "Animal Cell (जंतु कोशिका)"],
            rows: [
              ["Cell Wall (कोशिका भित्ति)", "Present (Made of rigid cellulose outside membrane)", "Absent (Only flexible plasma membrane)"],
              ["Chloroplasts (हरितलवक)", "Present (For photosynthesis)", "Absent"],
              ["Vacuoles (रसधानियाँ)", "One large, central permanent vacuole", "Multiple small, temporary vacuoles"],
              ["Shape", "Fixed, angular, rectangular rigid shape", "Flexible, irregular or rounded shape"],
              ["Centrosome / Centrioles", "Usually absent in higher plants", "Present (Aids spindle formation in cell division)"],
            ],
          },
        },
      ],
    },
    video: {
      available: true,
      title: "Class 8 Science: Cell Structure and Functions Masterclass",
      youtubeId: "8IlzKri08kk",
      duration: "24:10",
      channel: "Digital School Biology",
      thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80",
      description: "Microscopic view of onion peel cells and human cheek epithelial cells, with full 3D breakdown of organelles.",
    },
    worksheet: {
      available: true,
      title: "Class 8 Science: Cell Anatomy & Organelles Comprehensive Worksheet",
      fileUrl: "/worksheets/class8-science-cell-structure.pdf",
      fileName: "class8-science-cell-structure.pdf",
      questionsCount: 20,
      totalMarks: 35,
      difficulty: "Advanced",
      sampleQuestions: [
        "1. Differentiate between prokaryotic and eukaryotic cells with examples.",
        "2. Which cell organelle is known as the powerhouse of the cell, and why?",
        "3. Explain why plant cells possess a cell wall in addition to the plasma membrane.",
        "4. Draw and label an animal cell highlighting the nucleus, cytoplasm, and cell membrane.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Science Class 8 — Chapter 8: Cell — Structure and Functions",
      hindiTitle: "विज्ञान कक्षा ८ — पाठ ८: कोशिका — संरचना एवं प्रकार्य",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 8,
      pages: 18,
      fileUrl: "/books/ncert-class8-science-ch8.pdf",
      fileName: "ncert-class8-science-ch8.pdf",
      coverColor: "#2563eb",
    },
  },

  {
    id: "class-8-science-force-pressure",
    slug: "force-and-pressure",
    title: "Force and Pressure (बल और दाब)",
    hindiTitle: "बल तथा दाब — संपर्क एवं असंपर्क बल, वायुमंडलीय दाब",
    classId: "class-8",
    subjectId: "science",
    chapterNumber: 11,
    description: "Definition of force (push or pull), contact vs non-contact forces, concept of pressure (Force/Area), liquid pressure, and atmospheric pressure.",
    notes: {
      available: true,
      readTime: "11 min read",
      overview: "Whenever an object is set in motion, brought to rest, accelerated, or deformed in shape, a force is acting upon it. Force arises due to an interaction between at least two objects.",
      sections: [
        {
          id: "force-basics",
          heading: "What is Force? (बल क्या है?)",
          hindiHeading: "बल की परिभाषा एवं प्रभाव",
          content: "A push or pull upon an object resulting from its interaction with another object is called Force. The SI unit of force is Newton (N).",
          bulletPoints: [
            "Force has both Magnitude and Direction (Vector quantity).",
            "If two forces act in the same direction, the net force is their sum (F_net = F1 + F2).",
            "If two forces act in opposite directions, the net force is their difference (F_net = |F1 - F2|).",
            "Force can change the state of motion (speed up, slow down, stop) or change the physical shape and dimension of an object.",
          ],
        },
        {
          id: "types-of-forces",
          heading: "Classification of Forces",
          hindiHeading: "संपर्क एवं असंपर्क बल",
          content: "Forces are categorized based on whether physical contact occurs:",
          definitions: [
            {
              term: "Contact Forces (संपर्क बल)",
              definition: "Forces that act only when objects are in physical contact: Muscular Force (मांसपेशीय बल) and Frictional Force (घर्षण बल).",
            },
            {
              term: "Non-Contact Forces (असंपर्क बल)",
              definition: "Forces that act across distance without physical contact: Gravitational Force (गुरुत्वाकर्षण बल), Magnetic Force (चुंबकीय बल), and Electrostatic Force (स्थिर वैद्युत बल).",
            },
          ],
        },
        {
          id: "pressure-concept",
          heading: "Concept of Pressure (दाब की संकल्पना)",
          hindiHeading: "दाब = बल / क्षेत्रफल",
          content: "The force acting perpendicular per unit area of a surface is defined as Pressure:\nPressure (P) = Force (F) / Area (A)\nSI Unit of pressure: Newton per square meter (N/m²), also named Pascal (Pa).",
          examples: [
            {
              title: "Why does a sharp knife cut better than a blunt knife?",
              explanation: "A sharp knife has an extremely small contact area edge. Since Pressure is inversely proportional to Area (P ∝ 1/A), applying a small force produces immense cutting pressure.",
            },
            {
              title: "Why do school bags have wide shoulder straps?",
              explanation: "Wide straps have a larger surface area (A). This distributes the weight of the books over a broader shoulder surface, reducing the pressure felt on the child's shoulders.",
            },
          ],
        },
      ],
    },
    video: {
      available: true,
      title: "Class 8 Science: Force and Pressure Laws & Everyday Demonstrations",
      youtubeId: "iO_8w0zK4gM",
      duration: "20:30",
      channel: "Digital School Physics",
      thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      description: "Atmospheric crushing can experiment, hydrostatic manometer tubes, and vector force balance demonstrations.",
    },
    worksheet: {
      available: true,
      title: "Class 8 Science: Force and Pressure Numerical Problems Worksheet",
      fileUrl: "/worksheets/class8-science-force-pressure.pdf",
      fileName: "class8-science-force-pressure.pdf",
      questionsCount: 18,
      totalMarks: 30,
      difficulty: "Advanced",
      sampleQuestions: [
        "1. Calculate the pressure exerted by a force of 300 N acting on an area of 0.05 m².",
        "2. Explain why dams have much thicker walls at the bottom than at the top.",
        "3. Name two non-contact forces and describe how they act without physical touching.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Science Class 8 — Chapter 11: Force and Pressure",
      hindiTitle: "विज्ञान कक्षा ८ — पाठ ११: बल तथा दाब",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 11,
      pages: 17,
      fileUrl: "/books/ncert-class8-science-ch11.pdf",
      fileName: "ncert-class8-science-ch11.pdf",
      coverColor: "#2563eb",
    },
  },

  {
    id: "class-8-math-rational-numbers",
    slug: "rational-numbers",
    title: "Rational Numbers (परिमेय संख्याएँ)",
    hindiTitle: "परिमेय संख्याएँ — गुणधर्म, संवृत, क्रमविनिमेय एवं वितरण नियम",
    classId: "class-8",
    subjectId: "mathematics",
    chapterNumber: 1,
    description: "Definition of rational numbers (p/q, q≠0), closure, commutativity, associativity, distributive property, additive inverse, and multiplicative inverse.",
    notes: {
      available: true,
      readTime: "10 min read",
      overview: "Any number that can be expressed in the form of p/q, where p and q are integers and q ≠ 0, is called a rational number (परिमेय संख्या). It encompasses natural numbers, whole numbers, integers, and fractions.",
      sections: [
        {
          id: "rational-definition",
          heading: "Definition and Identification",
          hindiHeading: "परिमेय संख्या की पहचान",
          content: "A rational number is any number expressible as p/q (q ≠ 0).",
          bulletPoints: [
            "Positive rational numbers: Both numerator and denominator have identical signs (e.g., 3/5, -7/-9).",
            "Negative rational numbers: Numerator and denominator have opposite signs (e.g., -4/7, 5/-8).",
            "Zero as a rational number: 0 = 0/1 = 0/5 (q ≠ 0 condition is satisfied, so 0 is rational).",
          ],
        },
        {
          id: "properties",
          heading: "Properties of Rational Numbers",
          hindiHeading: "परिमेय संख्याओं के बीजगणितीय गुणधर्म",
          content: "Four fundamental mathematical laws govern operations on rational numbers:",
          table: {
            caption: "Algebraic Laws for Rational Numbers",
            headers: ["Property", "Addition", "Multiplication", "Formula / Example"],
            rows: [
              ["Closure (संवृत)", "Yes (a + b is rational)", "Yes (a × b is rational)", "1/2 + 3/4 = 5/4"],
              ["Commutative (क्रमविनिमेय)", "Yes: a + b = b + a", "Yes: a × b = b × a", "2/3 + 1/4 = 1/4 + 2/3"],
              ["Associative (साहचर्य)", "Yes: (a+b)+c = a+(b+c)", "Yes: (a×b)×c = a×(b×c)", "(1/2 × 2/3) × 3/4 = 1/4"],
              ["Distributive (वितरण नियम)", "a × (b + c) = (a × b) + (a × c)", "Over addition and subtraction", "2/3 × (1/5 + 3/5) = 8/15"],
            ],
          },
        },
        {
          id: "inverses",
          heading: "Additive and Multiplicative Inverses",
          hindiHeading: "योज्य प्रतिलोम एवं गुणात्मक प्रतिलोम",
          content: "Two essential inverse operations used in algebraic simplification:",
          definitions: [
            {
              term: "Additive Inverse (योज्य प्रतिलोम)",
              definition: "The negative of a number. When added to the original number, the sum is 0 (e.g., Additive inverse of 5/7 is -5/7).",
            },
            {
              term: "Multiplicative Inverse / Reciprocal (गुणात्मक प्रतिलोम / व्युत्क्रम)",
              definition: "The flipped fraction. When multiplied by the original number, the product is 1 (e.g., Reciprocal of -3/8 is -8/3). Zero has NO reciprocal.",
            },
          ],
        },
      ],
    },
    video: {
      available: true,
      title: "Class 8 Mathematics: Rational Numbers Chapter 1 Complete Concept",
      youtubeId: "JdG8P0k4y9I",
      duration: "22:15",
      channel: "Digital School Mathematics",
      thumbnailUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80",
      description: "Step-by-step proofs of closure, commutativity, finding rational numbers between any two given numbers.",
    },
    worksheet: {
      available: true,
      title: "Class 8 Mathematics: Rational Numbers Properties & Simplification",
      fileUrl: "/worksheets/class8-math-rational-numbers.pdf",
      fileName: "class8-math-rational-numbers.pdf",
      questionsCount: 20,
      totalMarks: 30,
      difficulty: "Medium",
      sampleQuestions: [
        "1. Write the additive inverse of -7/19 and 21/112.",
        "2. Multiply 6/13 by the reciprocal of -7/16.",
        "3. Find five rational numbers between 2/3 and 4/5.",
        "4. Using appropriate properties, find: -2/3 × 3/5 + 5/2 - 3/5 × 1/6.",
      ],
    },
    book: {
      available: true,
      title: "NCERT Mathematics Class 8 — Chapter 1: Rational Numbers",
      hindiTitle: "गणित कक्षा ८ — पाठ १: परिमेय संख्याएँ",
      publisher: "NCERT",
      edition: "2026-27 Edition",
      chapterNumber: 1,
      pages: 22,
      fileUrl: "/books/ncert-class8-math-ch1.pdf",
      fileName: "ncert-class8-math-ch1.pdf",
      coverColor: "#059669",
    },
  },
];

/**
 * Helper Query Functions for Topics
 */
export function getAllTopics(): TopicItem[] {
  return ALL_TOPICS;
}

export function getTopicsForClass(classId: string): TopicItem[] {
  return ALL_TOPICS.filter((t) => t.classId === classId).sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export function getTopicsForClassAndSubject(classId: string, subjectId: string): TopicItem[] {
  return ALL_TOPICS.filter((t) => t.classId === classId && t.subjectId === subjectId).sort(
    (a, b) => a.chapterNumber - b.chapterNumber
  );
}

export function getTopicById(topicIdOrSlug: string): TopicItem | undefined {
  return ALL_TOPICS.find((t) => t.id === topicIdOrSlug || t.slug === topicIdOrSlug);
}

export function getTopicInClassAndSubject(classId: string, subjectId: string, topicIdOrSlug: string): TopicItem | undefined {
  return ALL_TOPICS.find(
    (t) =>
      t.classId === classId &&
      t.subjectId === subjectId &&
      (t.id === topicIdOrSlug || t.slug === topicIdOrSlug)
  );
}
