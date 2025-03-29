import { useState, useEffect } from "react";
import "./MathGame.css";

interface BoxProps {
  value: number;
  onClick: () => void;
}

const Box: React.FC<BoxProps> = ({ value, onClick }) => (
  <div className="box" onClick={onClick}>
    {value}
  </div>
);

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

  const generateQA = () => {
    const x = 1 + Math.round(9 * Math.random());
    const y = 1 + Math.round(9 * Math.random());
    const correct = x * y;
    setCorrectAnswer(correct);
    setQuestion(`${x} x ${y}`);

    const correctPosition = 1 + Math.round(3 * Math.random());
    const newBoxes = new Array(4).fill(0);
    newBoxes[correctPosition - 1] = correct;

    for (let i = 0; i < 4; i++) {
      if (i !== correctPosition - 1) {
        let wrongAnswer;
        do {
          wrongAnswer =
            (1 + Math.round(9 * Math.random())) *
            (1 + Math.round(9 * Math.random()));
        } while (newBoxes.includes(wrongAnswer));
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MathGame;
