#!/usr/bin/env python3
"""
=============================================================================
TNPSC WIZARD - STUDIO TAMIL AUDIO GENERATOR (HYBRID ENGINE)
=============================================================================
Generates natural Tamil MP3 clips under web/public/audio/ta/ and emits a
typed TypeScript lookup manifest at web/src/data/tamilAudioManifest.ts for
hero dialogues, onboarding steps, Velan's Codex, Sanctuary intro, realm
story hooks, and core feedback lines.

Uses gTTS (ta) cleanly with deterministic filenames and idempotent caching.
Usage:
  python scripts/generate_tamil_audio.py
=============================================================================
"""

import json
import os
from typing import Dict
from gtts import gTTS

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUDIO_OUT_DIR = os.path.join(ROOT_DIR, "web", "public", "audio", "ta")
SYLLABUS_JSON_PATH = os.path.join(ROOT_DIR, "web", "public", "data", "syllabus_mapping.json")
MANIFEST_TS_PATH = os.path.join(ROOT_DIR, "web", "src", "data", "tamilAudioManifest.ts")

STATIC_TAMIL_CLIPS: Dict[str, str] = {
    # Onboarding (4 Steps)
    "onboarding_step1": "வணக்கம் இளம் வித்தைக்காரரே! நான் வேலன். ஒன்றாக இணைந்து TNPSC உலகங்களை வெல்வோம்!",
    "onboarding_step2": "உங்கள் முதல் மந்திரத்தை வீச சரியான விடையைத் தட்டவும்! தஞ்சாவூரில் இருந்த சோழப் பேரரசின் தலைநகரை வளமாக்கிய புனித நதி எது?",
    "onboarding_step3": "உங்கள் பயணம் வரலாற்றுச் சிகரங்களில் தொடங்குகிறது. உங்கள் முதல் உலகத்தைத் திறக்கத் தட்டவும்!",
    "onboarding_step4": "உங்கள் உறுதிமொழி பொறிக்கப்பட்டது! முதல் தரவரிசைக்கான பாதையில் ஞானம் வழிகாட்டட்டும்.",
    # Sanctuary Hero Opening
    "sanctuary_intro": "லலிதா! அசோகரின் பதின்மூன்றாம் பாறைக் கல்வெட்டை ஆராய நாம் புறப்படலாமா?",
    # Character Easter Eggs
    "velan_easter_egg": "இங்குள்ள எழுபது சதவீத வினாக்கள் கடந்த பத்து ஆண்டு டி என் பி எஸ் சி தேர்வுகளிலிருந்து எடுக்கப்பட்டவை! முந்தைய வினாக்களே முதல் தரவரிசைக்கான திறவுகோல்!",
    "lalitha_easter_egg": "நான் தயார்! ஒவ்வொரு வினாவிலும் தேர்ச்சி பெறுவது என்னைத் துணை ஆட்சியர் பதவிக்கு நெருக்கமாகக் கொண்டு செல்கிறது!",
    # Velan's Codex (6 Chapters)
    "codex_intro": "வணக்கம் வீர லலிதா! தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையத் தேர்வு என்பது ஒரு பெருங்கடலைப் போன்றது. கவலை வேண்டாம், உனது வழிகாட்டியாக நான் இருக்கிறேன். கடந்த 10 ஆண்டுகளின் அசல் வினாக்களை மந்திர ஆயுதங்களாகப் பயன்படுத்தி, சவாலான தலைப்புகளை முறியடித்து முதல் தரவரிசையை அடைவோம்!",
    "codex_pwa": "குரோம் அல்லது சஃபாரி வழியாக செயலியை உங்கள் முகப்புத் திரையில் நிறுவலாம். அனைத்து வினாக்களும் ஒலி விளைவுகளும் இணையம் இல்லாமலேயே இயங்கும்.",
    "codex_rules": "மந்திர ஆற்றல் பாடத்திட்டத் தேர்ச்சியைக் காட்டுகிறது; சவாலான சுருள்கள் நீங்கள் தவறவிட்ட வினாக்களைத் தொடர்ந்து இரண்டு முறை சரியாக விடையளிக்கும் வரை நினைவூட்டும்; இறுதித் தேர்வில் எண்பது சதவீதத்திற்கு மேல் பெற்றால் அடுத்த உலகம் திறக்கும்.",
    "codex_trial": "ஒவ்வொரு வினாவிலும் அதன் தேர்வு ஆண்டு மற்றும் தரம் குறிக்கப்பட்டிருக்கும். தவறான விடையைத் தேர்ந்தெடுத்தால், வினாப் பிழை பகுப்பாய்வு ஏன் அந்தத் தேர்வு தவறானது என்பதையும் சரியான பாடக் கருத்தையும் விளக்கும்.",
    "codex_oracle": "உங்கள் தேர்வு நாட்கள் எண்ணிக்கை மற்றும் அடுத்து படிக்க வேண்டிய தலைப்பை அறிய தினசரி வாக்கு பகுதியைப் பார்க்கவும். ஏதேனும் வினா குழப்பமாக இருந்தால் கீழ் வலது மூலையில் உள்ள தங்க இறகு பொத்தானைத் தட்டிப் பதிவு செய்யலாம்.",
    "codex_reset": "கண்ட்ரோல் ஷிப்ட் டி அழுத்தினால் அல்லது கிளீன் ஸ்லேட் ரீசெட் பொத்தானைத் தட்டினால் உங்கள் பயிற்சி நிலை சீரமைக்கப்பட்டு முதல் நாளிலிருந்து மீண்டும் தொடங்கலாம்.",
    # Shared Pedagogical Feedback
    "feedback_correct": "அருமை லலிதா! சரியான விடை! உங்கள் கருத்துப் புரிதல் மிகவும் துல்லியமாக உள்ளது.",
    "feedback_wrong": "கவனப் பொறி எச்சரிக்கை! விளக்கத்தைப் படித்து மீண்டும் முயற்சி செய் லலிதா.",
    "feedback_streak": "உங்கள் மன ஆற்றல் பெருகுகிறது! தொடர்ந்து சரியான விடைகள்! முதல் தரவரிசை மிக அருகில் உள்ளது!",
}


def main() -> None:
    os.makedirs(AUDIO_OUT_DIR, exist_ok=True)
    clips: Dict[str, str] = dict(STATIC_TAMIL_CLIPS)

    if os.path.exists(SYLLABUS_JSON_PATH):
        with open(SYLLABUS_JSON_PATH, "r", encoding="utf-8") as f:
            syllabus = json.load(f)
        for unit in syllabus.get("units", []):
            realm_id = unit.get("realmId")
            nodes = unit.get("nodes", [])
            if realm_id and nodes:
                narrative_ta = nodes[0].get("storyHook", {}).get("narrativeTa")
                if narrative_ta:
                    clips[f"story_hook_{realm_id}"] = narrative_ta

    manifest_entries: Dict[str, str] = {}
    for key, text_ta in clips.items():
        out_file = os.path.join(AUDIO_OUT_DIR, f"{key}.mp3")
        public_url = f"/audio/ta/{key}.mp3"
        if not os.path.exists(out_file) or os.path.getsize(out_file) < 1024:
            print(f"[TTS] Generating {public_url}...", flush=True)
            gTTS(text=text_ta, lang="ta").save(out_file)
        else:
            print(f"[CACHE] Exists {public_url} ({os.path.getsize(out_file)} bytes)", flush=True)
        manifest_entries[key] = public_url

    ts_lines = [
        "// Auto-generated by scripts/generate_tamil_audio.py",
        "// Maps core onboarding, Codex, story-hook, and feedback keys to studio Tamil MP3s.",
        "",
        "export const TAMIL_AUDIO_CLIPS: Record<string, string> = {",
    ]
    for k in sorted(manifest_entries.keys()):
        ts_lines.append(f'  "{k}": "{manifest_entries[k]}",')
    ts_lines.extend(
        [
            "};",
            "",
            "export function getTamilClipUrl(key?: string | null): string | undefined {",
            "  if (!key) return undefined;",
            "  return TAMIL_AUDIO_CLIPS[key];",
            "}",
            "",
            "export function getStoryHookClipKey(realmId: string): string {",
            "  return `story_hook_${realmId}`;",
            "}",
            "",
        ]
    )

    with open(MANIFEST_TS_PATH, "w", encoding="utf-8") as mf:
        mf.write("\n".join(ts_lines))

    print(f"[OK] Generated {len(manifest_entries)} studio Tamil MP3 clips and wrote {MANIFEST_TS_PATH}")


if __name__ == "__main__":
    main()
