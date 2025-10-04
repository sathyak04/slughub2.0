'use client'; 

import { useState, useMemo } from 'react';

// Define the 7 different pastel colors using Tailwind classes
const PASTEL_COLORS = [
  'bg-pink-200 hover:bg-pink-300 text-pink-900',
  'bg-blue-200 hover:bg-blue-300 text-blue-900',
  'bg-green-200 hover:bg-green-300 text-green-900',
  'bg-yellow-200 hover:bg-yellow-300 text-yellow-900',
  'bg-purple-200 hover:bg-purple-300 text-purple-900',
  'bg-red-200 hover:bg-red-300 text-red-900',
  'bg-indigo-200 hover:bg-indigo-300 text-indigo-900',
];

// --- Types and Helpers ---

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dueTime?: string;  // Stored as "HH:MM" (military time)
  dueDate: string;   // Stored as "YYYY-MM-DD"
}

// Helper function to create a date object safely at local noon to avoid timezone issues
// This ensures that comparison and formatting are reliable.
const getDateObject = (dateStr: string) => {
    // Adding 'T12:00:00' forces the date to be interpreted at noon local time, 
    // preventing shifts due to UTC/local midnight differences.
    return new Date(dateStr + 'T12:00:00'); 
};

// Helper function to format HH:MM (military) to 12-hour AM/PM
const formatTime12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; 
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

// Helper function to get the current date in YYYY-MM-DD format
const getTodayDateString = () => new Date().toISOString().split('T')[0];

// Helper function to calculate the date 6 days from now (7 days total, including today)
const getMaxTaskDateString = () => {
  const today = getDateObject(getTodayDateString());
  today.setDate(today.getDate() + 6); // Max date is 6 days from today
  return today.toISOString().split('T')[0];
};

// Helper function to get the display name for a date
const getDayDisplayName = (dateStr: string): string => {
  const todayStr = getTodayDateString();
  
  if (dateStr === todayStr) return 'Today';

  // Calculate Tomorrow's date string safely for comparison
  const tomorrowDate = getDateObject(todayStr); 
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  if (dateStr === tomorrowStr) return 'Tomorrow';
  
  // Use the date string to create a display date object
  const date = getDateObject(dateStr); 
  
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskDate, setNewTaskDate] = useState(getTodayDateString());
  const [selectedDate, setSelectedDate] = useState(getTodayDateString()); 
  
  // Max selectable date is Today + 6 days (7 days total)
  const maxFutureDate = useMemo(() => getMaxTaskDateString(), []);

  const addTask = () => {
    if (newTaskText.trim() === '' || !newTaskDate) return;
    
    // Check if the selected date is within the allowed 7-day range
    if (newTaskDate > maxFutureDate) {
        // You might want a better UI notification here instead of console.error
        console.error("Task date cannot be more than 7 days ahead.");
        return; 
    }

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText.trim(),
      completed: false,
      dueTime: newTaskTime.trim() || undefined,
      dueDate: newTaskDate, 
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNewTaskTime('');
    setNewTaskDate(getTodayDateString());
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Create a list of only the next 7 days for the tabs
  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = getDateObject(getTodayDateString());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  // --- Task Filtering and Sorting ---
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = tasks.filter(task => task.dueDate === selectedDate);
    
    const sorted = [...filtered].sort((a, b) => {
      const timeA = a.dueTime;
      const timeB = b.dueTime;

      // 1. Completed tasks go to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // 2. Prioritize timed tasks over untimed ones
      if (timeA && !timeB) return -1;
      if (!timeA && timeB) return 1;
      
      // 3. Sort chronologically if both tasks have times
      if (timeA && timeB) {
        if (timeA < timeB) return -1;
        if (timeA > timeB) return 1;
      }
      return 0; 
    });

    return sorted;
  }, [tasks, selectedDate]);
  
  // Separate tasks for rendering
  const timedTasks = filteredAndSortedTasks.filter(t => t.dueTime && !t.completed);
  const untimedTasks = filteredAndSortedTasks.filter(t => !t.dueTime && !t.completed);
  const completedTasks = filteredAndSortedTasks.filter(t => t.completed);

  const renderTasks = (taskList: Task[], header: string) => {
      if (taskList.length === 0) return null;
      return (
          <>
              <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-100 border-b border-dashed dark:border-gray-700 pb-1">
                  {header}
              </h3>
              <ul className="space-y-3">
                  {taskList.map(task => (
                      <li
                          key={task.id}
                          className={`flex justify-between items-center p-4 rounded-lg transition duration-150 transform hover:scale-[1.01] ${
                            task.completed 
                              ? 'bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-700 shadow-sm opacity-70' 
                              : 'bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600 shadow-sm'
                          }`}
                      >
                          <div className="flex flex-col">
                              <span
                                  onClick={() => toggleComplete(task.id)}
                                  className={`cursor-pointer select-none text-lg ${
                                    task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'
                                  }`}
                              >
                                  {task.text}
                              </span>
                              {task.dueTime && (
                                  <span className={`text-sm font-semibold mt-1 ${task.completed ? 'text-green-700 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                      {formatTime12Hour(task.dueTime)}
                                  </span>
                              )}
                          </div>
                          <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-500 hover:text-white p-2 rounded-full hover:bg-red-500 transition duration-150"
                              aria-label="Delete Task"
                          >
                              &times;
                          </button>
                      </li>
                  ))}
              </ul>
          </>
      );
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl mt-12 transition-colors duration-300 todo-card">
      
      {/* Header and Title (SlugHub 🍌) */}
      <div className="flex items-center justify-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors duration-300 mr-2">
          SlugHub
        </h1>
        {/* Changed text-5xl to text-3xl to make the banana smaller */}
        <span 
          role="img" 
          aria-label="Banana Icon" 
          className="text-3xl animate-bounce" 
        >
          🍌
        </span>
      </div>
      
      {/* Date Tabs Selection - Centered 4x3 Grid Layout */}
      <div className="flex justify-center mb-6"> 
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
          <div className="grid grid-cols-4 gap-3"> 
            {upcomingDates.map((dateStr, index) => {
              const isSelected = dateStr === selectedDate;
              // Use pastel colors based on index
              const colorClasses = PASTEL_COLORS[index]; 

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    inline-block py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full
                    ${isSelected
                      ? 'bg-blue-600 text-white shadow-md' // Selected state (Blue)
                      : colorClasses // Pastel color state
                    }
                  `}
                >
                  {getDayDisplayName(dateStr)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Input Area (Task Text, Time, and Date) */}
      <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-6 shadow-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Add New Task (7-Day Limit)</h3>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="flex space-x-2">
           <input 
            type="date" 
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            aria-label="Task Due Date"
            min={getTodayDateString()} // Cannot select past dates
            max={maxFutureDate}      // Cannot select more than 7 days ahead
          />
          <input 
            type="time" 
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            aria-label="Task Due Time"
          />
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md flex-shrink-0"
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Task Display Area */}
      <h2 className="text-2xl font-extrabold mb-4 text-gray-900 dark:text-white">{getDayDisplayName(selectedDate)} Tasks</h2>

      {filteredAndSortedTasks.length === 0 ? (
          <p className="text-center text-gray-500 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-700">
              No tasks scheduled for {getDayDisplayName(selectedDate)}.
          </p>
      ) : (
          <>
              {/* 1. Timed Tasks (Incomplete) */}
              {renderTasks(timedTasks, 'Timed Tasks')}
              
              {/* 2. Untimed Tasks (Incomplete) */}
              {renderTasks(untimedTasks, 'Untimed Tasks')}

              {/* 3. Completed Tasks */}
              {renderTasks(completedTasks, 'Completed')}
          </>
      )}
    </div>
  );
}