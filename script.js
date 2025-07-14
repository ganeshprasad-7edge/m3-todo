// Toggle modal visibility when adding/editing tasks
function toggleModal() {
  const modal = document.getElementById('taskModal');
  modal.classList.toggle('hidden');
}

// Display a toast notification that automatically disappears after 3 seconds
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;

  // Show toast and animate it sliding in from top
  toast.classList.remove('hidden');
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', '-translate-y-8');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  // Hide toast after 3 seconds with slide-out animation
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', '-translate-y-8');

    // Completely hide toast after animation finishes
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 500);
  }, 3000);
}

// Track which task is currently being edited
let editingTaskSpan = null; // null indicates we're in "add new task" mode

// Load saved tasks from browser storage when page loads
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
  const taskList = document.getElementById('taskList');
  tasks.forEach(task => {
    const li = createTaskItem(task.text);
    if (task.completed) {
      li.setChecked(true);
    }
    taskList.appendChild(li);
  });
}

// Save current tasks to browser storage
function saveTasks() {
  const taskList = document.getElementById('taskList');
  const tasks = Array.from(taskList.children).map(li => ({
    text: li.querySelector('.task-text').textContent,
    completed: li.isChecked()
  }));
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

// Create a new task list item with checkbox, text, edit and delete buttons
function createTaskItem(taskText) {
  const li = document.createElement('li');
  li.className = 'bg-gray-100 p-4 rounded flex justify-between items-center';

  // Create task item HTML structure
  li.innerHTML = `
    <div class="flex items-center space-x-4">
      <img class="checkbox-img w-5 h-5 cursor-pointer" src="checkbox-blank-circle.png" alt="checkbox" />
      <span class="task-text text-black text-lg">${taskText}</span>
    </div>
    <div class="task-actions flex items-center space-x-4">
      <button title="Edit" class="cursor-pointer">
        <img src="edit.png" alt="Edit" class="w-5 h-5" />
      </button>
      <button title="Delete" class="delete-btn cursor-pointer">
        <img src="trash-2.png" alt="Delete" class="w-5 h-5" />
      </button>
    </div>
  `;

    // Get references to task item elements
    const checkboxImg = li.querySelector('.checkbox-img');
    const taskSpan = li.querySelector('.task-text');
    const taskActions = li.querySelector('.task-actions');
    const deleteBtn = li.querySelector('.delete-btn');
    let isChecked = false;

    // Handle task deletion
    deleteBtn.addEventListener('click', () => {
        li.remove();
        saveTasks();
        showToast('Task deleted successfully');
    });

    // Handle task completion toggling
    checkboxImg.addEventListener('click', () => {
        const taskList = document.getElementById('taskList');
        isChecked = !isChecked;
        if (isChecked) {
            checkboxImg.src = 'checkbox-circle-line.png';
            taskSpan.classList.add('line-through', 'text-gray-400');
            taskActions.style.visibility = 'hidden';
            taskActions.style.pointerEvents = 'none';
            // Move to bottom
            taskList.appendChild(li);
        } else {
            checkboxImg.src = 'checkbox-blank-circle.png';
            taskSpan.classList.remove('line-through', 'text-gray-400');
            taskActions.style.visibility = 'visible';
            taskActions.style.pointerEvents = 'auto';
            // Move to top (before first completed task)
            const firstCompleted = Array.from(taskList.children).find(item => item.isChecked());
            if (firstCompleted) {
                taskList.insertBefore(li, firstCompleted);
            }
        }
        saveTasks();
    });

    // Methods to get/set task completion status
    li.isChecked = () => isChecked;
    li.setChecked = (checked) => {
        isChecked = checked;
        if (checked) {
            checkboxImg.src = 'checkbox-circle-line.png';
            taskSpan.classList.add('line-through', 'text-gray-400');
            taskActions.style.visibility = 'hidden';
            taskActions.style.pointerEvents = 'none';
        }
    };

    // Handle task editing
    const editBtn = li.querySelector('button[title="Edit"]');
    editBtn.addEventListener('click', () => {
      // Prepare modal for editing
      editingTaskSpan = taskSpan;
      document.getElementById('todoInput').value = taskSpan.textContent;

      // Show save button and hide add button
      document.getElementById('addBtn').classList.add('hidden');
      document.getElementById('saveBtn').classList.remove('hidden');

      // Show the modal
      toggleModal();
    });

    return li;
}

// Handle adding new tasks
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  const taskText = input.value.trim();
  if (!taskText) return;

  const taskList = document.getElementById('taskList');
  const li = createTaskItem(taskText);
  taskList.insertBefore(li, taskList.firstChild);

  saveTasks();
  input.value = '';
  toggleModal();
  showToast('Task added successfully!');
});

// Handle saving edited tasks
document.getElementById('saveBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  const newText = input.value.trim();

  if (newText && editingTaskSpan) {
    editingTaskSpan.textContent = newText;
    saveTasks();
    showToast('Task updated successfully');
  }

  // Reset the form state
  editingTaskSpan = null;
  input.value = '';

  // Restore button visibility
  document.getElementById('addBtn').classList.remove('hidden');
  document.getElementById('saveBtn').classList.add('hidden');

  toggleModal();
});

// Update the date display with today's date
function setTodaysDate() {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);
  
  // Update all date display elements
  const dateElements = document.querySelectorAll('#date');
  dateElements.forEach(element => {
    element.textContent = formattedDate;
  });
}

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', () => {
  setTodaysDate();
  loadTasks();
});
