// Accessing HTML elements by their IDs to perform actions on the Todo list
let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let showAllTasksButton = document.getElementById("showAllTasksButton");
let showCompletedTasksButton = document.getElementById("showCompletedTasksButton");
let showIncompleteTasksButton = document.getElementById("showIncompleteTasksButton");

// This function retrieves the todo list from localStorage (if any) and returns it as an array.
function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return []; 
    } else {
        return parsedTodoList; 
    }
}

// Initialize the todo list with the data fetched from localStorage
let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length; // Keep track of the number of tasks

// Save the current todo list to localStorage whenever this button is clicked
saveTodoButton.onclick = function () {
    localStorage.setItem("todoList", JSON.stringify(todoList));
};

// Function to display tasks on the screen based on the filtered list passed
function displayTasks(filteredTodos) {
    todoItemsContainer.innerHTML = ""; 
    for (let todo of filteredTodos) {
        createAndAppendTodo(todo); 
    }
}

// Show all tasks when the "Show All" button is clicked
showAllTasksButton.onclick = function () {
    displayTasks(todoList); 
};

// Show only completed tasks when the "Show Completed" button is clicked
showCompletedTasksButton.onclick = function () {
    let completedTasks = todoList.filter(function (todo) {
        return todo.isChecked === true; 
    });
    displayTasks(completedTasks); 
};

// Show only incomplete tasks when the "Show Incomplete" button is clicked
showIncompleteTasksButton.onclick = function () {
    let incompleteTasks = todoList.filter(function (todo) {
         // Filter tasks that are not completed
        return todo.isChecked === false;
    });
    displayTasks(incompleteTasks); 
};

// Function to handle adding a new task to the todo list
function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput"); 
    let userInputValue = userInputElement.value; // Get the value entered by the user

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;
    let newTodo = {
        text: userInputValue, 
        uniqueNo: todosCount, 
        isChecked: false
    };
    todoList.push(newTodo); // Add new task to the todo list array
    createAndAppendTodo(newTodo); // Call function to display the new task on the screen
    userInputElement.value = ""; // Clear the input field after adding the task
}

// Call onAddTodo function when the "Add Todo" button is clicked
addTodoButton.onclick = function () {
    onAddTodo();
};

// Function to handle the status change (completed/incomplete) of a task when checkbox is clicked
function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked"); 

    // Find the task in the todo list array by its unique ID
    let todoObjectIndex = todoList.findIndex(function (eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        return eachTodoId === todoId;
    });

    let todoObject = todoList[todoObjectIndex]; 

    // Toggle the task's "isChecked" property (true for completed, false for incomplete)
    todoObject.isChecked = !todoObject.isChecked;
}

// Function to edit the text of an existing task
function onEditTodo(todoId) {
    // Find the task object in the todo list array by its unique ID
    let todoObjectIndex = todoList.findIndex(function (eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        return eachTodoId === todoId;
    });

    let todoObject = todoList[todoObjectIndex]; // Get the task object

    let labelElement = document.getElementById("label" + todoObject.uniqueNo); 

    // Create an input field to allow the user to edit the task text
    let inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = todoObject.text; // Pre-fill the input with the current task text
    inputElement.classList.add("edit-input"); 

    labelElement.textContent = "";  // Clear the label text temporarily
    labelElement.appendChild(inputElement); 

    inputElement.focus(); // Automatically focus on the input field

    // Save the edited text when "Enter" is pressed or input loses focus
    inputElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            saveEdit(labelElement, inputElement, todoObject);
        }
    });
    inputElement.addEventListener("blur", function () {
        saveEdit(labelElement, inputElement, todoObject);
    });
}

// Function to save the edited task text
function saveEdit(labelElement, inputElement, todoObject) {
    let newTodoText = inputElement.value.trim(); 

    if (newTodoText !== "") {
        todoObject.text = newTodoText;
        labelElement.textContent = newTodoText;
    } else {
        alert("Task text cannot be empty!"); 
        inputElement.focus(); 
    }
}

// Function to delete a task from the todo list
function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    // Remove the task from the DOM 
    todoItemsContainer.removeChild(todoElement); 

    // Find the index of the task to be deleted in the todo list array
    let deleteElementIndex = todoList.findIndex(function (eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        return eachTodoId === todoId;
    });

    todoList.splice(deleteElementIndex, 1); 
}

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    // Create a container for the entire todo item
    let todoContainer = document.createElement("div");
    todoContainer.classList.add("todo-item-container", "d-flex", "flex-row", "align-items-center");
    todoContainer.id = todoId;
    todoItemsContainer.appendChild(todoContainer);

    // Create and append checkbox element
    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;
    inputElement.onclick = function () {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };
    inputElement.classList.add("checkbox-input");
    todoContainer.appendChild(inputElement);

    // Create and append a label container to hold the task text
    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-grow-1", "align-items-center");
    todoContainer.appendChild(labelContainer);

    // Create and append the task text label
    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label", "flex-grow-1");
    labelElement.textContent = todo.text;

    // Add 'checked' class if the task is completed
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    // Create a single container for both edit and delete icons
    let iconsContainer = document.createElement("div");
    iconsContainer.classList.add("icons-container", "d-flex", "align-items-center");
    todoContainer.appendChild(iconsContainer);

    // Create the edit icon and append it to the shared container
    let editIcon = document.createElement("i");
    editIcon.classList.add("far", "fa-edit", "edit-icon");
    editIcon.onclick = function () {
        onEditTodo(todoId);  // Inline edit functionality
    };
    iconsContainer.appendChild(editIcon);

    // Create the delete icon and append it to the shared container
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIcon.onclick = function () {
        let confirmDelete = confirm("Do you want to delete this task?");
        if (confirmDelete) {
            onDeleteTodo(todoId);
        }
    };
    iconsContainer.appendChild(deleteIcon);
}

// Iterate through the to-do list and append each task
for (let todo of todoList) {
    createAndAppendTodo(todo);
}
