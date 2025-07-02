# 3DTTT

Prototype implementation of a 3‑D Tic‑Tac‑Toe game. The center cube acts as a wildcard counted for both players.

## Getting Started

1. Install dependencies (only used for development tooling):

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

   This serves the `src` directory at `http://localhost:8080/`.

3. Open `http://localhost:8080` in your browser.

## Gameplay

Click a cube to place the current player's piece. Red moves first. Rotate the board with the mouse. Hovering a cube shows its coordinates and the on‑screen display shows whose turn it is. When three pieces align in any direction (including across planes), a victory message appears.
