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
  [-1, -1]
];

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

  const clickHandler = (x: number, y: number) => {
    // If a stone exist, We shouldn't do something.
    if (board[y][x] !== 0) {
      return;
    }

    const oppositeColor = 3 - turnColor;
    const newBoard = structuredClone(board);

    directions.map((aDirectionArray) => {
      const log = [];
      let targetStonePosition = [y, x];

      let i = 0;
      while (i < 6) {
        targetStonePosition = [
          targetStonePosition[0] + aDirectionArray[0],
          targetStonePosition[1] + aDirectionArray[1],
        ];

        if (
          board[targetStonePosition[0]] !== undefined &&
          board[targetStonePosition[0]][targetStonePosition[1]] !== undefined
        ) {
          const targetStoneColor = newBoard[targetStonePosition[0]][targetStonePosition[1]];
          if (targetStoneColor === 0) {
            return;
          }
          else if (targetStoneColor === oppositeColor) {
            log.push(targetStonePosition);
          } else if (targetStoneColor === turnColor) {
            log.map((opponentStonePosition) => {
              newBoard[y][x] = turnColor;
              newBoard[opponentStonePosition[0]][opponentStonePosition[1]] = turnColor;
              setTurn(3 - turnColor);
            });
          }
          i++;
        } else {
          targetStonePosition = [x, y];
          break;
        }
      }
    });
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
              <div>
          {turnColor === 1 ? "Black" : "White"} , Black = 1, White = 2
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
