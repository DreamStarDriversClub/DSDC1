/* ── Quiz: "What's Your Build?" — data, scoring, archetypes ─── */

export interface QuizAnswer {
  id: string;
  label: string;
  emoji: string;
  description: string;
  /** Which categories this answer scores toward */
  categoryWeights: Partial<Record<"apparel" | "accessories" | "performance" | "lifestyle", number>>;
  /** Style tags for archetype matching */
  styleTags: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  answers: QuizAnswer[];
}

export interface QuizArchetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  vibeEmoji: string;
  styleTags: string[];
  /** Category slugs to recommend */
  recommendedCategories: string[];
  /** Hardcoded product slugs for recommendations (fallback if DB is empty) */
  recommendedSlugs: string[];
}

/* ── Questions ──────────────────────────────────────────────── */

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What powers your dream?",
    subtitle: "Choose your engine — the heart of every build.",
    answers: [
      {
        id: "rotary",
        label: "Rotary",
        emoji: "🔥",
        description: "High-revving, triangle-spinning, bridge-ported perfection.",
        categoryWeights: { performance: 3, lifestyle: 2 },
        styleTags: ["rotary", "purist", "analog"],
      },
      {
        id: "2jz",
        label: "2JZ",
        emoji: "💪",
        description: "Iron block, unlimited boost. The over-engineered legend.",
        categoryWeights: { performance: 3, apparel: 2 },
        styleTags: ["2jz", "power", "iconic"],
      },
      {
        id: "kseries",
        label: "K-Series",
        emoji: "⚡",
        description: "VTEC kicked in, yo. The lightweight giant-killer.",
        categoryWeights: { performance: 2, accessories: 2 },
        styleTags: ["kseries", "modern", "efficient"],
      },
      {
        id: "ev",
        label: "EV Swap",
        emoji: "🔋",
        description: "Silent torque. Instant response. The future is now.",
        categoryWeights: { lifestyle: 3, apparel: 2 },
        styleTags: ["ev", "futuristic", "innovator"],
      },
    ],
  },
  {
    id: 2,
    question: "Where do you drive?",
    subtitle: "Your natural habitat shapes your build.",
    answers: [
      {
        id: "touge",
        label: "Mountain Touge",
        emoji: "🏔️",
        description: "Hairpins, elevation changes, and guardrail kisses.",
        categoryWeights: { performance: 3, accessories: 1 },
        styleTags: ["touge", "technical", "night-runner"],
      },
      {
        id: "city",
        label: "City Streets",
        emoji: "🌃",
        description: "Neon reflections on polished paint. Highway pulls at 2 AM.",
        categoryWeights: { apparel: 3, lifestyle: 1 },
        styleTags: ["city", "night-runner", "social"],
      },
      {
        id: "track",
        label: "Track Day",
        emoji: "🏁",
        description: "Apex hunting, lap times, and tire management.",
        categoryWeights: { performance: 3, accessories: 2 },
        styleTags: ["track", "competitive", "precise"],
      },
      {
        id: "meet",
        label: "Parking Lot Meet",
        emoji: "🅿️",
        description: "Pop the hood, grab a coffee, and talk builds all morning.",
        categoryWeights: { apparel: 2, accessories: 2, lifestyle: 1 },
        styleTags: ["meet", "social", "show"],
      },
    ],
  },
  {
    id: 3,
    question: "Your build style?",
    subtitle: "How does your car present itself to the world?",
    answers: [
      {
        id: "oem-plus",
        label: "OEM+ Clean",
        emoji: "✨",
        description: "Subtle mods, perfect fitment, factory-fresh finish.",
        categoryWeights: { accessories: 2, apparel: 2 },
        styleTags: ["oem-plus", "clean", "subtle"],
      },
      {
        id: "street-demon",
        label: "Street Demon",
        emoji: "😈",
        description: "Aggressive aero, cambered out, loud and proud.",
        categoryWeights: { performance: 2, apparel: 2 },
        styleTags: ["street-demon", "aggressive", "loud"],
      },
      {
        id: "time-attack",
        label: "Time Attack",
        emoji: "⏱️",
        description: "Functional aero, stripped interior, every gram counts.",
        categoryWeights: { performance: 3, accessories: 1 },
        styleTags: ["time-attack", "functional", "serious"],
      },
      {
        id: "show-car",
        label: "Show Car",
        emoji: "🏆",
        description: "Chrome engine bay, custom paint, trophy magnet.",
        categoryWeights: { apparel: 2, lifestyle: 2, accessories: 1 },
        styleTags: ["show-car", "detailed", "flashy"],
      },
    ],
  },
  {
    id: 4,
    question: "Soundtrack of your drive?",
    subtitle: "What's playing when you're behind the wheel?",
    answers: [
      {
        id: "eurobeat",
        label: "Eurobeat",
        emoji: "🎵",
        description: "Running in the 90s, Deja Vu on repeat. Don't stop the music.",
        categoryWeights: { lifestyle: 3, apparel: 1 },
        styleTags: ["eurobeat", "nostalgic", "high-energy"],
      },
      {
        id: "phonk",
        label: "Phonk",
        emoji: "🔊",
        description: "Heavy bass, cowbells, and aggressive Memphis samples.",
        categoryWeights: { apparel: 2, lifestyle: 2 },
        styleTags: ["phonk", "aggressive", "modern"],
      },
      {
        id: "lofi",
        label: "Lo-fi",
        emoji: "🎧",
        description: "Chill beats to cruise to. Smooth vibes, windows down.",
        categoryWeights: { accessories: 2, apparel: 2 },
        styleTags: ["lofi", "chill", "vibey"],
      },
      {
        id: "engine-only",
        label: "Engine Noise Only",
        emoji: "🔧",
        description: "The only music is the symphony under the hood.",
        categoryWeights: { performance: 3, accessories: 1 },
        styleTags: ["engine-only", "purist", "focused"],
      },
    ],
  },
  {
    id: 5,
    question: "Dream Star gear you need most?",
    subtitle: "What's the first thing you're adding to cart?",
    answers: [
      {
        id: "apparel",
        label: "Fresh Apparel",
        emoji: "👕",
        description: "Tees, hoodies, and jackets that rep the rotary life.",
        categoryWeights: { apparel: 5 },
        styleTags: ["apparel-first"],
      },
      {
        id: "accessories",
        label: "Shop Accessories",
        emoji: "🧢",
        description: "Stickers, keychains, patches — details matter.",
        categoryWeights: { accessories: 5 },
        styleTags: ["accessories-first"],
      },
      {
        id: "performance",
        label: "Performance Parts",
        emoji: "⚙️",
        description: "Real parts for real builds. DS Performance lineup.",
        categoryWeights: { performance: 5 },
        styleTags: ["performance-first"],
      },
      {
        id: "full-collection",
        label: "Full Collection",
        emoji: "🎌",
        description: "Everything. I need it all. No half measures.",
        categoryWeights: { apparel: 3, accessories: 2, performance: 2, lifestyle: 1 },
        styleTags: ["full-collection"],
      },
    ],
  },
];

/* ── Archetypes ─────────────────────────────────────────────── */

export const QUIZ_ARCHETYPES: QuizArchetype[] = [
  {
    id: "touge-warrior",
    name: "Touge Warrior",
    tagline: "The mountain pass is your proving ground.",
    vibeEmoji: "🏔️",
    description:
      "You live for late-night mountain runs, redline shifts, and the smell of burning brake pads at 2 AM. Your build is purpose-driven — every mod serves a function. Eurobeat fuels your downhill runs, and you know every hairpin within a 100-mile radius. The garage is your sanctuary, and a fresh set of semi-slicks is your idea of a good weekend.",
    styleTags: ["touge", "rotary", "time-attack", "eurobeat", "performance-first", "technical", "night-runner"],
    recommendedCategories: ["ds-performance"],
    recommendedSlugs: ["rotary-rebuild-gasket-kit", "ds-performance-keychain", "rotary-spirit-tee"],
  },
  {
    id: "night-runner",
    name: "Night Runner",
    tagline: "The city lights blur past as your turbo spools.",
    vibeEmoji: "🌃",
    description:
      "The highway is your runway and the city skyline is your backdrop. You roll with a crew, hit the late-night meets, and your 2JZ sings a song of boost and backfires. Street demon aesthetics, phonk beats rattling the subwoofer, and a fit that's as clean as your paint. You need the full Dream Star collection — apparel for the meets, accessories for the details.",
    styleTags: ["city", "2jz", "street-demon", "phonk", "full-collection", "night-runner", "social"],
    recommendedCategories: ["apparel", "accessories"],
    recommendedSlugs: ["2jz-legends-hoodie", "dream-star-snapback", "jdm-sticker-pack"],
  },
  {
    id: "circuit-demon",
    name: "Circuit Demon",
    tagline: "Lap times don't lie. Neither does your build.",
    vibeEmoji: "🏁",
    description:
      "You measure success in tenths of a second. Your car is stripped, caged, and dialed in. The only soundtrack is engine noise and the squeal of tires at the limit. Rotary power, time attack aero, and a data logger that's seen more track days than most people have seen oil changes. Performance isn't a category — it's your identity.",
    styleTags: ["track", "rotary", "time-attack", "engine-only", "performance-first", "competitive", "serious"],
    recommendedCategories: ["ds-performance"],
    recommendedSlugs: ["rotary-rebuild-gasket-kit", "ds-performance-keychain", "rotary-spirit-tee"],
  },
  {
    id: "clean-build-enthusiast",
    name: "Clean Build Enthusiast",
    tagline: "OEM+ perfection. Subtle flex, maximum respect.",
    vibeEmoji: "✨",
    description:
      "You believe less is more. Perfect panel gaps, tasteful mods, and a detailing kit that costs more than some people's entire builds. Your K-Series heart beats with VTEC precision, and you'd rather cruise vibey city streets than chase lap times. Lo-fi beats, clean fits, and a build that makes purists nod in approval.",
    styleTags: ["city", "kseries", "oem-plus", "lofi", "apparel-first", "clean", "subtle"],
    recommendedCategories: ["apparel", "accessories"],
    recommendedSlugs: ["dream-star-snapback", "jdm-sticker-pack", "2jz-legends-hoodie"],
  },
  {
    id: "silent-assassin",
    name: "Silent Assassin",
    tagline: "No noise. All torque. The future is silent.",
    vibeEmoji: "🔋",
    description:
      "You don't need an exhaust note to make a statement. Your EV-swapped chassis delivers instant torque and confused looks when you gap them at the strip. Track-focused, data-driven, and always chasing efficiency. You're rewriting the rules of JDM culture — one kilowatt at a time.",
    styleTags: ["ev", "track", "time-attack", "engine-only", "performance-first", "futuristic", "innovator"],
    recommendedCategories: ["ds-performance", "apparel"],
    recommendedSlugs: ["rotary-spirit-tee", "ds-performance-keychain", "dream-star-snapback"],
  },
  {
    id: "show-floor-king",
    name: "Show Floor King",
    tagline: "Chrome, carbon, and concours-level detail.",
    vibeEmoji: "🏆",
    description:
      "Your engine bay is cleaner than most kitchens. Every bolt is polished, every panel is paint-corrected, and your 2JZ build has won more trophies than you have shelf space. You live for the parking lot meet — hood popped, crowd gathered, questions flowing. Engine noise is your music, and DS accessories add the finishing touches to your rolling masterpiece.",
    styleTags: ["meet", "2jz", "show-car", "engine-only", "accessories-first", "detailed", "show"],
    recommendedCategories: ["accessories", "apparel"],
    recommendedSlugs: ["jdm-sticker-pack", "ds-performance-keychain", "dream-star-snapback"],
  },
  {
    id: "canyon-carver",
    name: "Canyon Carver",
    tagline: "Every corner is a conversation with the road.",
    vibeEmoji: "⛰️",
    description:
      "You measure roads by their corner-to-straight ratio. Your lightweight K-Series build dances through switchbacks with surgical precision. OEM+ aesthetics keep things clean while functional mods keep you planted. Lo-fi beats set the pace as you chase the perfect line through golden-hour canyon light.",
    styleTags: ["touge", "kseries", "oem-plus", "lofi", "accessories-first", "technical", "clean"],
    recommendedCategories: ["accessories", "ds-performance"],
    recommendedSlugs: ["ds-performance-keychain", "rotary-rebuild-gasket-kit", "jdm-sticker-pack"],
  },
  {
    id: "rotary-purist",
    name: "Rotary Purist",
    tagline: "Triangles spin. Legends live forever.",
    vibeEmoji: "🔥",
    description:
      "You've explained apex seals at parties more times than you can count — and you love every minute of it. Your rotary build is a shrine to Mazda engineering, maintained with religious devotion. Eurobeat anthems, parking lot meets, and a garage that smells like premix. You rep the full Dream Star collection because rotary life isn't just a build — it's an identity.",
    styleTags: ["meet", "rotary", "show-car", "eurobeat", "full-collection", "purist", "social"],
    recommendedCategories: ["apparel", "accessories", "ds-performance"],
    recommendedSlugs: ["rotary-spirit-tee", "rotary-rebuild-gasket-kit", "dream-star-snapback"],
  },
];

/* ── Scoring engine ────────────────────────────────────────── */

export interface QuizScore {
  apparel: number;
  accessories: number;
  performance: number;
  lifestyle: number;
  styleTags: string[];
}

/**
 * Compute the result archetype from the user's selected answer IDs.
 * Takes the answer IDs in order (Q1..Q5) and returns the best-matching archetype.
 */
export function computeResult(answerIds: string[]): QuizArchetype {
  // Build a flat list of all answers selected
  const selectedAnswers: QuizAnswer[] = [];
  for (let i = 0; i < answerIds.length; i++) {
    const question = QUIZ_QUESTIONS[i];
    const answer = question.answers.find((a) => a.id === answerIds[i]);
    if (answer) selectedAnswers.push(answer);
  }

  // Accumulate category scores
  const scores: QuizScore = {
    apparel: 0,
    accessories: 0,
    performance: 0,
    lifestyle: 0,
    styleTags: [],
  };

  for (const ans of selectedAnswers) {
    if (ans.categoryWeights.apparel) scores.apparel += ans.categoryWeights.apparel;
    if (ans.categoryWeights.accessories) scores.accessories += ans.categoryWeights.accessories;
    if (ans.categoryWeights.performance) scores.performance += ans.categoryWeights.performance;
    if (ans.categoryWeights.lifestyle) scores.lifestyle += ans.categoryWeights.lifestyle;
    scores.styleTags.push(...ans.styleTags);
  }

  // Score each archetype by number of matching style tags
  let bestArchetype = QUIZ_ARCHETYPES[0];
  let bestScore = -1;

  for (const archetype of QUIZ_ARCHETYPES) {
    let matchCount = 0;
    // Add weight for category alignment
    const topCategories = getTopCategories(scores);

    for (const cat of topCategories) {
      if (archetype.recommendedCategories.includes(cat)) matchCount += 3;
    }

    for (const tag of scores.styleTags) {
      if (archetype.styleTags.includes(tag)) matchCount += 1;
    }

    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestArchetype = archetype;
    }
  }

  return bestArchetype;
}

function getTopCategories(scores: QuizScore): string[] {
  const entries = Object.entries(scores)
    .filter(([key]) => key !== "styleTags")
    .sort(([, a], [, b]) => b - a);

  const top = entries.slice(0, 2).map(([key]) => key);

  // Map to category slugs
  const slugMap: Record<string, string> = {
    apparel: "apparel",
    accessories: "accessories",
    performance: "ds-performance",
    lifestyle: "apparel", // lifestyle maps to apparel for product recs
  };

  return top.map((k) => slugMap[k] || "apparel");
}

/* ── Share text helper ─────────────────────────────────────── */

export function buildShareText(archetype: QuizArchetype): string {
  return `🚗 I got "${archetype.name}" on the Dream Star Drivers Club "What's Your Build?" quiz!\n\n${archetype.tagline}\n\n${archetype.vibeEmoji} Find your build: ${typeof window !== "undefined" ? window.location.origin : "https://dreamstardc.com"}/quiz`;
}
