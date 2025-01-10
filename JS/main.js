const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-btn");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");

let todos = [];
try {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
} catch (error) {
  console.error("Error parsing todos from localStorage:", error);
  todos = [];
}

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert", `alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const displayTodos = () => {
  todosBody.innerHTML = "";
  if (todos.length === 0) {
    todosBody.innerHTML = "<tr><td colspan='4'>No Task Found!</td></tr>";
    return;
  }
  todos.forEach((todo, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${todo.task || "No Task Name"}</td>
      <td>${todo.date || "No Date"}</td>
      <td>${todo.complete ? "Completed" : "Pending"}</td>
      <td>
        <button onclick="completeHandler(${index})">Edit</button>
        <button onclick="completeHandler(${index})">DO</button>
        <button onclick="deleteHandler(${index})">Delete</button>
      </td>
    `;
    todosBody.appendChild(row);
  });
};

const addHandler = () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;
  if (!task) {
    showAlert("Please enter a todo!", "error");
    return;
  }
  const todo = {
    task,
    date,
    complete: false,
  };
  todos.push(todo);
  saveToLocalStorage();
  displayTodos();
  taskInput.value = "";
  dateInput.value = "";
  showAlert("Todo added successfully!", "success");
};

addButton.addEventListener("click", addHandler);

displayTodos();
