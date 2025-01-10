const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-btn");

const todos = [];

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    task,
    date,
    complete: false,
  };
  if (task) {
    todos.push(todo);
    taskInput.value = "";
    dateInput.value = "";
  } else {
  }
  console.log(todos);
};

addButton.addEventListener("click", addHandler);
