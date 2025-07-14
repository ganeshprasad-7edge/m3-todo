// Global variables
let todos = [];
let todoIdCounter = 1;
let editingId = null;

// DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const stats = document.getElementById('stats');
const clearBtn = document.getElementById('clearBtn');

// localStorage keys
const TODOS_KEY = 'todos';
const COUNTER_KEY = 'todoIdCounter';

// Event listeners
addBtn.addEventListener('click', addTodo);
clearBtn.addEventListener('click', clearAllTodos);
todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// localStorage functions
function saveTodos() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    localStorage.setItem(COUNTER_KEY, todoIdCounter.toString());
}

function loadTodos() {
    const savedTodos = localStorage.getItem(TODOS_KEY);
    const savedCounter = localStorage.getItem(COUNTER_KEY);
    
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    
    if (savedCounter) {
        todoIdCounter = parseInt(savedCounter);
    }
}

function clearAllTodos() {
    if (confirm('Are you sure you want to clear all todos? This cannot be undone.')) {
        todos = [];
        todoIdCounter = 1;
        editingId = null;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Add todo function
function addTodo() {
    const todoText = todoInput.value.trim();
    
    if (todoText === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: todoIdCounter++,
        text: todoText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.push(todo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
    updateStats();
}

// Render todos function
function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.appendChild(emptyState);
        return;
    }

    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        if (editingId === todo.id) {
            todoItem.innerHTML = `
                <input type="text" class="edit-input" value="${todo.text}" id="editInput-${todo.id}">
                <div class="todo-actions">
                    <button class="action-btn save-btn" onclick="saveEdit(${todo.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="action-btn cancel-btn" onclick="cancelEdit()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        } else {
            todoItem.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <div class="todo-actions">
                    <button class="action-btn complete-btn ${todo.completed ? 'completed' : ''}" onclick="toggleComplete(${todo.id})">
                        <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editTodo(${todo.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTodo(${todo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
        
        todoList.appendChild(todoItem);
    });
}

// Toggle complete function
function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.completed = !todo.completed;
            todo.completedAt = todo.completed ? new Date().toISOString() : null;
        }
        return todo;
    });
    saveTodos();
    renderTodos();
    updateStats();
}

// Delete todo function
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        editingId = null;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Edit todo function
function editTodo(id) {
    editingId = id;
    renderTodos();
    // Focus on the edit input
    setTimeout(() => {
        const editInput = document.getElementById(`editInput-${id}`);
        if (editInput) {
            editInput.focus();
            editInput.select();
        }
    }, 0);
}

// Save edit function
function saveEdit(id) {
    const editInput = document.getElementById(`editInput-${id}`);
    const newText = editInput.value.trim();
    
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }

    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.text = newText;
            todo.updatedAt = new Date().toISOString();
        }
        return todo;
    });

    editingId = null;
    saveTodos();
    renderTodos();
    updateStats();
}

// Cancel edit function
function cancelEdit() {
    editingId = null;
    renderTodos();
}

// Handle Enter key in edit input
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && editingId && e.target.classList.contains('edit-input')) {
        saveEdit(editingId);
    }
    if (e.key === 'Escape' && editingId) {
        cancelEdit();
    }
});

// Update stats function
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const remaining = total - completed;
    
    stats.textContent = `Total: ${total} tasks • Completed: ${completed} • Remaining: ${remaining}`;
}

function toggleModal() {
  const modal = document.getElementById('taskModal');
  modal.classList.toggle('hidden');
}
// Initialize
loadTodos();
renderTodos();
updateStats();
toggleModal();