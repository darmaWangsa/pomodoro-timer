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

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev === 0) {
            if (minutes === 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsBreakTime((prev) => !prev);
              if (!isBreakTime) {
                setMinutes(breakMinutes);
                setSeconds(0);
              } else {
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
    fetchQuote();
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full text-center space-y-6">
        {/* Quote Section */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-inner">
          <p className="text-lg italic text-gray-700 mb-3">{`"${quote}"`}</p>
          <button
            onClick={handleNewQuote}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-200"
          >
            New Quote
          </button>
        </div>

        {/* Task Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-800">
            Task Name
          </label>
          <input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={handleTaskNameChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Display Task Name */}
        {taskName && (
          <h2 className="text-2xl font-semibold text-gray-800">{taskName}</h2>
        )}

        {/* Timer */}
        <div className="flex items-center justify-center bg-gray-800 text-white rounded-full w-48 h-48 mx-auto shadow-lg font-mono text-4xl md:text-6xl">
          {formatTime(minutes)}:{formatTime(seconds)}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleStartPause}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-lg font-semibold transition"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-lg font-semibold transition"
          >
            Reset
          </button>
        </div>

        {/* Duration Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Work Duration (min)
            </label>
            <input
              type="number"
              min={1}
              value={workMinutes}
              onChange={handleWorkChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Break Duration (min)
            </label>
            <input
              type="number"
              min={1}
              value={breakMinutes}
              onChange={handleBreakChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={`mt-4 text-xl font-semibold ${
            isBreakTime ? "text-blue-500" : "text-green-500"
          }`}
        >
          {isBreakTime ? "Break Time!" : "Work Time!"}
        </div>
      </div>
    </div>
  );
}
