import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Heart, MessageCircle, Users, Target, CheckSquare, Wind, 
  Play, Pause, RotateCcw, Clock, Info, Plus, X, Check,
  Moon, Sun, Menu, ArrowRight, Sparkles, Shield, Zap
} from 'lucide-react';

const MindMateLanding = () => {
  const [currentView, setCurrentView] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // Breathing Exercise Component
  const BreathingExercise = () => {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [phase, setPhase] = useState('');
    const [cycle, setCycle] = useState(0);
    const intervalRef = useRef(null);
    const navigate = useNavigate();
    const exercises = {
      box: {
        name: 'Box Breathing',
        description: 'Perfect for stress relief and focus. Used by Navy SEALs and professionals.',
        benefits: 'Reduces anxiety, improves concentration, and helps regulate the nervous system.',
        phases: [
          { name: 'Inhale', duration: 4 },
          { name: 'Hold', duration: 4 },
          { name: 'Exhale', duration: 4 },
          { name: 'Hold', duration: 4 }
        ],
        totalCycles: 8,
        color: 'bg-blue-500'
      },
      '478': {
        name: '4-7-8 Breathing',
        description: 'Natural tranquilizer for the nervous system. Great for sleep and anxiety.',
        benefits: 'Promotes relaxation, reduces anxiety, and helps with sleep onset.',
        phases: [
          { name: 'Inhale', duration: 4 },
          { name: 'Hold', duration: 7 },
          { name: 'Exhale', duration: 8 }
        ],
        totalCycles: 6,
        color: 'bg-purple-500'
      },
      deep: {
        name: 'Deep Breathing',
        description: 'Simple yet effective technique for immediate stress relief.',
        benefits: 'Lowers heart rate, reduces blood pressure, and promotes calmness.',
        phases: [
          { name: 'Inhale', duration: 6 },
          { name: 'Exhale', duration: 6 }
        ],
        totalCycles: 10,
        color: 'bg-green-500'
      }
    };

    const startExercise = (exerciseKey) => {
      const exercise = exercises[exerciseKey];
      setSelectedExercise({ key: exerciseKey, ...exercise });
      setTimeLeft(exercise.phases[0].duration);
      setPhase(exercise.phases[0].name);
      setCycle(1);
      setIsActive(true);
    };

    const toggleTimer = () => {
      setIsActive(!isActive);
    };

    const resetTimer = () => {
      setIsActive(false);
      setSelectedExercise(null);
      setTimeLeft(0);
      setPhase('');
      setCycle(0);
    };

    useEffect(() => {
      if (isActive && selectedExercise && timeLeft > 0) {
        intervalRef.current = setInterval(() => {
          setTimeLeft(time => time - 1);
        }, 1000);
      } else if (isActive && selectedExercise && timeLeft === 0) {
        // Move to next phase
        const currentPhaseIndex = selectedExercise.phases.findIndex(p => p.name === phase);
        const nextPhaseIndex = (currentPhaseIndex + 1) % selectedExercise.phases.length;
        
        if (nextPhaseIndex === 0) {
          setCycle(prev => prev + 1);
        }
        
        if (cycle >= selectedExercise.totalCycles && nextPhaseIndex === 0) {
          // Exercise complete
          setIsActive(false);
          setPhase('Complete!');
        } else {
          const nextPhase = selectedExercise.phases[nextPhaseIndex];
          setPhase(nextPhase.name);
          setTimeLeft(nextPhase.duration);
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [isActive, timeLeft, selectedExercise, phase, cycle]);

    if (!selectedExercise) {
      return (
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(exercises).map(([key, exercise]) => (
            <div key={key} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
              <div className={`w-12 h-12 ${exercise.color} rounded-lg flex items-center justify-center mb-4`}>
                <Wind className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {exercise.name}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                {exercise.description}
              </p>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 mb-4`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Benefits:</strong> {exercise.benefits}
                </p>
              </div>
              <button
                onClick={() => startExercise(key)}
                className={`w-full py-3 px-4 ${exercise.color} text-white rounded-lg hover:opacity-90 transition-opacity font-medium`}
              >
                Start Exercise
              </button>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-8 shadow-lg text-center`}>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {selectedExercise.name}
          </h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Cycle {cycle} of {selectedExercise.totalCycles}
          </p>
          
          <div className={`w-32 h-32 mx-auto rounded-full ${selectedExercise.color} flex items-center justify-center mb-6 relative`}>
            <div className="text-white text-center">
              <div className="text-3xl font-bold">{timeLeft}</div>
              <div className="text-sm opacity-80">{phase}</div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`p-3 ${selectedExercise.color} text-white rounded-full hover:opacity-90 transition-opacity`}
            >
              {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={resetTimer}
              className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} ${darkMode ? 'text-white' : 'text-gray-700'} rounded-full hover:opacity-90 transition-opacity`}
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={() => setSelectedExercise(null)}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
          >
            ← Back to exercises
          </button>
        </div>
      </div>
    );
  };

  // Daily Checklist Component
  const DailyChecklist = () => {
    const [tasks, setTasks] = useState([
      { id: 1, text: 'Drink 8 glasses of water', completed: false, category: 'health' },
      { id: 2, text: 'Take a 10-minute walk', completed: false, category: 'exercise' },
      { id: 3, text: 'Practice gratitude (3 things)', completed: false, category: 'mindfulness' },
      { id: 4, text: 'Connect with a friend/family', completed: false, category: 'social' },
      { id: 5, text: 'Read for 15 minutes', completed: false, category: 'personal' },
    ]);
    const [newTask, setNewTask] = useState('');

    const toggleTask = (id) => {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    };

    const addTask = () => {
      if (newTask.trim()) {
        setTasks([...tasks, { 
          id: Date.now(), 
          text: newTask, 
          completed: false, 
          category: 'personal' 
        }]);
        setNewTask('');
      }
    };

    const removeTask = (id) => {
      setTasks(tasks.filter(task => task.id !== id));
    };

    const completedCount = tasks.filter(task => task.completed).length;
    const progressPercentage = (completedCount / tasks.length) * 100;

    const categoryColors = {
      health: 'bg-green-100 text-green-800',
      exercise: 'bg-blue-100 text-blue-800',
      mindfulness: 'bg-purple-100 text-purple-800',
      social: 'bg-pink-100 text-pink-800',
      personal: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Daily Progress
            </h3>
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {completedCount} of {tasks.length} completed
            </span>
          </div>
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 mb-4`}>
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Today's Tasks
          </h3>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
              }`}
            />
            <button
              onClick={addTask}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-center p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              } ${task.completed ? 'opacity-60' : ''}`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : darkMode ? 'border-gray-500 hover:border-green-500' : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <span className={`flex-1 ml-3 ${task.completed ? 'line-through' : ''} ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {task.text}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${categoryColors[task.category]} mr-2`}>
                  {task.category}
                </span>
                <button
                  onClick={() => removeTask(task.id)}
                  className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Daily Goals Component
  const DailyGoals = () => {
    const [goals, setGoals] = useState([
      { id: 1, title: 'Personal Growth', description: 'Learn something new today', priority: 'high', completed: false },
      { id: 2, title: 'Health & Wellness', description: 'Exercise for 30 minutes', priority: 'medium', completed: false },
      { id: 3, title: 'Relationships', description: 'Have a meaningful conversation', priority: 'high', completed: false },
    ]);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDesc, setNewGoalDesc] = useState('');
    const [newGoalPriority, setNewGoalPriority] = useState('medium');

    const addGoal = () => {
      if (newGoalTitle.trim()) {
        setGoals([...goals, {
          id: Date.now(),
          title: newGoalTitle,
          description: newGoalDesc,
          priority: newGoalPriority,
          completed: false
        }]);
        setNewGoalTitle('');
        setNewGoalDesc('');
        setNewGoalPriority('medium');
      }
    };

    const toggleGoal = (id) => {
      setGoals(goals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      ));
    };

    const removeGoal = (id) => {
      setGoals(goals.filter(goal => goal.id !== id));
    };

    const priorityColors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-green-500 bg-green-50'
    };

    const priorityColorsDark = {
      high: 'border-l-red-500 bg-red-900/20',
      medium: 'border-l-yellow-500 bg-yellow-900/20',
      low: 'border-l-green-500 bg-green-900/20'
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg mb-6`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Set Your Daily Goals
          </h3>
          
          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="Goal title..."
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
              }`}
            />
            <textarea
              value={newGoalDesc}
              onChange={(e) => setNewGoalDesc(e.target.value)}
              placeholder="Goal description..."
              rows={2}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
              }`}
            />
            <div className="flex space-x-2">
              <select
                value={newGoalPriority}
                onChange={(e) => setNewGoalPriority(e.target.value)}
                className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'
                }`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={addGoal}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className={`border-l-4 rounded-lg p-4 ${
              darkMode ? priorityColorsDark[goal.priority] : priorityColors[goal.priority]
            } ${goal.completed ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <button
                      onClick={() => toggleGoal(goal.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                        goal.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : darkMode ? 'border-gray-500 hover:border-green-500' : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {goal.completed && <Check className="w-4 h-4" />}
                    </button>
                    <h4 className={`font-semibold ${goal.completed ? 'line-through' : ''} ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {goal.title}
                    </h4>
                  </div>
                  <p className={`ml-9 ${goal.completed ? 'line-through' : ''} ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {goal.description}
                  </p>
                </div>
                <button
                  onClick={() => removeGoal(goal.id)}
                  className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Community Connection Component
  const CommunityConnection = () => {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-lg`}>
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-white" />
          </div>
          <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Anonymous Support Community
          </h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-md mx-auto`}>
            Connect with others who understand your journey. Share experiences, offer support, 
            and find strength in community - all while maintaining your privacy and anonymity.
          </p>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-8`}>
            <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Coming Soon Features:
            </h4>
            <ul className={`text-left space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Anonymous group discussions</li>
              <li>• Peer support matching</li>
              <li>• Shared coping strategies</li>
              <li>• Daily check-in circles</li>
              <li>• Crisis support network</li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4">
            <p className="font-medium">
              🚧 This feature is currently under development
            </p>
            <p className="text-sm opacity-90 mt-1">
              We're working hard to create a safe, supportive space for our community
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Component
  const Navigation = () => (
    <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/95 backdrop-blur-sm'} border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              MindMate
            </h1>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {[
              { id: 'home', label: 'Home', icon: Heart },
              { id: 'breathing', label: 'Breathing', icon: Wind },
              { id: 'checklist', label: 'Daily Tasks', icon: CheckSquare },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'community', label: 'Community', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  currentView === id 
                    ? 'bg-blue-100 text-blue-600' 
                    : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Home Component
  const Home = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your AI Companion for
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent"> Mental Wellness</span>
          </h1>
          
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            MindMate offers empathetic AI support, guided breathing exercises, daily goal tracking, 
            and a supportive community - all designed to help you maintain mental well-being.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/chat'} // Replace with your chat route
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Chatting Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => setCurrentView('breathing')}
              className={`px-8 py-4 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold text-lg hover:bg-blue-500 hover:text-white transition-all duration-300 ${
                darkMode ? 'border-blue-400 text-blue-400 hover:bg-blue-400' : ''
              }`}
            >
              Try Breathing Exercises
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Everything You Need for Mental Wellness
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Comprehensive tools designed to support your mental health journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: MessageCircle,
              title: 'AI Chat Support',
              description: 'Get empathetic, 24/7 emotional support from our AI companion',
              color: 'bg-blue-500',
              action: () => window.location.href = '/chat'
            },
            {
              icon: Wind,
              title: 'Breathing Exercises',
              description: 'Guided breathing techniques for stress relief and relaxation',
              color: 'bg-green-500',
              action: () => setCurrentView('breathing')
            },
            {
              icon: CheckSquare,
              title: 'Daily Tasks',
              description: 'Track your daily activities and build healthy habits',
              color: 'bg-purple-500',
              action: () => setCurrentView('checklist')
            },
            {
              icon: Target,
              title: 'Goal Setting',
              description: 'Set and achieve your daily personal goals',
              color: 'bg-pink-500',
              action: () => setCurrentView('goals')
            }
          ].map((feature, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`} onClick={feature.action}>
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {feature.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat CTA Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-3xl`}>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Start Your Wellness Journey?
          </h2>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our AI companion is here to listen, support, and guide you through whatever you're facing. 
            Start a conversation and take the first step toward better mental health.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: 'Private & Secure', desc: 'Your conversations are confidential' },
              { icon: Clock, title: '24/7 Available', desc: 'Support whenever you need it' },
              { icon: Zap, title: 'Instant Response', desc: 'No waiting, immediate help' }
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <benefit.icon className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {benefit.title}
                </h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>

          <button 
            onClick={() => window.location.href = '/chat'}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
          >
            <MessageCircle className="w-6 h-6 mr-3" />
            Start Your First Conversation
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );

  const renderCurrentView = () => {
    switch(currentView) {
      case 'breathing':
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Breathing Exercises
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Take a moment to center yourself with guided breathing techniques
              </p>
            </div>
            <BreathingExercise />
          </div>
        );
      case 'checklist':
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Daily Checklist
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track your daily activities and build healthy habits
              </p>
            </div>
            <DailyChecklist />
          </div>
        );
      case 'goals':
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Daily Goals
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Set meaningful goals and track your progress
              </p>
            </div>
            <DailyGoals />
          </div>
        );
      case 'community':
        return (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Community Support
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Connect with others on similar journeys
              </p>
            </div>
            <CommunityConnection />
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation />
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b shadow-lg`}>
          <div className="px-4 py-2 space-y-1">
            {[
              { id: 'home', label: 'Home', icon: Heart },
              { id: 'breathing', label: 'Breathing', icon: Wind },
              { id: 'checklist', label: 'Daily Tasks', icon: CheckSquare },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'community', label: 'Community', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setCurrentView(id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentView === id 
                    ? 'bg-blue-100 text-blue-600' 
                    : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-t mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-pink-500" />
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                MindMate
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your mental wellness companion, always here for you.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MindMateLanding;