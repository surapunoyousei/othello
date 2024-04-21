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

let isGameEnd = false;
let passCount = 0;
let wonColor = 0;

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

  const getStoneCounts = (targetColor: number) => {
    let count = 0;
    board.map((aStoneColorsArray) => {
      aStoneColorsArray.map((color) => {
        if (color === targetColor) {
          count++;
        }
      });
    });
    return count;
  };

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

  const isTherePutablePosition = (targetColor: number = 3 - turnColor) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (getReplaceblePositons(j, i, targetColor).length) {
          return true;
        }
      }
    }
    return false;
  };

  const clickHandler = (x: number, y: number, putablePositions: number[][]) => {
    if (!putablePositions.length) {
      return;
    }
    const newBoard = structuredClone(board);

    newBoard[y][x] = turnColor;
    for (let i = 0; i < putablePositions.length; i++) {
      const replacePosition = putablePositions[i];
      newBoard[replacePosition[0]][replacePosition[1]] = turnColor;
    }

    setTurn(3 - turnColor);
    setBoard(newBoard);
  };

  if (getStoneCounts(1) + getStoneCounts(2) === 64 || (passCount >= 2 && !isGameEnd)) {
    isGameEnd = true;
    if (getStoneCounts(1) > getStoneCounts(2)) {
      wonColor = 1;
    } else if (getStoneCounts(1) < getStoneCounts(2)) {
      wonColor = 2;
    } else {
      wonColor = 3;
    }
  }

  if (!isTherePutablePosition() && !isGameEnd) {
    setTurn(3 - turnColor);
    passCount++;
  }

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        {isGameEnd && (
          <div>
            <div>ゲーム終了</div>
            <div>{wonColor === 1 ? '黒色の勝ち' : wonColor === 2 ? '白色の勝ち' : '引き分け'}</div>
          </div>
        )}
        <div>
          黒色：{getStoneCounts(1)} 白色：{getStoneCounts(2)}
        </div>
        {turnColor === 1 ? '黒色のターン' : '白色のターン'}{' '}
        {`| 黒色：${getStoneCounts(1)} 白色：${getStoneCounts(2)}`}
      </div>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cell}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y, getReplaceblePositons(x, y, 3 - turnColor))}
              style={{
                background:
                  getReplaceblePositons(x, y, 3 - turnColor).length !== 0 ? 'blue' : 'none',
              }}
            >
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? 'black' : color === 2 ? 'white' : 'none' }}
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
