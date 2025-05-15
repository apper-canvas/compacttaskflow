import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  const HomeIcon = getIcon('Home');
  const CheckCircleIcon = getIcon('CheckCircle');
  const ClockIcon = getIcon('Clock');
  const ListTodoIcon = getIcon('ListTodo');
  
  useEffect(() => {
    // Simulate loading tasks from storage
    const timeout = setTimeout(() => {
      const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
      
      setStats({
        total: savedTasks.length,
        completed: savedTasks.filter(task => task.isCompleted).length,
        pending: savedTasks.filter(task => !task.isCompleted).length
      });
      
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, []);

  // Handle task updates to refresh statistics
  const handleTaskUpdate = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    setStats({
      total: savedTasks.length,
      completed: savedTasks.filter(task => task.isCompleted).length,
      pending: savedTasks.filter(task => !task.isCompleted).length
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* App Header */}
      <header className="relative py-6 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-primary to-secondary-dark text-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <ListTodoIcon className="h-8 w-8 mr-3" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">TaskFlow</h1>
            </div>
            <p className="text-sm md:text-base text-white text-opacity-90">
              Organize your tasks efficiently and boost your productivity
            </p>
          </div>
        </div>
      </header>

      {/* Dashboard Area */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Cards */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-surface-800 dark:text-surface-100">Your Task Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Tasks Card */}
            <motion.div 
              className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Tasks</p>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={`total-${stats.total}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-3xl font-bold mt-1"
                    >
                      {isLoading ? '-' : stats.total}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="p-3 bg-primary bg-opacity-10 dark:bg-opacity-20 rounded-xl">
                  <ListTodoIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </motion.div>
            
            {/* Completed Tasks Card */}
            <motion.div 
              className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Completed</p>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={`completed-${stats.completed}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-3xl font-bold mt-1 text-secondary-dark"
                    >
                      {isLoading ? '-' : stats.completed}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="p-3 bg-secondary bg-opacity-10 dark:bg-opacity-20 rounded-xl">
                  <CheckCircleIcon className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </motion.div>
            
            {/* Pending Tasks Card */}
            <motion.div 
              className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Pending</p>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={`pending-${stats.pending}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-3xl font-bold mt-1 text-accent"
                    >
                      {isLoading ? '-' : stats.pending}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="p-3 bg-accent bg-opacity-10 dark:bg-opacity-20 rounded-xl">
                  <ClockIcon className="h-6 w-6 text-accent" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Main Task Management Feature */}
        <MainFeature onTasksUpdate={handleTaskUpdate} />
      </main>
      
      {/* App Footer */}
      <footer className="py-6 px-4 mt-10 bg-surface-100 dark:bg-surface-800 text-center text-surface-600 dark:text-surface-400 text-sm">
        <div className="max-w-7xl mx-auto">
          <p>TaskFlow - Your Productivity Companion</p>
          <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </footer>
    </motion.div>
  );
}

export default Home;