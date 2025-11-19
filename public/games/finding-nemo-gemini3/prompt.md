General Game Requirements with Storyline Integration

1. Graphics & Visual Style

✅ 2D Canvas-Based Rendering
	•	Use an HTML5 Canvas or equivalent framework for rendering.
	•	Graphics should consist of simple geometric shapes (e.g., rectangles, circles, triangles) or pixel-art sprites.
	•	Smooth animations using a frame update loop.

✅ Retro Pixel-Art Aesthetic
	•	Use a pixelated font (e.g., Press Start 2P from Google Fonts).
	•	Employ a limited color palette to match classic arcade aesthetics.
	•	Blocky, low-resolution sprites or procedurally generated shapes.
	•	Screen effects like flashes, shakes, and particles for feedback.

2. Game Storyline & Narrative Integration (If Provided)

✅ Intro & Contextual Setup
	•	If a storyline is included, start with an introductory cutscene or text-based narrative before gameplay.
	•	Use a scrolling text effect, static images, or in-game dialogue to introduce the setting.
	•	Clearly define:
	•	Main character(s) and goal
	•	Antagonist(s) and obstacles
	•	Game world or environment

✅ Progression-Based Storytelling
	•	Levels should align with the storyline:
	•	Different levels/chapters correspond to key moments in the narrative.
	•	Enemies, environments, and objectives evolve to match story progression.
	•	Dialogue & NPC interactions (if applicable):
	•	Add simple in-game dialogues to progress the story dynamically.

✅ Ending & Game Completion
	•	Ensure the final level delivers a satisfying resolution to the story.
	•	Provide a victory screen or cutscene after the final challenge.

3. Core Game Mechanics

✅ Responsive Controls
	•	Keyboard, Gamepad, or Touch Input support.
	•	Default mappings:
	•	Arrow Keys / WASD → Movement
	•	Spacebar / Tap → Primary action (e.g., attack, jump, shoot)
	•	Shift / Button Press → Secondary action (e.g., sprint, special move)

✅ Game Logic & AI
	•	Player actions: Movement, jumping, attacking, interacting with objects.
	•	Enemy AI:
	•	Basic enemies follow patrol or attack patterns.
	•	Boss enemies have special attack sequences.
	•	Collision Detection:
	•	Player interacts with objects, environment, and enemies.
	•	Health, score, or objectives update based on interactions.

✅ Sound & Effects (Web Audio API or Equivalent)
	•	Basic sound effects:
	•	Player actions (jumping, attacking, shooting).
	•	Environmental sounds (item collection, interactions).
	•	Optional Background Music (toggleable).

4. Scoring & Game Over System

✅ Score & Feedback System
	•	Points awarded for defeating enemies, collecting items, completing levels, etc.
	•	Optional: Combo system for skill-based play.

✅ Game Over & Restart Mechanism
	•	Show a Game Over screen with:
	•	Final score
	•	Story-based failure message (if applicable)
	•	“Press Enter to Restart” or return to the main menu

✅ High Score System (Local Storage)
	•	Maintain a top 10 leaderboard stored locally.
	•	Each entry includes Player Name & Score.
	•	Automatically updates if a new high score is achieved.

✅ Name Input & High Score Display
	•	Start Screen:
	•	Prompt the player to enter their name before playing.
	•	Show the high score table before gameplay.
	•	Prevent game start until a name is entered.

5. Additional Features for Better Experience

✅ Pause & Resume Feature
	•	Press ‘P’ key (keyboard) or Tap (mobile) to pause the game.
	•	Show a pause overlay when paused.

✅ Local Storage for Data Persistence
	•	Store player progress, high scores, settings, and preferences locally.
	•	Ensure data persists across game reloads.

✅ Dynamic Level Progression Based on Story
	•	Unlock new levels, abilities, or weapons as the story advances.
	•	Adapt difficulty dynamically based on story events.

6. Optional Enhancements for Future Versions

🔹 Power-Ups & Upgrades
	•	Temporary boosts (e.g., speed increase, shield, double damage).
	•	Permanent upgrades tied to story progress.

🔹 Level Checkpoints & Save System
	•	Multiple levels with increasing difficulty.
	•	Save checkpoints to prevent full restart upon failure.

🔹 Mobile-Friendly Features
	•	Touch-based controls for mobile gameplay.
	•	Responsive UI that adapts to different screen sizes.

🔹 Multiplayer & Social Integration
	•	Local or online multiplayer support.
	•	Leaderboards using cloud storage for competitive ranking.
# Storyline
Game Title: Finding Nemo: Ocean Quest

Genre: Adventure / Puzzle / Exploration
Platform: Console & PC

Story Overview:

Players control Marlin, the determined clownfish father, as he embarks on a perilous journey through the vast ocean to find his lost son, Nemo. The game is structured into levels, each with unique challenges, enemies, and puzzles inspired by the movie but with new twists.

Game Levels:

Level 1: The Coral Reef Escape
	•	Objective: Marlin and Dory must leave their safe reef to begin their journey.
	•	Challenges: Avoid predatory fish, navigate strong currents, and solve a puzzle to escape a fisherman’s net.
	•	Boss: A large barracuda that chases Marlin through a maze of coral tunnels.

Level 2: The Jellyfish Jungle
	•	Objective: Cross a dangerous jellyfish field without getting stung.
	•	Mechanics: Time-based jumps and quick reflex dodges to avoid deadly tentacles.
	•	Companion Ability: Dory can use her forgetfulness to accidentally distract jellyfish, creating safe passages.

Level 3: The Sunken Shipwreck
	•	Objective: Search for clues about Nemo’s whereabouts in a mysterious sunken ship.
	•	Challenges: Solve environmental puzzles, avoid ghostly anglerfish, and escape collapsing debris.
	•	Secret: Hidden treasure collectibles that unlock bonus content.

Level 4: The Shark Encounter
	•	Objective: Navigate through an underwater wreck while avoiding Bruce and his hungry shark friends.
	•	Mechanics: Stealth gameplay—hide in shadows and use distractions to sneak past the sharks.
	•	Boss Fight: Survive a chase sequence as Bruce goes into a feeding frenzy.

Level 5: The EAC (East Australian Current) Ride
	•	Objective: Ride the EAC with Crush and his fellow turtles to gain speed toward Sydney.
	•	Mechanics: Surf-style gameplay with dodging mechanics and boost zones.
	•	Obstacle: Time the jumps correctly to avoid being knocked off-course by stray rocks and currents.

Level 6: Sydney Harbor Rescue
	•	Objective: Find a way into the dentist’s office to locate Nemo.
	•	Challenges: Avoid fishing nets, navigate through polluted waters, and dodge seagulls trying to snatch you.
	•	Mini-game: Control Nigel the pelican to scout Nemo’s location and strategize an entry plan.

Final Level: The Great Escape & Reunion
	•	Objective: Free Nemo from the fish tank and return him to the ocean.
	•	Gameplay: A mix of stealth and teamwork—use other tank fish abilities to disable the tank filter and escape.
	•	Final Chase: Escape through the harbor while avoiding fishing boats and pelicans trying to catch Nemo.
	•	Emotional Ending: A cutscene where Marlin and Nemo reunite, followed by a bonus playable segment where they swim home together, dodging last-minute dangers.

Bonus Features:
	•	Playable Dory Mode: Unlockable after completing the game, offering a humor-filled alternate gameplay style.
	•	Secret Collectibles: Hidden sea creatures and treasure that unlock concept art and behind-the-scenes content.
	•	Hard Mode: Adds more aggressive predators and environmental hazards for experienced players.
