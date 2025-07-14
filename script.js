// Toggle modal visibility
function toggleModal() {
  const modal = document.getElementById('taskModal');
  modal.classList.toggle('hidden');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden', 'opacity-0', 'translate-y-[-30px]');
  toast.classList.add('opacity-100', 'translate-y-0');

  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-[-30px]');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 500);
  }, 3000);
}

let editingTaskSpan = null; // null = add mode

function createTaskItem(taskText) {
  const li = document.createElement('li');
  li.className = 'bg-gray-100 p-4 rounded flex justify-between items-center';

  li.innerHTML = `
    <div class="flex items-center space-x-4">
      <input type="checkbox" class="custom-radio w-5 h-5 cursor-pointer" />
      <span class="task-text text-black text-lg">${taskText}</span>
    </div>
    <div class="task-actions flex items-center space-x-4">
      <button title="Edit">
        <img src="public/edit.png" alt="Edit" class="w-5 h-5" />
      </button>
      <button title="Delete" class="delete-btn">
        <img src="public/trash-2.png" alt="Delete" class="w-5 h-5" />
      </button>
    </div>
  `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    const taskSpan = li.querySelector('.task-text');
    const taskActions = li.querySelector('.task-actions');
    const deleteBtn = li.querySelector('.delete-btn');

    // Delete logic
    deleteBtn.addEventListener('click', () => {
        li.remove(); // Removes the task
        showToast('Task deleted successfully');
    });

    // Check/Uncheck logic
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
        taskSpan.classList.add('line-through', 'text-gray-400');
        taskActions.classList.add('hidden');
        } else {
        taskSpan.classList.remove('line-through', 'text-gray-400');
        taskActions.classList.remove('hidden');
        }
    });

    const editBtn = li.querySelector('button[title="Edit"]');
    editBtn.addEventListener('click', () => {
    // Set modal to edit mode
    editingTaskSpan = taskSpan;
    document.getElementById('todoInput').value = taskSpan.textContent;

    // Toggle buttons
    document.getElementById('addBtn').classList.add('hidden');
    document.getElementById('saveBtn').classList.remove('hidden');

    // Open modal
    toggleModal();
    });

    return li;
}

// Handle add task logic
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  const taskText = input.value.trim();
  if (!taskText) return;

  const taskList = document.getElementById('taskList');
  const li = createTaskItem(taskText);
  taskList.appendChild(li);

  input.value = '';
  toggleModal();
  showToast('Task added successfully!');
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const input = document.getElementById('todoInput');
  const newText = input.value.trim();

  if (newText && editingTaskSpan) {
    editingTaskSpan.textContent = newText;
    showToast('Task updated successfully');
  }

  // Reset state
  editingTaskSpan = null;
  input.value = '';

  // Toggle buttons
  document.getElementById('addBtn').classList.remove('hidden');
  document.getElementById('saveBtn').classList.add('hidden');

  toggleModal();
});
