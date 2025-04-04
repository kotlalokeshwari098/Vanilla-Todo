document.addEventListener("DOMContentLoaded", () => {
    const todoList = document.getElementById("todo-list");
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("input-todo");

    const loadTasks = () => {
        var tasks = JSON.parse(localStorage.getItem("allTodos")) || [];
        tasks.forEach(({ id, value, completed }) => {
            addTaskToDOM(id, value, completed);
        });
    }

    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll("#todo-list li").forEach((li) => {
            const value = li.querySelector(".task-text").textContent;
            const completed = li.querySelector(".task-checkbox").checked;
            const id = li.querySelector(".task-checkbox").id;
            tasks.push({ id, value, completed });
        });
        localStorage.setItem("allTodos", JSON.stringify(tasks));
    }

    const addTaskToDOM = (id, value, completed = false) => {
            var listItem = document.createElement("li");
            listItem.className = 'todo-list__item';
            listItem.innerHTML = `
                <label class="task">
                    <input id="${id}" type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
                    <span class="task-text">${value}</span>
                </label>
                <div id="${id}" class="actions">
                    <button id="${id}" class="edit-btn"><i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i></button>
                    <button id="${id}" class="delete-btn"><i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i></button>
                </div>
                `
            listItem.setAttribute("id", id);
            todoList.appendChild(listItem);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        var value = todoInput.value.trim();
        var id = "id" + Math.random().toString(16).slice(2);
        var completed = false;
        if(value) {
            addTaskToDOM(id, value, completed);
            saveTasks();
            todoInput.value = "";
        }
    }

    todoForm.addEventListener("submit", handleSubmit);

    //Checkbox functionality
    todoList.addEventListener("change", (e) => {
        if (e.target.classList.contains("task-checkbox")) {
            saveTasks();
        }
    });

    //Delete button functionality
    todoList.addEventListener("click", (e) => {
        if (e.target.closest(".delete-btn")) {
            const parentButton = e.target.parentNode;
            const li = e.target.closest("li");
            const id = li.id;
            var confirmationDiv = document.createElement('div');
            confirmationDiv.classList.add(`confirmation-text-${id}`);
            confirmationDiv.setAttribute("id", id);
            confirmationDiv.innerHTML = `
                <span>Confirm Deletion?</span> 
                <button id="${id}" class="confirm-btn yes-btn">Yes</button> 
                <button id="${id}" class="confirm-btn no-btn">No</button> 
            `;
            li.appendChild(confirmationDiv);
            var buttons = document.querySelectorAll('.confirm-btn');
            buttons.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    if (e.target.classList.contains('yes-btn')) {
                        if(li.id === btn.id) {
                            li.remove();
                            saveTasks();
                        }
                    }
                    if (e.target.classList.contains('no-btn')) {
                        if(confirmationDiv.id === btn.id) {
                            confirmationDiv.remove();
                            parentButton.disabled = false;
                        }
                    }
                });
            })
            parentButton.disabled = true;
        }
    });

    //Edit button functionality
    todoList.addEventListener("click", (e) => {
        if (e.target.closest(".edit-btn")) {
            const li = e.target.closest("li");
            const span = li.querySelector('span');
            const label = li.querySelector('label');
            const buttonContainer = li.querySelector('.actions');

            //Change the button entirely
            const id = li.querySelector(".edit-btn").id;

            buttonContainer.innerHTML = `
                <button id="${id}" class="save-btn">
                    <i class="fa-solid fa-check todo-btn save-todo-btn" style="color: #0a4d80;"></i>
                </button>
                <button id="${id}" class="delete-btn">
                    <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
                </button>
            `;

            //replace the todo text with an edit input field
            var editInput = document.createElement("input");
            editInput.setAttribute("type", "text");
            editInput.setAttribute("value", li.innerText);
            editInput.classList.add("edit-input");
            label.replaceChild(editInput, span);

            //Save the change if the Enter button is pressed while in the input field.
            editInput.addEventListener("keydown", (e) => {
                if(e.key == 'Enter') {
                    label.replaceChild(span, editInput);
                    span.innerText = editInput.value;
                    buttonContainer.innerHTML = `
                        <button id="${id}" class="edit-btn">
                            <i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i>
                        </button>
                        <button id="${id}" class="delete-btn">
                            <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
                        </button>
                    `;
                    saveTasks();
                } 
            });
        }
    });

    //Save button functionality
    todoList.addEventListener("click", (e) => {
        if(e.target.closest(".save-btn")) {
            const li = e.target.closest("li");
            const label = li.querySelector('label');
            const buttonContainer = li.querySelector('.actions');
            const id = li.querySelector(".save-btn").id;

            // //replace the todo text with an edit input field
            var editInput = document.querySelector('.edit-input');
            const span =document.createElement('span');
            span.classList.add('task-text');
            span.innerText = editInput.value;

            label.replaceChild(span, editInput);
            span.innerText = editInput.value;
            buttonContainer.innerHTML = `
                <button id="${id}" class="edit-btn">
                    <i class="fa-solid fa-pencil todo-btn edit-todo-btn" style="color: #0a4d80;"></i>
                </button>
                <button id="${id}" class="delete-btn">
                    <i class="fa-solid fa-trash-can todo-btn delete-todo-btn" style="color: #da1010;"></i>
                </button>
            `;
            saveTasks();
        }
    });

    loadTasks();
});