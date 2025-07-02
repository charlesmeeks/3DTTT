import { GameState, Player } from '../src/game.js';

describe('GameState.isValidMove', () => {
  test('rejects center space and occupied cells', () => {
    const gs = new GameState();
    expect(gs.isValidMove(1, 1, 1)).toBe(false); // center wildcard
    expect(gs.isValidMove(0, 0, 0)).toBe(true);
    gs.makeMove(0, 0, 0); // occupy
    expect(gs.isValidMove(0, 0, 0)).toBe(false);
  });
});

describe('GameState.makeMove', () => {
  test('places pieces and toggles current player', () => {
    const gs = new GameState();
    expect(gs.current).toBe(Player.RED);
    const moved = gs.makeMove(0, 0, 0);
    expect(moved).toBe(true);
    expect(gs.get(0, 0, 0)).toBe(Player.RED);
    expect(gs.current).toBe(Player.BLUE);

    // invalid move
    expect(gs.makeMove(0, 0, 0)).toBe(false);
    expect(gs.current).toBe(Player.BLUE); // unchanged

    // valid move for BLUE
    expect(gs.makeMove(0, 1, 0)).toBe(true);
    expect(gs.get(0, 1, 0)).toBe(Player.BLUE);
    expect(gs.current).toBe(Player.RED);
  });
});

describe('GameState.checkWin', () => {
  test('detects winning lines including wildcard', () => {
    const gs = new GameState();
    expect(gs.checkWin()).toBe(null);

    // Use wildcard center plus two RED pieces on diagonal
    gs.set(0, 0, 0, Player.RED);
    gs.set(2, 2, 2, Player.RED);
    expect(gs.checkWin()).toBe(Player.RED);

    // New game - direct line for BLUE
    const gs2 = new GameState();
    gs2.set(0, 0, 0, Player.BLUE);
    gs2.set(0, 1, 0, Player.BLUE);
    gs2.set(0, 2, 0, Player.BLUE);
    expect(gs2.checkWin()).toBe(Player.BLUE);
  });
});
