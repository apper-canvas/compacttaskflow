import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Icon definitions
const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash2');
const EditIcon = getIcon('Edit');
const XIcon = getIcon('X');
const CheckIcon = getIcon('Check');
const CircleIcon = getIcon('Circle');
const CheckCircleIcon = getIcon('CheckCircle');
const ArrowUpCircleIcon = getIcon('ArrowUpCircle');
const AlertCircleIcon = getIcon('AlertCircle');
const ClipboardListIcon = getIcon('ClipboardList');
const FilterIcon = getIcon('Filter');
const SearchIcon = getIcon('Search');
const SortAscIcon = getIcon('ArrowUpDown');

function MainFeature({ onTasksUpdate }) {
  // Task state
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');
  
  // Filter & sorting state
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // UI state
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  // Use ref to store the latest onTasksUpdate callback
  // This prevents infinite render loops with the useEffect dependency array
  const onTasksUpdateRef = useRef(onTasksUpdate);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Update the ref with the latest callback
    onTasksUpdateRef.current = onTasksUpdate;
    
    // Notify parent component about task updates
    // Using the ref prevents adding onTasksUpdate to the dependency array
    if (onTasksUpdateRef.current) {
      onTasksUpdateRef.current();
    }
  }, [tasks]); // Only depend on tasks

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (newTask.trim() === '') {
      toast.error("Task title cannot be empty");
      return;
    }
    
    const newTaskObj = {
      id: Date.now().toString(),
      title: newTask.trim(),
      description: taskDescription.trim(),
      priority: taskPriority,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [newTaskObj, ...prevTasks]);
    setNewTask('');
    setTaskDescription('');
    setTaskPriority('medium');
    setIsFormExpanded(false);
    
    toast.success("Task added successfully");
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };

  // Toggle task completion status
  const handleToggleComplete = (id) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, isCompleted: !task.isCompleted } 
          : task
      )
    );
  };

  // Start editing a task
  const handleStartEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
  };

  // Save edited task
  const handleSaveEdit = (id) => {
    if (editValue.trim() === '') {
      toast.error("Task title cannot be empty");
      return;
    }
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              title: editValue.trim(),
              description: editDescription.trim(),
              priority: editPriority 
            } 
          : task
      )
    );
    
    setEditingId(null);
    toast.success("Task updated");
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Filter tasks based on current filters and search query
  const filteredTasks = tasks.filter(task => {
    // Apply status filter
    const statusMatch = 
      filterStatus === 'all' || 
      (filterStatus === 'completed' && task.isCompleted) || 
      (filterStatus === 'active' && !task.isCompleted);
    
    // Apply search filter
    const searchMatch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Sort tasks based on current sort order
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt); 
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      default:
        return 0;
    }
  });

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="badge-priority-high badge flex items-center gap-1">
            <ArrowUpCircleIcon className="h-3 w-3" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="badge-priority-medium badge flex items-center gap-1">
            <AlertCircleIcon className="h-3 w-3" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="badge-priority-low badge flex items-center gap-1">
            <CircleIcon className="h-3 w-3" />
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="task-manager relative">
      {/* Header area with title and filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center">
          <ClipboardListIcon className="h-6 w-6 mr-2 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">My Tasks</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-60 rounded-lg border border-surface-200 dark:border-surface-700 
                bg-white dark:bg-surface-800 focus:ring-primary"
            />
          </div>
          
          {/* Filter dropdown */}
          <div className="relative">
            <div className="flex items-center">
              <FilterIcon className="h-4 w-4 mr-1 text-surface-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-2 px-3 appearance-none rounded-lg border border-surface-200 dark:border-surface-700 
                  bg-white dark:bg-surface-800 focus:ring-primary"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          {/* Sort dropdown */}
          <div className="relative">
            <div className="flex items-center">
              <SortAscIcon className="h-4 w-4 mr-1 text-surface-500" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="py-2 px-3 appearance-none rounded-lg border border-surface-200 dark:border-surface-700 
                  bg-white dark:bg-surface-800 focus:ring-primary"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task creation form */}
      <motion.div 
        className="mb-8 task-card overflow-hidden"
        animate={{ height: isFormExpanded ? 'auto' : '60px' }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleAddTask} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Create New Task</h3>
            <button
              type="button"
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              className="text-surface-500 hover:text-primary transition-colors"
              aria-label={isFormExpanded ? "Collapse form" : "Expand form"}
            >
              {isFormExpanded ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <PlusIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          {isFormExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="taskTitle" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="taskTitle"
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full"
                  maxLength={100}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="taskDescription" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                  Description (optional)
                </label>
                <textarea
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Add details about this task..."
                  className="w-full min-h-[80px]"
                  maxLength={500}
                />
              </div>
              
              <div>
                <label htmlFor="taskPriority" className="block text-sm font-medium mb-1 text-surface-700 dark:text-surface-300">
                  Priority
                </label>
                <select
                  id="taskPriority"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full md:w-60"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <div className="flex justify-end pt-2">
                <motion.button
                  type="submit"
                  className="btn-primary flex items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Task
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
      
      {/* Task list */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="task-card text-center py-8"
          >
            <div className="flex flex-col items-center justify-center text-surface-500">
              <ClipboardListIcon className="h-12 w-12 mb-3 opacity-40" />
              <h3 className="text-lg font-medium mb-1">No tasks found</h3>
              <p className="text-sm max-w-md mx-auto">
                {searchQuery || filterStatus !== 'all' 
                  ? "Try changing your search or filter settings"
                  : "Click the + button above to create your first task"}
              </p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {sortedTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`task-card relative ${
                  task.isCompleted ? 'bg-opacity-60 dark:bg-opacity-60' : ''
                }`}
              >
                {editingId === task.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full"
                      autoFocus
                    />
                    
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Task description (optional)"
                      className="w-full min-h-[60px]"
                    />
                    
                    <div className="flex items-center">
                      <label htmlFor={`edit-priority-${task.id}`} className="mr-2 text-sm">
                        Priority:
                      </label>
                      <select
                        id={`edit-priority-${task.id}`}
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="w-full sm:w-40"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={handleCancelEdit}
                        className="btn-outline text-sm flex items-center"
                      >
                        <XIcon className="h-3 w-3 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="btn-primary text-sm flex items-center"
                      >
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className={`mt-1 flex-shrink-0 text-surface-400 hover:text-primary transition-colors ${
                            task.isCompleted ? 'text-secondary' : ''
                          }`}
                          aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
                        >
                          {task.isCompleted ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            <CircleIcon className="h-5 w-5" />
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <h3 
                            className={`text-base font-medium mb-1 ${
                              task.isCompleted 
                                ? 'line-through text-surface-500 dark:text-surface-500' 
                                : 'text-surface-800 dark:text-surface-200'
                            }`}
                          >
                            {task.title}
                          </h3>
                          
                          {task.description && (
                            <p 
                              className={`text-sm mb-2 break-words ${
                                task.isCompleted 
                                  ? 'text-surface-500 dark:text-surface-500' 
                                  : 'text-surface-600 dark:text-surface-400'
                              }`}
                            >
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-surface-500">
                            {getPriorityBadge(task.priority)}
                            
                            <span className="text-xs">
                              Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(task)}
                          className="p-1 text-surface-400 hover:text-primary transition-colors"
                          aria-label="Edit task"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                          aria-label="Delete task"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

export default MainFeature;