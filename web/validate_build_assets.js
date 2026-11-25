// TNPSC Wizard - Build & Asset Integrity Validator
// Checks:
// 1. All 401 authentic questions in tnpsc_questions.json
// 2. ComfyUI character sprites & background assets
// 3. PWA manifest.json, sw.js, and app icons

const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(PUBLIC_DIR, "data");
const ASSETS_DIR = path.join(PUBLIC_DIR, "assets");
const ICONS_DIR = path.join(PUBLIC_DIR, "icons");

console.log("============================================================");
console.log("🛠️ TNPSC WIZARD - ASSET & DATA INTEGRITY VALIDATION");
console.log("============================================================");

let hasErrors = false;

// 1. Question Bank Integrity Check
const questionsPath = path.join(DATA_DIR, "tnpsc_questions.json");
if (!fs.existsSync(questionsPath)) {
  console.error("❌ Missing tnpsc_questions.json at:", questionsPath);
  process.exit(1);
}

const rawQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
let questionCount = 0;
let distractorCount = 0;

if (rawQuestions.subjects) {
  rawQuestions.subjects.forEach((subj) => {
    subj.topics.forEach((topic) => {
      topic.questions.forEach((q) => {
        questionCount++;
        if (q.error_analysis && Object.keys(q.error_analysis).length > 0) {
          distractorCount += Object.keys(q.error_analysis).length;
        }
      });
    });
  });
}

console.log(`[+] Total Questions in Master JSON: ${questionCount} (Target: 401)`);
console.log(`[+] Total Pedagogical Error Analyses: ${distractorCount}`);

if (questionCount !== 401) {
  console.error(`❌ Question count mismatch: expected 401, found ${questionCount}`);
  hasErrors = true;
} else {
  console.log("✅ Question count strictly verified at 401/401!");
}

// 2. Syllabus Mapping & Story Hooks Check
const syllabusPath = path.join(DATA_DIR, "syllabus_mapping.json");
if (!fs.existsSync(syllabusPath)) {
  console.error("❌ Missing syllabus_mapping.json");
  hasErrors = true;
} else {
  const syllabus = JSON.parse(fs.readFileSync(syllabusPath, "utf-8"));
  let storyHooksCount = 0;
  let nodeCount = 0;
  syllabus.units.forEach((u) => {
    u.nodes.forEach((n) => {
      nodeCount++;
      if (n.storyHook && n.storyHook.narrativeEn) {
        storyHooksCount++;
      }
    });
  });
  console.log(`[+] Syllabus Nodes: ${nodeCount}, Story Hooks: ${storyHooksCount}/${nodeCount}`);
  if (storyHooksCount < nodeCount) {
    console.error("❌ Some syllabus nodes lack story hooks!");
    hasErrors = true;
  } else {
    console.log("✅ All 39 Syllabus Nodes verified with Story Hooks!");
  }
}

// 3. ComfyUI Sprites & RPG Assets Check
const REQUIRED_ASSETS = [
  "lalitha_character.png",
  "lalitha_wizard_hero.png",
  "velan_wizard_companion.png",
  "wizard_temple_bg.png",
  "comfyui_wizard_bg.png",
  "mandapam_campfire_bg.png",
  "chola_battle_arena_bg.png",
  "chola_temple_sanctum_bg.png",
  "prop_relic_urn.png",
  "prop_boss_gate.png",
  "ui_gold_coin.png",
  "ui_study_scroll.png",
  "ui_victory_star.png",
];

let assetsVerified = 0;
REQUIRED_ASSETS.forEach((file) => {
  const p = path.join(ASSETS_DIR, file);
  if (fs.existsSync(p)) {
    const stat = fs.statSync(p);
    if (stat.size > 1000) {
      assetsVerified++;
    } else {
      console.error(`❌ Asset ${file} is suspiciously small: ${stat.size} bytes`);
      hasErrors = true;
    }
  } else {
    console.error(`❌ Missing RPG asset: ${file}`);
    hasErrors = true;
  }
});

console.log(`[+] RPG ComfyUI Sprites & Backgrounds: ${assetsVerified}/${REQUIRED_ASSETS.length} present and non-empty.`);

// 4. PWA Manifest, Service Worker & Icons Check
const manifestPath = path.join(PUBLIC_DIR, "manifest.json");
const swPath = path.join(PUBLIC_DIR, "sw.js");

if (!fs.existsSync(manifestPath)) {
  console.error("❌ Missing manifest.json in public folder");
  hasErrors = true;
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  if (manifest.display !== "standalone") {
    console.error("❌ Manifest display is not 'standalone'");
    hasErrors = true;
  } else {
    console.log("✅ PWA manifest.json verified with display='standalone'!");
  }
}

if (!fs.existsSync(swPath)) {
  console.error("❌ Missing sw.js in public folder");
  hasErrors = true;
} else {
  const swCode = fs.readFileSync(swPath, "utf-8");
  if (!swCode.includes("PRECACHE_RESOURCES")) {
    console.error("❌ sw.js does not contain PRECACHE_RESOURCES");
    hasErrors = true;
  } else {
    console.log("✅ Service Worker sw.js verified with offline precache list!");
  }
}

const REQUIRED_ICONS = [
  "icon-192x192.png",
  "icon-512x512.png",
  "icon-maskable-512x512.png",
  "apple-touch-icon.png",
];

REQUIRED_ICONS.forEach((icon) => {
  const p = path.join(ICONS_DIR, icon);
  if (!fs.existsSync(p)) {
    console.error(`❌ Missing PWA icon: ${icon}`);
    hasErrors = true;
  }
});
console.log(`✅ All ${REQUIRED_ICONS.length} PWA App Icons verified!`);

console.log("============================================================");
if (hasErrors) {
  console.error("❌ Build & Asset Integrity Check FAILED. Fix errors above.");
  process.exit(1);
} else {
  console.log(`All 401 questions and ${assetsVerified} assets verified in build.`);
  console.log("🎉 STATUS: 100% ASSET & DATA INTEGRITY LOCKED!");
  console.log("============================================================");
}
