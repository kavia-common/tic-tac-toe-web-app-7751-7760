import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Ocean Professional Tic Tac Toe
 * - Modern, minimalist design
 * - Blue (#2563EB) and amber (#F59E0B) accents
 * - Centered, responsive board with status and controls
 * - Smooth transitions, rounded corners, subtle shadows
 */

// Helpers
const LINES = [
  [0, 1, 2], // rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // cols
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diags
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
export default function App() {
  /** Main application shell with game container centered on the page. */
  return (
    <div className="ocean-app">
      <div className="ocean-gradient-bg" />
      <main className="ocean-container">
        <header className="ocean-header">
          <h1 className="ocean-title">Tic Tac Toe</h1>
          <p className="ocean-subtitle">Classic 3×3 — Two players, one winner.</p>
        </header>
        <Game />
        <footer className="ocean-footer">
          <p className="ocean-footnote">
            Built with the Ocean Professional theme — modern, clean, and responsive.
          </p>
        </footer>
      </main>
    </div>
  );
}

function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const result = useMemo(() => calculateWinner(squares), [squares]);
  const draw = !result && isBoardFull(squares);

  const status = useMemo(() => {
    if (result) {
      return `Winner: ${result.winner}`;
    }
    if (draw) {
      return "It's a draw";
    }
    return `Next turn: ${xIsNext ? 'X' : 'O'}`;
  }, [result, draw, xIsNext]);

  const statusAccentClass = result
    ? result.winner === 'X'
      ? 'status-accent-primary'
      : 'status-accent-amber'
    : draw
    ? 'status-accent-neutral'
    : xIsNext
    ? 'status-accent-primary'
    : 'status-accent-amber';

  function handleSquareClick(index) {
    if (squares[index] || result) return;
    const next = squares.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <section className="game-card" aria-label="Tic Tac Toe game">
      <div className={`game-status ${statusAccentClass}`} role="status" aria-live="polite">
        {status}
      </div>

      <Board
        squares={squares}
        onClick={handleSquareClick}
        winningLine={result?.line ?? []}
        nextPlayer={xIsNext ? 'X' : 'O'}
      />

      <div className="game-controls">
        <button
          type="button"
          className="btn btn-reset"
          onClick={handleReset}
          aria-label="Reset the game"
        >
          Reset Game
        </button>
        <div className="legend">
          <span className="legend-item">
            <span className="badge badge-x">X</span> Player X
          </span>
          <span className="legend-item">
            <span className="badge badge-o">O</span> Player O
          </span>
        </div>
      </div>
    </section>
  );
}

function Board({ squares, onClick, winningLine, nextPlayer }) {
  return (
    <div
      className="board"
      role="grid"
      aria-label="Tic Tac Toe board"
      aria-describedby="board-help"
    >
      {squares.map((value, idx) => {
        const isWinning = winningLine.includes(idx);
        return (
          <Square
            key={idx}
            value={value}
            onClick={() => onClick(idx)}
            highlight={isWinning}
            nextPlayer={nextPlayer}
            aria-label={`Square ${idx + 1} ${value ? `contains ${value}` : 'is empty'}`}
          />
        );
      })}
      <p id="board-help" className="sr-only">
        Use your pointer or press Enter/Space to place your mark in an empty square.
      </p>
    </div>
  );
}

function Square({ value, onClick, highlight, nextPlayer }) {
  const hintClass = !value ? (nextPlayer === 'X' ? 'hint-x' : 'hint-o') : '';
  const valClass = value === 'X' ? 'val-x' : value === 'O' ? 'val-o' : '';
  const highlightClass = highlight ? 'square-win' : '';
  return (
    <button
      type="button"
      className={`square ${hintClass} ${valClass} ${highlightClass}`}
      onClick={onClick}
      disabled={Boolean(value)}
    >
      <span className="square-content">{value}</span>
    </button>
  );
}
