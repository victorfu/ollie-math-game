import { useState, useEffect } from "react";
import "./MathGame.css";
import chocolatechip from "./chocolatechip.gif";
import oreo from "./oreo.gif";
import redvelvet from "./redvelvet.gif";
import crab from "./crab.gif";
import firefox from "./FIREFOX.gif";

interface BoxProps {
  value: number;
  onClick: () => void;
}

const Box: React.FC<BoxProps> = ({ value, onClick }) => (
  <div className="box" onClick={onClick}>
    {value}
  </div>
);

type GameMode = "multiplication" | "division" | "hybrid";

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
    // Determine if multiplication based on game mode
    const isMultiplication =
      gameMode === "multiplication" ||
      (gameMode === "hybrid" && Math.random() < 0.5);

    let correct: number;
    if (isMultiplication) {
      const x = 1 + Math.round(9 * Math.random());
      const y = 1 + Math.round(9 * Math.random());
      correct = x * y;
      setCorrectAnswer(correct);
      setQuestion(`${x} × ${y}`);
    } else {
      const y = 1 + Math.round(9 * Math.random());
      correct = 1 + Math.round(9 * Math.random());
      const x = y * correct;
      setCorrectAnswer(correct);
      setQuestion(`${x} ÷ ${y}`);
    }

    const correctPosition = 1 + Math.round(3 * Math.random());
    const newBoxes = new Array(4).fill(0);
    newBoxes[correctPosition - 1] = correct;

    for (let i = 0; i < 4; i++) {
      if (i !== correctPosition - 1) {
        let wrongAnswer;
        do {
          if (isMultiplication) {
            // For multiplication: generate answers up to 81 (9×9)
            wrongAnswer = 1 + Math.round(Math.random() * 81);
          } else {
            // For division: generate answers close to the correct answer
            // but still within reasonable range (±3 from correct answer)
            wrongAnswer = correct + Math.floor(Math.random() * 7) - 3;
            // Ensure the wrong answer is positive
            if (wrongAnswer <= 0)
              wrongAnswer = 1 + Math.round(Math.random() * 3);
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
            Time remaining: <span id="timeremainingvalue">{timeRemaining}</span>{" "}
            sec
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
