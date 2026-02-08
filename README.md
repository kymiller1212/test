# ReadBuddy

A dyslexia-friendly reading app built for kids learning to read. Designed with Duolingo-inspired gamification and accessibility-first principles, ReadBuddy makes reading practice fun and engaging.

Built for a 3rd grader reading at a 2nd grade level, but adaptable to any young reader.

## Features

### Reading Experience
- **Three reading modes:**
  - **Read Along** — full story view with tap-to-hear word support and read-aloud highlighting
  - **Word by Word** — large, focused single-word display with speech recognition practice
  - **Line by Line** — visual line highlighting with progressive reveal and speech recognition
- **Dyslexia-optimized typography** — Lexend font, adjustable letter spacing, word spacing, line height, and font size
- **Syllable helper** — tap a word once to see its syllable breakdown, tap again to hear it spoken
- **Reading ruler** — a movable focus strip that dims text above and below the current line
- **Background color options** — cream, light green, light blue, peach, lavender, and white

### Content
- **9 built-in topics** with 54 hand-written stories (27 Level 1 + 27 Level 2):
  - Ohio State Football, American Football, Amon-Ra St. Brown, George Kittle, Tom Brady, Lego Star Wars, Flag Football, History of Football, Epic Football Stories
- **Level 1 stories** — 2nd grade reading level (~95 words, 4 paragraphs, simple sentences)
- **Level 2 stories** — 3rd grade reading level (~135 words, 5 paragraphs, richer vocabulary)
- **AI story generation** — type any topic to auto-generate 6 stories (3 per level) using the OpenAI API
- **In-topic story generation** — generate additional stories within existing topics with optional subtopic focus and level selection

### Gamification
- **XP system** — earn XP from reading stories (10 XP), quiz answers (5 XP per correct + bonuses), and word review (3 XP per word)
- **Level progression** — level up every `level × 50` XP with confetti celebration
- **Daily streak tracking** — tracks consecutive days of app usage with a 7-day calendar view
- **10 unlockable achievements** — First Story, Bookworm, Story Master, On Fire, Unstoppable, XP Hunter, XP Champion, Level 5, Level 10, Halfway There
- **Stats/progress screen** — tap the level bar in the header to see your full progress dashboard with level ring, streak, stats grid, achievements, and per-topic progress bars
- **XP penalty for helped words** — words you tap for help cost -1 XP and show in red

### Quiz & Word Review
- **Comprehension quizzes** — 3 multiple-choice questions after each story
- **Word review flashcard game** — after the quiz, any words you tapped for help are shown as Tinder-style swipeable flashcards with Got It / Missed It buttons, swipe gestures, and auto-miss if you tap the speaker

### Voice Input
- **Speech recognition** — say a topic on the home screen to search, or read words aloud in Word by Word and Line by Line modes
- **Fuzzy pronunciation matching** — tolerant of reading mistakes, partial matches, and common dyslexia-related pronunciation differences

### Cloud Sync (Optional)
- **Google sign-in** — sign in with your Google account to sync progress across devices
- **Cross-device state** — XP, level, streak, stories read, generated stories, and settings all sync automatically
- **Smart merge** — intelligently merges data when signing in on a new device (union of stories read, highest progress wins)
- **Offline-first** — works fully offline with localStorage; syncs when signed in and online

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Safari, Edge, or Firefox)
- An OpenAI API key (for story generation only — all built-in stories work without one)
- A Firebase project (optional — for cross-device sync only)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/kymiller1212/test.git
   cd test
   ```

2. Create your config file:
   ```bash
   cp config.example.js config.js
   ```

3. Add your OpenAI API key to `config.js`:
   ```js
   var READBUDDY_CONFIG = {
     apiKey: "your-openai-api-key-here",
     apiProvider: "openai"
   };
   ```

4. Open `index.html` in your browser. No build step or server required — it's a pure client-side app.

> **Note:** `config.js` is gitignored and will not be committed. The app works fully without an API key — you just won't be able to generate new stories.

### Cloud Sync Setup (Optional)

To enable cross-device progress sync:

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project
2. In the Firebase console, go to **Authentication > Sign-in method** and enable **Google**
3. Go to **Cloud Firestore** and create a database (start in **test mode** for simplicity)
4. Go to **Project Settings > General** and scroll to "Your apps" — click the web icon (`</>`) to register a web app
5. Copy the config values into your `config.js`:
   ```js
   var READBUDDY_CONFIG = {
     apiKey: "your-openai-api-key",
     apiProvider: "openai",
     firebase: {
       apiKey: "AIza...",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abc123"
     }
   };
   ```
6. A "Cloud Sync" section will appear in Settings — tap "Sign in with Google" to start syncing

## Project Structure

```
├── index.html          # Main HTML — app shell, screens, overlays
├── app.js              # Application logic — navigation, reading modes,
│                       #   speech recognition, quizzes, word review,
│                       #   gamification, AI story generation, stats
├── styles.css          # All styling — Duolingo-inspired design system,
│                       #   responsive layout, animations
├── stories.js          # Story database — 54 stories, topic definitions,
│                       #   quiz questions, word banks
├── config.js           # API key config (gitignored)
├── config.example.js   # Template for config.js
└── .gitignore
```

## Customization

### Settings (in-app)
- **Text Size** — 18px to 36px
- **Letter Spacing** — 0 to 8 levels
- **Word Spacing** — 0 to 12 levels
- **Line Height** — 1.6 to 3.0
- **Reading Speed** — controls read-aloud pace
- **Background Color** — 6 options
- **Reading Ruler** — toggle on/off
- **Syllable Helper** — toggle on/off

### Adding Stories Manually
Add entries to the `STORIES` array in `stories.js`. Each story follows this structure:

```js
{
  topic: "topic-id",
  level: 1,  // 1 = 2nd grade, 2 = 3rd grade
  title: "Story Title",
  icon: "emoji",
  content: [
    "First paragraph...",
    "Second paragraph...",
    "Third paragraph..."
  ],
  words: ["vocabulary", "words", "to", "highlight"],
  quiz: [
    {
      q: "Question text?",
      choices: ["Answer A", "Answer B", "Answer C"],
      answer: 0  // index of correct choice
    }
  ]
}
```

### Adding Topics
Add entries to the `TOPICS` array in `stories.js`:

```js
{ id: "topic-id", label: "Display Name", icon: "emoji", color: "#hexcolor" }
```

## Tech Stack

- **Pure HTML/CSS/JavaScript** — no frameworks, no build tools, no dependencies
- **Web Speech API** — text-to-speech and speech recognition
- **OpenAI API** — story generation (optional)
- **Firebase** — Google sign-in + Cloud Firestore for cross-device sync (optional)
- **localStorage** — persists XP, level, streak, stories read, generated stories, and settings
- **Google Fonts** — Lexend (optimized for reading)

## Data Persistence

All user data is stored in the browser's localStorage (and optionally synced to Firebase Cloud Firestore):

| Key | Description |
|-----|-------------|
| `rb_xp` | Current XP |
| `rb_level` | Current level |
| `rb_total_xp` | Lifetime XP earned |
| `rb_read` | Array of story IDs that have been read |
| `rb_streak` | Streak data (current, best, last date, 30-day history) |
| `rb_generated` | AI-generated stories keyed by topic |
| `rb_settings` | User preferences (font size, colors, etc.) |

When signed in with Google, all data syncs to Firestore under `users/{uid}`. The merge strategy is:
- **XP/Level**: Whichever device has more total XP earned wins
- **Stories Read**: Union of both devices (no stories lost)
- **Generated Stories**: Union of both devices
- **Streak**: Highest best streak kept; history merged

## License

This project is for personal/educational use.
