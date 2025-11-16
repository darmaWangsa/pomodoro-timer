import { useState, useRef, useEffect } from "react";
import { quotes } from "./quotes";

const DEFAULT_WORK_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;

export default function App() {
  const [taskName, setTaskName] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [minutes, setMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [seconds, setSeconds] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(DEFAULT_WORK_MINUTES);
  const [breakMinutes, setBreakMinutes] = useState(DEFAULT_BREAK_MINUTES);
  const [quote, setQuote] = useState("Stay focused and keep working!");

  const timerRef = useRef<number | null>(null);

  const fetchQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  // Fetch initial quote on component mount
  useEffect(() => {
    fetchQuote();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes === 0) {
              // Switch between work and break
              if (timerRef.current) clearInterval(timerRef.current);
              setIsBreakTime((prev) => !prev);
              if (!isBreakTime) {
                // Starting break
                setMinutes(breakMinutes);
                setSeconds(0);
              } else {
                // Returning to work
                setMinutes(workMinutes);
                setSeconds(0);
              }
              setIsRunning(false);
              return 0;
            }
            setMinutes((m) => m - 1);
            return 59;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, minutes, breakMinutes, workMinutes, isBreakTime]);

  const handleStartPause = () => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsBreakTime(false);
    setMinutes(workMinutes);
    setSeconds(0);
    fetchQuote(); // Fetch a new quote on reset
  };

  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setWorkMinutes(val);
      if (!isBreakTime) {
        setMinutes(val);
        setSeconds(0);
      }
    }
  };

  const handleBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setBreakMinutes(val);
      if (isBreakTime) {
        setMinutes(val);
        setSeconds(0);
      }
    }
  };

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

  const handleNewQuote = () => {
    fetchQuote();
  };

  const formatTime = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
        {/* Quote Generator */}
        <div className="mb-4">
          <p className="text-lg italic text-gray-700 mb-2">"{quote}"</p>
          <button
            onClick={handleNewQuote}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            New Quote
          </button>
        </div>

        {/* Task Name Input */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Task Name:</label>
          <input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={handleTaskNameChange}
            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Display Task Name */}
        {taskName && (
          <h2 className="text-xl mb-4 text-gray-700 font-semibold">
            {taskName}
          </h2>
        )}

        {/* Timer Display */}
        <div className="text-6xl font-mono mb-4">
          {formatTime(minutes)}:{formatTime(seconds)}
        </div>
        {/* Buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={handleStartPause}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
        {/* Work Duration */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Work Duration (minutes):
          </label>
          <input
            type="number"
            min={1}
            value={workMinutes}
            onChange={handleWorkChange}
            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Break Duration */}
        <div>
          <label className="block mb-1 font-medium">
            Break Duration (minutes):
          </label>
          <input
            type="number"
            min={1}
            value={breakMinutes}
            onChange={handleBreakChange}
            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* Status */}
        <div className="mt-4 text-lg font-semibold">
          {isBreakTime ? "Break Time!" : "Work Time!"}
        </div>
      </div>
    </div>
  );
}
