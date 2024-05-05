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

const passCount = { 1: 0, 2: 0 };
const Home = () => {
  const [turn, setTurn] = useState(1);
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
  const toggleTurn = () => setTurn(3 - turn);
  const countStones = (color: number) => {
    let result = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] === color) {
          result++;
        }
      }
    }
    return result;
  };

  const IsTherePuttableCells = () => {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (findReplaceablePositions(x, y, turn).length) {
          return true;
        }
      }
    }
    return false;
  };

  const findReplaceablePositions = (x: number, y: number, color: number) => {
    if (board[y][x] !== 0) {
      return [];
    }

    const result: number[][][] = [];
    directions.map(([dx, dy]) => {
      const positions = [];
      let cx = x + dx,
        cy = y + dy;
      while (board[cy] !== undefined && board[cy][cx] === 3 - color) {
        positions.push([cx, cy]);
        cx += dx;
        cy += dy;
      }
      return board[cy] !== undefined && board[cy][cx] === color ? result.push(positions) : null;
    });

    return result.length ? result.flat() : [];
  };

  const clickHandler = (x: number, y: number) => {
    const positions = findReplaceablePositions(x, y, turn);
    if (!positions.length) return;
    const newBoard = structuredClone(board);
    newBoard[y][x] = turn;
    for (const [cx, cy] of positions) {
      newBoard[cy][cx] = turn;
    }

    turn === 1 ? passCount[1] = 0 : passCount[2] = 0;
    setBoard(newBoard);
    toggleTurn();
  };

  const pass = () => {
    turn === 1 ? passCount[1]++ : passCount[2]++;
    toggleTurn();
  };

  const blackStones = countStones(1),
    whiteStones = countStones(2);
  const gameEnd = blackStones + whiteStones === 64 || Object.values(passCount).some((v) => v >= 2);

  if (!IsTherePuttableCells() && !gameEnd) {
    pass();
  }

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        {gameEnd && (
          <div>
            <div>ゲーム終了</div>
            <div>
              {blackStones > whiteStones
                ? '黒の勝ち'
                : whiteStones > blackStones
                  ? '白の勝ち'
                  : '引き分け'}
            </div>
          </div>
        )}
        <div>
          黒: {blackStones} 白: {whiteStones}
        </div>
        <div>{turn === 1 ? '黒色のターン' : '白色のターン'}</div>
        <div>
          パス回数 黒: {passCount[1]} 白: {passCount[2]}
        </div>
        {!gameEnd && <button onClick={pass}>パス</button>}
      </div>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              className={styles.cell}
              style={{ background: findReplaceablePositions(x, y, turn).length ? 'blue' : 'none' }}
              onClick={() => clickHandler(x, y)}
            >
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
