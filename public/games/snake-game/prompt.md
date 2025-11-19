# Prompt Used to Generate Snake Game

```
Create a classic Snake game with these features:
- 600x600 canvas with black background
- Green snake that starts with 1 segment
- Red food appears randomly on the grid
- Arrow keys control snake direction (up, down, left, right)
- Snake grows by 1 segment when eating food
- Score increases by 10 points per food eaten
- Game ends if snake hits walls or itself
- Display current score and high score (save to localStorage)
- Food appears at grid positions (not random pixels)
- Grid-based movement (20x20 grid cells)
- High score persists across game sessions
- Restart button after game over
- Visual feedback with colors (green snake, red food)
- Smooth animations
```

## AI Model Output

The AI generated a fully functional Snake game with:

- Grid-based collision detection and movement
- Score tracking with localStorage persistence
- Visual distinction between snake head and body
- Proper food generation on grid intersections
- Direction validation to prevent reverse movement
- Clean, retro visual style with neon colors
- Responsive controls with arrow key handling

## Notes

- Total file size: Single HTML file with embedded CSS and JavaScript
- No external dependencies required
- Uses Canvas API for rendering
- Grid-based mechanics for consistent gameplay
- Includes localStorage for high score persistence
