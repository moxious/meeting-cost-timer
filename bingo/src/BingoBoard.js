import React, { useState } from 'react';
import './BingoBoard.css';

const BingoBoard = () => {
  // Initialize the BINGO board with random phrases
  const generateBoard = () => {
    const phrases = [
      "need to jump",
      "synergy", "proactive", "out of the box", "best practice", "low hanging fruit",
      "quick win", "alignment", "incentivize", "can-do attitude", "back of the envelope",
      "blue sky thinking", "value added", "elevator pitch", "practive", "deep dive",
      "drink the kool-aid", "rockstar", "touch base", "the ask", "hit the ground running",
      "leverage", "lots of moving parts", "no bandwidth", "on the same page", "best practice",
      "peel the onion", "in the loop", "in the weeds", "paradigm shift", "it is what it is",
      "circle back", "ninja", "no brainer", "take this offline", "ducks in a row", "silos",
      "share my screen", "sorry I'm late", "can you hear me?",
      "can you please mute", "circle back", "gotta run", 
    ];
    
    const board = [];
    const usedPhrases = new Set();
    
    // Generate 5x5 board with random phrases, no duplicates
    for (let row = 0; row < 5; row++) {
      const rowPhrases = [];
      for (let col = 0; col < 5; col++) {
        // Center position (2,2) is FREE space
        if (row === 2 && col === 2) {
          rowPhrases.push('FREE');
        } else {
          let phrase;
          do {
            phrase = phrases[Math.floor(Math.random() * phrases.length)];
          } while (usedPhrases.has(phrase));
          usedPhrases.add(phrase);
          rowPhrases.push(phrase);
        }
      }
      board.push(rowPhrases);
    }
    
    return board;
  };

  const [board, setBoard] = useState(generateBoard());
  const [marked, setMarked] = useState(Array(5).fill().map(() => Array(5).fill(false)));

  const handleClick = (row, col) => {
    // Don't allow clicking on the FREE space
    if (board[row][col] === 'FREE') return;
    
    const newMarked = marked.map(row => [...row]);
    newMarked[row][col] = !newMarked[row][col];
    setMarked(newMarked);
  };

  const resetBoard = () => {
    setBoard(generateBoard());
    setMarked(Array(5).fill().map(() => Array(5).fill(false)));
  };

  return (
    <div className="bingo-container">
      <h1>BINGO</h1>
      <button className="reset-button" onClick={resetBoard}>
        New Game
      </button>
      <div className="bingo-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="bingo-row">
            {row.map((phrase, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`bingo-cell ${marked[rowIndex][colIndex] ? 'marked' : ''} ${
                  phrase === 'FREE' ? 'free-space' : ''
                }`}
                onClick={() => handleClick(rowIndex, colIndex)}
                disabled={phrase === 'FREE'}
              >
                {phrase}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingoBoard;
