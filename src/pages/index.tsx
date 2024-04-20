import { useState } from 'react';
import styles from './index.module.css';

const directions = [
  [0, 0],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
];

let whiteStoneCount = 0;
let blackStoneCount = 0;

const Home = () => {
  const [turnColor, setTurn] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const getReplaceblePositons = (x: number, y: number, oppositeColor: number) => {
    const replaceblePositons: number[][] = [];
    if (board[y][x] !== 0) {
      return replaceblePositons;
    }

    directions.map((aDirectionArray) => {
      const targetStonePositions = [];
      let targetStonePosition = [y, x];

      /* eslint-disable no-constant-condition */
      while (true) {
        targetStonePosition = [
          targetStonePosition[0] + aDirectionArray[0],
          targetStonePosition[1] + aDirectionArray[1],
        ];

        if (
          board[targetStonePosition[0]] !== undefined &&
          board[targetStonePosition[0]][targetStonePosition[1]] !== undefined
        ) {
          const targetStoneColor = board[targetStonePosition[0]][targetStonePosition[1]];
          if (targetStoneColor === 0) {
            return;
          } else if (targetStoneColor === oppositeColor) {
            targetStonePositions.push(targetStonePosition);
          } else if (targetStoneColor === turnColor) {
            for (let i = 0; i < targetStonePositions.length; i++) {
              replaceblePositons.push(targetStonePositions[i]);
            }
          }
        } else {
          targetStonePosition = [x, y];
          break;
        }
      }
    });
    return replaceblePositons;
  };

  const clickHandler = (x: number, y: number) => {
    // If a stone exist, We shouldn't do something.
    if (board[y][x] !== 0) {
      return;
    }

    const oppositeColor = 3 - turnColor;
    const newBoard = structuredClone(board);
    const ReplaceblePositons = getReplaceblePositons(x, y, oppositeColor);

    if (!ReplaceblePositons.length) {
      return;
    }

    newBoard[y][x] = turnColor;

    for (let i = 0; i < ReplaceblePositons.length; i++) {
      const replacePosition = ReplaceblePositons[i];
      newBoard[replacePosition[0]][replacePosition[1]] = turnColor;
    }

    setTurn(3 - turnColor);
    setBoard(newBoard);

    // After setboard
    // We should check where opposite put stone
    // Add color to cell
    for (let i = 0; i < newBoard.length; i++) {
      const checkingArray = newBoard[i];
      for (let j = 0; j < newBoard.length; j++) {
        const checkingCell = checkingArray[j];
        checkingCell === 1 ? blackStoneCount++ : checkingCell === 2 ? whiteStoneCount++ : '';
      }
    }

    console.log(blackStoneCount, whiteStoneCount)
  };

  return (
    <div className={styles.container}>
      <div>
        {turnColor === 1 ? 'Black' : 'White'} , Black = 1, White = 2 {whiteStoneCount},
        {blackStoneCount}
      </div>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? 'black' : 'white' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
