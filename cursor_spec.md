# Cursor Master Development Plan: PokéMath Adventure

**Role:** Senior Frontend Architect & Game Designer  
**Project:** PokéMath Adventure (Educational Web Game)  
**Target Audience:** 5-year-old boys (Taiwan/Traditional Chinese context)  
**Visual Style:** **Pokémon Mezastar Arcade** (High contrast, Shiny Gold `#FFD700`, Deep Purple `#2E0249`, Neon accents, "Juicy" feedback).  
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, OpenAI API, React-Webcam.

---

## 1. Project File Structure & Stack

### Dependencies
Run these commands to set up the environment:
```bash
npx create-next-app@latest pokemath-adventure --typescript --tailwind --eslint
cd pokemath-adventure
npm install framer-motion lucide-react canvas-confetti react-webcam zustand clsx tailwind-merge
npm install -D prettier prettier-plugin-tailwindcss
```

### Folder Structure (App Router)
```
src/
├── app/
│   ├── layout.tsx         # Root layout with <GameContainer>
│   ├── page.tsx           # Main game entry (Phase Orchestrator)
│   └── globals.css        # Tailwind directives & Custom Fonts
├── components/
│   ├── game/
│   │   ├── Phase1_Init.tsx        # Proficiency Check & Starter Select
│   │   ├── Phase2_SceneSelect.tsx # Triangle Map Selection
│   │   ├── Phase3_Battle.tsx      # Quiz & Enemy Animation
│   │   ├── Phase4_Catch.tsx       # Spinning Wheel Minigame
│   │   └── Phase5_ARResult.tsx    # Webcam & Photo Capture
│   ├── ui/
│   │   ├── MezastarCard.tsx       # Reusable Gold-Border Card
│   │   ├── JuicyButton.tsx        # Button with scale/sound effects
│   │   └── HealthBar.tsx
│   └── effects/
│       ├── DamageOverlay.tsx      # Red flash on wrong answer
│       └── Confetti.tsx
├── lib/
│   ├── store.ts           # Zustand Game State (Client Side)
│   ├── sounds.ts          # Audio context/manager
│   ├── openai.ts          # GPT-4o Action/Route
│   └── constants.ts       # Game config (colors, polygons)
├── types/
│   └── index.ts           # Shared interfaces
└── hooks/
    ├── useSound.ts
    └── useGameLoop.ts
```

---

## 2. Design System & Animation Tokens

### Tailwind Config (Mezastar Theme)
Extend `tailwind.config.ts`:
```javascript
theme: {
  extend: {
    colors: {
      mezastar: {
        gold: '#FFD700',       // Main active elements, borders
        purple: '#2E0249',     // Background deep void
        surface: '#1A0B2E',    // Card backgrounds
        neon: '#00FF00',       // Success/High energy
        danger: '#FF0055',     // Error/Damage
        ui: 'rgba(255, 255, 255, 0.1)' // Glassmorphism
      }
    },
    backgroundImage: {
      'holo-pattern': "url('/patterns/foil-texture.png')", // CSS pattern for card shine
      'star-burst': "radial-gradient(circle, #FFD700 0%, transparent 70%)"
    }
  }
}
```

### Framer Motion Variants
Define these in a utility file for reuse:

1.  **`heroEntrance`**: For Pokémon appearance.
    ```javascript
    {
      hidden: { scale: 0, opacity: 0, y: 50 },
      visible: { 
        scale: 1, 
        opacity: 1, 
        y: 0, 
        transition: { type: "spring", bounce: 0.6, duration: 0.8 } 
      }
    }
    ```
2.  **`damageShake`**: For wrong answers.
    ```javascript
    {
      shake: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
    }
    ```
3.  **`pokeballSpin`**: For the catching needle.
    ```javascript
    {
      spin: { rotate: 360, transition: { repeat: Infinity, duration: 0.8, ease: "linear" } }
    }
    ```

---

## 3. Data Schemas (TypeScript)

### Pokemon Interface
```typescript
interface Pokemon {
  id: number;
  name: string;      // English ID (e.g., 'charizard')
  nameZh: string;    // Display (e.g., '噴火龍')
  type: 'fire' | 'water' | 'grass' | 'electric' | 'normal';
  starLevel: 4 | 5 | 6; 
  imageUrl: string;  // Official Artwork URL
  crySoundUrl?: string; 
}
```

### Question Interface
```typescript
interface Question {
  id: string;
  type: 'math' | 'english';
  text: string;      // "3 + 5 = ?" or "Apple means?"
  options: string[]; // ["8", "9", "2", "10"]
  correctIndex: number; // 0-3
}
```

### OpenAI System Prompt
**Role:** Educational Game Content Generator (Age 5).  
**Output:** JSON only.  
**Prompt:**
```text
You are an engine for a children's game (Age 5, Traditional Chinese user).
Generate a generic question based on the requested 'type' (Math or English).

Constraint for Math: Addition/Subtraction sum under 20.
Constraint for English: Basic nouns (Animals, Food, Colors).
Format:
{
  "text": "Question String",
  "options": ["Option1", "Option2", "Option3", "Option4"],
  "correctIndex": 0 // The index of the correct answer
}
```

---

## 4. Component Implementation Prompts

### A. TriangleMapSelection (`Phase2_SceneSelect.tsx`)
**Prompt for Cursor:**
> Create a React component representing a Map Selection screen.
> 1.  Use a full-screen container with `relative` positioning.
> 2.  Create 3 absolute positioned `div` elements acting as buttons.
> 3.  Use CSS `clip-path` to cut them into triangles meeting at the center:
>     *   **Top (Mountain):** `polygon(0 0, 100% 0, 50% 50%)`. Color: `bg-stone-800`.
>     *   **Bottom-Left (Swamp):** `polygon(0 0, 0 100%, 50% 100%, 50% 50%)`. Color: `bg-indigo-900`.
>     *   **Bottom-Right (Forest):** `polygon(100% 0, 100% 100%, 50% 100%, 50% 50%)`. Color: `bg-emerald-900`.
> 4.  **Interaction:** On hover, scale the background image inside the triangle to 1.1.
> 5.  **Logic:** When clicked, trigger a "Zoom" animation (scale the container to 3x centering on the clicked triangle) and call `useGameStore.selectScene()`.

### B. SpinningCatchWheel (`Phase4_Catch.tsx`)
**Prompt for Cursor:**
> Create a "Catching Minigame" component.
> 1.  **Visuals:** Render a **semi-circle** gauge at the bottom center of the screen (arch upwards).
> 2.  **Segments:** Divide the arch into colored zones using CSS conic-gradient (masked to a semi-circle):
>     *   0-10%: Purple (Master Ball - 100% catch)
>     *   10-30%: Black/Yellow (Ultra Ball - 70%)
>     *   30-60%: Blue (Great Ball - 40%)
>     *   60-100%: Red (Poke Ball - 20%)
> 3.  **Needle:** A `div` that rotates from -90deg to +90deg (back and forth) using `framer-motion` loop.
> 4.  **Interaction:** A large "THROW" button. On click -> Stop the needle animation.
> 5.  **Calculation:** Calculate the stopping angle. Map the angle to the specific Ball Type.
> 6.  **Animation:** Animate a Pokéball sprite flying from the bottom of the screen to the center (where the enemy is). Shake the enemy sprite 3 times. Show result.

### C. ARPhotoBooth (`Phase5_ARResult.tsx`)
**Prompt for Cursor:**
> Create an AR Result component using `react-webcam`.
> 1.  **Layout:** Full-screen Webcam feed.
> 2.  **Overlay:** Position the caught Pokémon sprite (from props) in the bottom-right corner. Add a "Mezastar" style border frame around the screen.
> 3.  **Capture:** Add a "Take Photo" button.
> 4.  **Logic:** Use `html2canvas` or `webcamRef.getScreenshot()` to capture the composite image.
> 5.  **Output:** Display the captured image with a "Download" button.

---

## 5. Interaction & Feedback Rules ("Juicy" Design)

1.  **Sound Effects (Critical):**
    *   **Click:** Short, high-pitch "Bip".
    *   **Scene Select:** heavy "Whoosh".
    *   **Battle Start:** "Roar" + Glass shattering sound.
    *   **Correct:** "Ding-Ding-Ding" + Crowd cheer.
    *   **Wrong:** "Buzz" + Screen glitch sound.
    *   **Catch:** Rhythm "Shake... Shake... Click!".

2.  **Haptics (Mobile):**
    *   Trigger `navigator.vibrate(50)` on all button clicks.
    *   Trigger `navigator.vibrate([100, 50, 100])` on Damage.

3.  **Visuals:**
    *   Use `canvas-confetti` for EVERY correct answer.
    *   All buttons must have `active:scale-95` and a white "glare" animation on hover.
