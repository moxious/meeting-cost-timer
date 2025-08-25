import React, { useState } from 'react';
import './BingoBoard.css';

const BingoBoard = () => {
  // Initialize the BINGO board with BINGO column structure
  const generateBoard = () => {
    const phrases = {
      B: [
        "need to jump", "synergy", "proactive", "out of the box", "best practice", "low hanging fruit",
      ],
      I: [
        "low hanging fruit", "quick win", "alignment", "value added",
      ],
      N: [
        "peel the onion", "in the loop", "in the weeds", "paradigm shift",
      ],
      G: [
        "leverage", "lots of moving parts", "no bandwidth", "on the same page", "best practice",
      ],
      O: [
        "share my screen", "sorry I'm late", "can you hear me?",
        "can you please mute", "circle back", "gotta run", 
      ],
    };
    
    const board = [];
    
    // Generate 5x5 board with BINGO column structure - phrases assigned in order
    for (let row = 0; row < 5; row++) {
      const rowPhrases = [];
      for (let col = 0; col < 5; col++) {
        // Center position (2,2) is FREE space
        if (row === 2 && col === 2) {
          rowPhrases.push('FREE');
        } else {
          // Determine which BINGO column this cell belongs to
          let columnKey;
          if (col === 0) columnKey = 'B';
          else if (col === 1) columnKey = 'I';
          else if (col === 2) columnKey = 'N';
          else if (col === 3) columnKey = 'G';
          else if (col === 4) columnKey = 'O';
          
          // Assign phrases in order (row by row, top to bottom)
          if (row < phrases[columnKey].length) {
            rowPhrases.push(phrases[columnKey][row]);
          } else {
            // If we run out of phrases for this column, use a fallback
            rowPhrases.push('No more phrases');
          }
        }
      }
      board.push(rowPhrases);
    }
    
    return board;
  };

  const [board, setBoard] = useState(generateBoard());
  const [marked, setMarked] = useState(() => {
    // Try to load saved marked state from localStorage
    const saved = localStorage.getItem('bingoMarkedState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log('Failed to parse saved state, using default');
      }
    }
    // Return default empty marked state if no saved state exists
    return Array(5).fill().map(() => Array(5).fill(false));
  });

  const handleClick = (row, col) => {
    // Don't allow clicking on the FREE space
    if (board[row][col] === 'FREE') return;
    
    const newMarked = marked.map(row => [...row]);
    newMarked[row][col] = !newMarked[row][col];
    setMarked(newMarked);
    
    // Save the new marked state to localStorage
    localStorage.setItem('bingoMarkedState', JSON.stringify(newMarked));
  };

  const resetBoard = () => {
    setBoard(generateBoard());
    const newMarked = Array(5).fill().map(() => Array(5).fill(false));
    setMarked(newMarked);
    
    // Clear the saved state when resetting
    localStorage.removeItem('bingoMarkedState');
  };

  return (
    <div className="bingo-container">
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
