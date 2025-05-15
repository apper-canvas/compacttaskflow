// Task service for handling all task-related operations with the Apper backend

/**
 * Fetches all tasks from the database
 * @returns {Promise<Array>} Array of task objects
 */
export async function fetchTasks() {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "is_completed" } },
        { Field: { Name: "created_at" } }
      ],
      orderBy: [
        {
          field: "created_at",
          direction: "desc"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("task8", params);
    
    // Handle empty data gracefully
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

/**
 * Creates a new task in the database
 * @param {Object} taskData - Task data object
 * @returns {Promise<Object>} Created task object
 */
export async function createTask(taskData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Format task data according to the database schema
    const params = {
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      is_completed: false,
      created_at: new Date().toISOString()
    };
    
    const response = await apperClient.createRecord("task8", params);
    
    if (!response || !response.success || !response.data) {
      throw new Error("Failed to create task");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

/**
 * Updates an existing task in the database
 * @param {Object} taskData - Task data object with Id
 * @returns {Promise<Object>} Updated task object
 */
export async function updateTask(taskData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Format task data according to the database schema
    const params = {
      Id: taskData.Id,
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium"
    };
    
    const response = await apperClient.updateRecord("task8", params);
    
    if (!response || !response.success || !response.data) {
      throw new Error("Failed to update task");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

/**
 * Toggles the completion status of a task
 * @param {number} taskId - ID of the task to toggle
 * @returns {Promise<Object>} Updated task object
 */
export async function toggleTaskCompletion(taskId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // First, get the current task to determine its completion status
    const task = await apperClient.getRecordById("task8", taskId);
    
    if (!task || !task.data) {
      throw new Error("Task not found");
    }
    
    // Toggle the is_completed field
    const params = {
      Id: taskId,
      is_completed: !task.data.is_completed
    };
    
    const response = await apperClient.updateRecord("task8", params);
    
    if (!response || !response.success || !response.data) {
      throw new Error("Failed to update task completion status");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
}

/**
 * Deletes a task from the database
 * @param {number} taskId - ID of the task to delete
 * @returns {Promise<boolean>} Success indicator
 */
export async function deleteTask(taskId) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.deleteRecord("task8", { Id: taskId });
    
    if (!response || !response.success) {
      throw new Error("Failed to delete task");
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

/**
 * Fetches task statistics from the database
 * @returns {Promise<Object>} Task statistics object
 */
export async function fetchTaskStats() {
  try {
    const tasks = await fetchTasks();
    
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.is_completed).length,
      pending: tasks.filter(task => !task.is_completed).length
    };
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    throw error;
  }
}