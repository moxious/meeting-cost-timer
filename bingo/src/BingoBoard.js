import React, { useState } from 'react';
import './BingoBoard.css';

const BingoBoard = () => {
  const BOARD_VERSION = 2; // Increment this when phrases change
  
  // Initialize the BINGO board with BINGO column structure
  const generateBoard = () => {
    const phrases = {
      B: [
        "need to jump", "synergy", "proactive", "out of the box", "best practice", "low hanging fruit",
      ],
      I: [
        "low hanging fruit", "quick win", "alignment", "value added", "touch base", "mission critical",
      ],
      N: [
        "peel the onion", "in the loop", "in the weeds", "paradigm shift", "realign",
      ],
      G: [
        "leverage", "lots of moving parts", "bandwidth", "on the same page", "best practice",
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

  const [board, setBoard] = useState(() => {
    // Check if saved board version matches current version
    const savedVersion = localStorage.getItem('bingoBoardVersion');
    const savedBoard = localStorage.getItem('bingoBoardState');
    
    if (savedBoard && savedVersion === String(BOARD_VERSION)) {
      try {
        return JSON.parse(savedBoard);
      } catch (e) {
        console.log('Failed to parse saved board state, generating new board');
      }
    }
    // Generate new board if no saved state exists or version mismatch
    const newBoard = generateBoard();
    localStorage.setItem('bingoBoardVersion', String(BOARD_VERSION));
    localStorage.setItem('bingoBoardState', JSON.stringify(newBoard));
    return newBoard;
  });
  
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
    
    // Save both board and marked state to localStorage
    localStorage.setItem('bingoBoardVersion', String(BOARD_VERSION));
    localStorage.setItem('bingoBoardState', JSON.stringify(board));
    localStorage.setItem('bingoMarkedState', JSON.stringify(newMarked));
  };

  const resetBoard = () => {
    const newBoard = generateBoard();
    setBoard(newBoard);
    const newMarked = Array(5).fill().map(() => Array(5).fill(false));
    setMarked(newMarked);
    
    // Save the new board and clear the marked state
    localStorage.setItem('bingoBoardVersion', String(BOARD_VERSION));
    localStorage.setItem('bingoBoardState', JSON.stringify(newBoard));
    localStorage.setItem('bingoMarkedState', JSON.stringify(newMarked));
  };

  return (
    <div className="bingo-container">
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
      <button className="reset-button" onClick={resetBoard}>
        New Game
      </button>
    </div>
  );
};

export default BingoBoard;
