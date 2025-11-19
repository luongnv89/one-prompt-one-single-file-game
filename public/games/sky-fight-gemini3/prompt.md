Create a complete "Sky Fight 2D Retro" game in a single `.html` file that includes HTML, CSS, and JavaScript, meeting the following requirements:

1. **2D Style**: Implement the game in a 2D canvas, using simple shapes (e.g., triangles for the player, rectangles for enemies and bullets) without any 3D effects or perspective.
2. **Retro Style**: 
   - Use a pixelated font (e.g., 'Press Start 2P' from Google Fonts).
   - Employ a limited color palette (e.g., blue sky background, green player, red enemies, yellow bullets/rockets).
   - Use blocky, simplified graphics reminiscent of classic arcade games.
3. **Better Game Logic**: 
   - Player controls a ship that moves left/right and adjusts speed (up/down).
   - Automatically fires bullets at regular intervals; can manually fire rockets (limited supply) and use a boomshell (clears all enemies, limited use).
   - Enemies spawn from the top, moving downward, with varying types (e.g., fast/weak, slow/strong, zigzag movement).
   - Power-ups (health, rockets, boomshell, speed boost) spawn randomly when enemies are destroyed.
   - Collision detection: bullets/rockets damage enemies, player takes damage from enemy collisions, game ends when health reaches zero.
   - Include explosion particle effects (simple circles) when enemies are destroyed.
   - Rockets recharge over time (e.g., every 30 seconds).
   - Simple sound effects via Web Audio API (e.g., high pitch for bullets, lower for rockets/boomshell, medium for explosions).
4. **Show Final Score**: Display the player's final score on a game over screen when the game ends.
5. **Local Score Table**: 
   - Store high scores locally in the browser using `localStorage`.
   - Maintain a list of the top 10 scores with player names and scores.
6. **Name Input and High Score Table**: 
   - Start with a screen where the player enters their name and views the high score table.
   - Game begins only after a name is provided.
   - Display the high score table on the start screen, updated after each game if the score qualifies.
7. **Pause/Resume**: 
   - Allow pausing and resuming using the 'P' key (keyboard) or a touch button (mobile).
   - Show a pause overlay when paused.
8. **Local Storage**: Ensure all persistent data (high scores) is stored locally using `localStorage`.

Additional Specifications:
- **Structure**: 
  - Use a `<canvas>` element for gameplay, with separate divs for start, pause, and game over screens.
  - Display a status bar above the canvas showing score, level, health, rockets, and boomshells during play.
  - Include touch controls (left, right, rocket, boomshell, pause) for mobile, visible only on small screens (e.g., via CSS media query).
- **Game Mechanics**:
  - Player starts with 3 health (max 5), 5 rockets, 1 boomshell.
  - Score increases based on enemy points (e.g., 10-30 points per enemy).
  - Level increases at score thresholds (e.g., 100, 250, 450), boosting bullet streams (e.g., 1 stream at level 1, 2 at level 2).
  - Enemies increase in difficulty (health, speed) with level.
- **Responsive Design**: 
  - Canvas size adjusts to fit the screen (e.g., max 800x600px, scaled to 95% of width or 80% of height).
  - Touch controls appear on screens smaller than 600px.
- **Styling**: 
  - Page background: dark gray (e.g., #333).
  - Canvas background: solid sky blue (e.g., #87CEEB).
  - Buttons: green (e.g., #4CAF50) with hover effect (e.g., #45a049).
  - Overlay screens (start, pause, game over): semi-transparent black (e.g., rgba(0, 0, 0, 0.8)) with white text.
- **Single File**: Combine all HTML, CSS (in `<style>`), and JavaScript (in `<script>`) into one `.html` file, requiring no external dependencies beyond the Google Fonts link.

Output:
- Provide the full `.html` file as a single code block that I can copy, save as `skyfight.html`, and run directly in a web browser.
- Include comments in the code to explain key sections (e.g., game loop, player controls, enemy spawning, high score management).

The result should be a fully functional, retro-style 2D shooter game where the player pilots a ship, fights