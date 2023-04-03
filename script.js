// Select relevant HTML elements
const form = document.getElementById('form'); // Get the form element
const input = document.getElementById('new-item'); // Get the input element
const todoList = document.getElementById('todo-list'); // Get the todo list element
const archiveBtn = document.getElementById('archive'); // Get the archive button element
const refreshIcon = document.querySelector('.fa-refresh'); // Get the refresh icon element
const downArrowIcon = document.querySelector('.fa-level-down'); // Get the down arrow icon element

// Define tasks array and get tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get the tasks from local storage, if any, or initialize an empty array

// Define functions
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the tasks array to local storage
}

function renderTasks() {
  todoList.innerHTML = ''; // Clear current todo list
  // Render new todo list based on updated tasks array
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${
        task.completed ? 'checked' : ''
      } data-index="${index}">
      <span>${task.description}</span>
      <i class="fa fa-ellipsis-v"></i>
      <i class="fa fa-trash"></i>
    `;
    li.classList.toggle('completed', task.completed);
    todoList.appendChild(li); // Add the new list item to the todo list
  });
}

function addItem(e) {
  e.preventDefault(); // Prevent the form from submitting and refreshing the page
  if (input.value) {
    const newTask = {
      description: input.value,
      completed: false,
      index: tasks.length,
    };
    tasks.push(newTask); // Add the new task to the tasks array
    saveTasks(); // Save the updated tasks array to local storage
    renderTasks(); // Render the updated todo list
    input.value = ''; // Clear the input field
  }
}

function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed); // Filter out completed tasks from the tasks array
  updateTasksIndexes(); // Update the task indexes
  saveTasks(); // Save the updated tasks array to local storage
  renderTasks(); // Render the updated todo list
}

function refreshPage() {
  window.location.reload(); // Reload the page
}

function editTask(index, newDescription) {
  tasks[index].description = newDescription; // Update the task description
  saveTasks(); // Save the updated tasks array to local storage
  renderTasks(); // Render the updated todo list
}

function updateTasksIndexes() {
  tasks.forEach((task, index) => {
    task.index = index; // Update the task index
  });
  saveTasks(); // Save the updated tasks array to local storage
}

function deleteTask(index) {
  tasks.splice(index, 1); // Remove the task at the given index from the tasks array
  updateTasksIndexes(); // Update the task indexes
  saveTasks(); // Save the updated tasks array to local storage
  renderTasks(); // Render the updated todo list
}

// This function is called when a task's description is double-clicked and allows the user to edit the description
function editTaskDescription(e) {
  // Find the closest li element to the double-clicked element
  const li = e.target.closest('li');
  // Find the span element within the li element
  const span = li.querySelector('span');
  // Get the value of the "index" attribute of the input element within the li element
  const { index } = li.querySelector('input').dataset;
  // Allow the user to edit the task description by setting the "contentEditable" attribute of the span element to true and focusing on it
  span.setAttribute('contentEditable', true);
  span.focus();
  // When the user presses the Enter key, blur the span element to save the changes
  span.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      span.blur();
    }
  });
  // When the span element loses focus, check if the new description is empty, and if not, update the task description
  span.addEventListener('blur', () => {
    const newDescription = span.textContent.trim();
    if (newDescription === '') {
      deleteTask(index);
    } else {
      editTask(index, newDescription);
    }
  });
}
// This function is called when a user clicks on a task or its associated icons
function toggleItem(e) {
  // Find the closest li element to the clicked element
  const li = e.target.closest('li');
  if (li) {
    // Toggle the "selected" class of the li element
    li.classList.toggle('selected');
    // Find the ellipsis and trash icons within the li element
    const ellipsisIcon = li.querySelector('.fa-ellipsis-v');
    const trashIcon = li.querySelector('.fa-trash');
    if (li.classList.contains('selected')) {
      // If the li element has the "selected" class, hide the ellipsis icon and show the trash icon
      ellipsisIcon.style.display = 'none';
      trashIcon.style.display = 'block';
      trashIcon.style.cursor = 'pointer';
    } else {
      // If the li element does not have the "selected" class, show the ellipsis icon and hide the trash icon
      ellipsisIcon.style.display = 'block';
      trashIcon.style.display = 'none';
    }
  }
  // If the clicked element is an input element, update the completed status of the task
  if (e.target.tagName === 'INPUT') {
    const { index } = e.target.dataset;
    tasks[index].completed = e.target.checked;
    saveTasks();
    renderTasks();
  } else if (e.target.classList.contains('fa-ellipsis-v')) {
    // If the clicked element is the ellipsis icon, move the task up one position in the list
    const item = e.target.parentNode;
    const prev = item.previousElementSibling;
    todoList.insertBefore(item, prev);
    updateTasksIndexes();
  } else if (e.target.classList.contains('fa-trash')) {
    // If the clicked element is the trash icon, delete the task
    const item = e.target.parentNode;
    const { index } = item.querySelector('input').dataset;
    deleteTask(index);
  }
}
// Add event listeners to various elements on the page
form.addEventListener('submit', addItem);
todoList.addEventListener('click', toggleItem);
todoList.addEventListener('dblclick', editTaskDescription);
archiveBtn.addEventListener('click', clearCompleted);
refreshIcon.addEventListener('click', refreshPage);
downArrowIcon.addEventListener('click', addItem);
// Render the initial tasks on the page when it loads
renderTasks();
