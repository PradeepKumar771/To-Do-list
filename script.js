//Get DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const historyList = document.getElementById('history-list');

// Initialize two arrays for current and completed tasks
let tasks = []; 
let history = [];

//Local Storage Functions

const saveAll = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('history', JSON.stringify(history));
};

const loadAll = () => {
    const storedTasks = localStorage.getItem('tasks');
    const storedHistory = localStorage.getItem('history');
    
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    if (storedHistory) {
        history = JSON.parse(storedHistory);
    }
    
    renderAll();
};

//Rendering Functions

const renderAll = () => {
    renderTasks();
    renderHistory();
    saveAll(); // Save after rendering
};

/**
 * Renders the active (incomplete) tasks list.
 */
const renderTasks = () => {
    taskList.innerHTML = ''; 
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('task-item');
        
        
        li.innerHTML = `
            <input type="checkbox" onchange="moveToHistory(${index})">
            <span class="task-text">${task.text}</span>
            <div class="actions">
                <button class="edit-btn" onclick="editTask(${index})" title="Edit Task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${index})" title="Delete Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
};

/**
 * Renders the completed tasks history list.
 */
const renderHistory = () => {
    historyList.innerHTML = ''; 
    history.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('task-item', 'completed');
        
        li.innerHTML = `
            <input type="checkbox" checked onchange="moveToTasks(${index})">
            <span class="task-text">${task.text}</span>
            <div class="actions">
                <button class="delete-btn" onclick="deleteHistoryTask(${index})" title="Delete History Task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        historyList.appendChild(li);
    });
};

//Core Task Manipulation Logic (CRUD)

/**
 * Moves a task from the active list to the history list (Completion).
 * @param {number} index - The index of the task in the 'tasks' array.
 */
const moveToHistory = (index) => {
    const completedTask = tasks.splice(index, 1)[0]; // Remove task from 'tasks'
    completedTask.completed = true; 
    history.push(completedTask); // Add to history
    renderAll();
};

/**
 * Moves a task from the history list back to the active list (Re-open).
 * @param {number} index - The index of the task in the 'history' array.
 */
const moveToTasks = (index) => {
    const incompleteTask = history.splice(index, 1)[0]; // Remove task from history
    incompleteTask.completed = false; 
    tasks.push(incompleteTask); // Add back to active tasks
    renderAll();
};

const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Task description cannot be empty!');
        return;
    }
    tasks.unshift({ text: taskText, completed: false }); // unshift adds to the start
    taskInput.value = '';
    renderAll();
};

const editTask = (index) => {
    const currentText = tasks[index].text;
    const newText = prompt('Edit the task:', currentText);
    if (newText !== null && newText.trim() !== '') {
        tasks[index].text = newText.trim();
        renderAll();
    }
};

const deleteTask = (index) => {
    if (confirm('Are you sure you want to delete this active task?')) {
        tasks.splice(index, 1);
        renderAll();
    }
};

const deleteHistoryTask = (index) => {
    if (confirm('Are you sure you want to delete this completed task permanently?')) {
        history.splice(index, 1);
        renderAll();
    }
};

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load all tasks on page load
document.addEventListener('DOMContentLoaded', loadAll);