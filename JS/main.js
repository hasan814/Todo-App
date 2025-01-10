const deleteAllBtn = document.getElementById("delete-all-btn");
const alertMessage = document.getElementById("alert-message");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-btn");
const todosBody = document.querySelector("tbody");

let todos = [];

try {
  todos = JSON.parse(localStorage.getItem("todos")) || [];
} catch (error) {
  console.error("Error parsing todos from localStorage:", error);
  todos = [];
}

const generateUniqueId = () => {
  return `${Date.now()}`;
};

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
  todos.forEach((todo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${todo.task || "No Task Name"}</td>
      <td>${todo.date || "No Date"}</td>
      <td>${todo.complete ? "Completed" : "Pending"}</td>
      <td>
        <button onClick="editHandler('${todo.id}')">Edit</button>
        <button onClick="toggleHandler('${todo.id}')">${
      todo.complete ? "Undo" : "Do"
    }</button>
        <button onClick="deleteHandler('${todo.id}')">Delete</button>
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
    id: generateUniqueId(),
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

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleared Successfully", "success");
  } else {
    showAlert("No Todos to Clear!", "error");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo deleted successfully!", "success");
};

const toggleHandler = (id) => {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, complete: !todo.complete } : todo
  );
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo status updated successfully!", "success");
};

const editHandler = (id) => {
  const todoToEdit = todos.find((todo) => todo.id === id);

  if (!todoToEdit) {
    showAlert("Todo not found!", "error");
    return;
  }

  taskInput.value = todoToEdit.task;
  dateInput.value = todoToEdit.date;

  addButton.textContent = "Update";
  addButton.removeEventListener("click", addHandler);
  addButton.addEventListener("click", () => updateHandler(id));
};

const updateHandler = (id) => {
  const updatedTask = taskInput.value.trim();
  const updatedDate = dateInput.value;

  if (!updatedTask) {
    showAlert("Please enter a valid todo!", "error");
    return;
  }

  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, task: updatedTask, date: updatedDate } : todo
  );
  saveToLocalStorage();

  displayTodos();

  taskInput.value = "";
  dateInput.value = "";

  addButton.textContent = "Add";
  addButton.removeEventListener("click", updateHandler);
  addButton.addEventListener("click", addHandler);

  showAlert("Todo updated successfully!", "success");
};

const filterButtons = document.querySelectorAll(".filter-todos");

const filterHandler = (filterType) => {
  let filteredTodos = [];
  if (filterType === "all") filteredTodos = todos;
  else if (filterType === "pending")
    filteredTodos = todos.filter((todo) => !todo.complete);
  else if (filterType === "completed")
    filteredTodos = todos.filter((todo) => todo.complete);
  displayFilteredTodos(filteredTodos);
};

const displayFilteredTodos = (filteredTodos) => {
  todosBody.innerHTML = "";
  if (filteredTodos.length === 0) {
    todosBody.innerHTML = "<tr><td colspan='4'>No Task Found!</td></tr>";
    return;
  }
  filteredTodos.forEach((todo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${todo.task || "No Task Name"}</td>
      <td>${todo.date || "No Date"}</td>
      <td>${todo.complete ? "Completed" : "Pending"}</td>
      <td>
        <button onClick="editHandler('${todo.id}')">Edit</button>
        <button onClick="toggleHandler('${todo.id}')">DO</button>
        <button onClick="deleteHandler('${todo.id}')">Delete</button>
      </td>
    `;
    todosBody.appendChild(row);
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const filterType = event.target.getAttribute("data-filter");
    filterHandler(filterType);
  });
});

addButton.addEventListener("click", addHandler);
deleteAllBtn.addEventListener("click", deleteAllHandler);

window.addEventListener("load", displayTodos);
