import { useState, useEffect } from "react";
import "./MathGame.css";
import chocolatechip from "./images/chocolatechip.gif";
import oreo from "./images/oreo.gif";
import redvelvet from "./images/redvelvet.gif";
import crab from "./images/crab.gif";
import firefox from "./images/FIREFOX.gif";

interface BoxProps {
  value: number;
  onClick: () => void;
}

const Box: React.FC<BoxProps> = ({ value, onClick }) => (
  <div className="box" onClick={onClick} style={{ userSelect: "none" }}>
    {value}
  </div>
);

type GameMode =
  | "multiplication"
  | "division"
  | "addition"
  | "subtraction"
  | "hybrid";

const gifs = [crab, redvelvet, oreo, firefox, chocolatechip];

const MathGame: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [question, setQuestion] = useState("");
  const [boxes, setBoxes] = useState<number[]>([]);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    const savedMode = localStorage.getItem("mathGameMode");
    return (savedMode as GameMode) || "hybrid";
  });
  const [endGameGif, setEndGameGif] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("mathGameMode", gameMode);
  }, [gameMode]);

  useEffect(() => {
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    setEndGameGif(randomGif);
  }, []);

  const generateQA = () => {
    // Determine operation based on game mode
    let operation: string;
    if (gameMode === "hybrid") {
      const operations = [
        "multiplication",
        "division",
        "addition",
        "subtraction",
      ];
      operation = operations[Math.floor(Math.random() * operations.length)];
    } else {
      operation = gameMode;
    }

    let correct: number;
    if (operation === "multiplication") {
      const x = 1 + Math.round(9 * Math.random());
      const y = 1 + Math.round(9 * Math.random());
      correct = x * y;
      setCorrectAnswer(correct);
      setQuestion(`${x} × ${y}`);
    } else if (operation === "division") {
      const y = 1 + Math.round(9 * Math.random());
      correct = 1 + Math.round(9 * Math.random());
      const x = y * correct;
      setCorrectAnswer(correct);
      setQuestion(`${x} ÷ ${y}`);
    } else if (operation === "addition") {
      const x = 1 + Math.round(99 * Math.random());
      const y = 1 + Math.round(99 * Math.random());
      correct = x + y;
      setCorrectAnswer(correct);
      setQuestion(`${x} + ${y}`);
    } else {
      // subtraction
      const x = 1 + Math.round(99 * Math.random());
      const y = 1 + Math.round(x * Math.random()); // Ensure y is less than x to avoid negative results
      correct = x - y;
      setCorrectAnswer(correct);
      setQuestion(`${x} - ${y}`);
    }

    const correctPosition = 1 + Math.round(3 * Math.random());
    const newBoxes = new Array(4).fill(0);
    newBoxes[correctPosition - 1] = correct;

    for (let i = 0; i < 4; i++) {
      if (i !== correctPosition - 1) {
        let wrongAnswer;
        do {
          if (operation === "multiplication") {
            wrongAnswer = 1 + Math.round(Math.random() * 81);
          } else if (operation === "division") {
            wrongAnswer = correct + Math.floor(Math.random() * 7) - 3;
            if (wrongAnswer <= 0)
              wrongAnswer = 1 + Math.round(Math.random() * 3);
          } else if (operation === "addition") {
            wrongAnswer = correct + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer <= 0)
              wrongAnswer = 1 + Math.round(Math.random() * 10);
          } else {
            // subtraction
            wrongAnswer = correct + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer <= 0)
              wrongAnswer = 1 + Math.round(Math.random() * 10);
          }
        } while (newBoxes.includes(wrongAnswer) || wrongAnswer === correct);
        newBoxes[i] = wrongAnswer;
      }
    }
    setBoxes(newBoxes);
  };

  const startGame = () => {
    if (playing) {
      window.location.reload();
    } else {
      setPlaying(true);
      setScore(0);
      setTimeRemaining(60);
      setShowGameOver(false);
      setEndGameGif("");
      generateQA();
    }
  };

  const handleBoxClick = (value: number) => {
    if (!playing) return;

    if (value === correctAnswer) {
      setScore((prev) => prev + 1);
      setShowCorrect(true);
      setTimeout(() => setShowCorrect(false), 1000);
      generateQA();
    } else {
      setShowWrong(true);
      setTimeout(() => setShowWrong(false), 1000);
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (playing && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setPlaying(false);
            setShowGameOver(true);
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
            setEndGameGif(randomGif);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [playing, timeRemaining]);

  return (
    <div>
      <div
        className="mode-selector"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "white",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <label>
          <input
            type="radio"
            value="multiplication"
            checked={gameMode === "multiplication"}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
          />
          Multiplication Only
        </label>
        <label>
          <input
            type="radio"
            value="division"
            checked={gameMode === "division"}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
          />
          Division Only
        </label>
        <label>
          <input
            type="radio"
            value="addition"
            checked={gameMode === "addition"}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
          />
          Addition Only
        </label>
        <label>
          <input
            type="radio"
            value="subtraction"
            checked={gameMode === "subtraction"}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
          />
          Subtraction Only
        </label>
        <label>
          <input
            type="radio"
            value="hybrid"
            checked={gameMode === "hybrid"}
            onChange={(e) => setGameMode(e.target.value as GameMode)}
          />
          Mixed Mode
        </label>
      </div>
      <h1>The Math Game</h1>
      <div id="container">
        <div id="score">
          Score: <span id="scorevalue">{score}</span>
        </div>
        {showCorrect && <div id="correct">Correct</div>}
        {showWrong && <div id="wrong">Try Again</div>}
        <div id="question">{question}</div>
        <div id="instruction">Click on the Correct Answer</div>
        <div id="choices">
          {boxes.map((value, index) => (
            <Box
              key={index}
              value={value}
              onClick={() => handleBoxClick(value)}
            />
          ))}
        </div>
        <div id="startreset" onClick={startGame}>
          {playing ? "Reset Game" : "Start Game"}
        </div>
        {playing && (
          <div id="timeremaining">
            <div>Time remaining:</div>
            <div id="timeremainingvalue">{timeRemaining} sec</div>
          </div>
        )}
        {showGameOver && (
          <div id="gameOver">
            <p>Game Over!</p>
            <p>Your score is: {score}</p>
            {endGameGif && (
              <img
                src={endGameGif}
                alt="celebration gif"
                style={{
                  maxWidth: "200px",
                  marginTop: "20px",
                  borderRadius: "8px",
                  position: "relative",
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathGame;
