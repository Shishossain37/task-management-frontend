
let tasks = [];

const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null;
// Add event listener to the form submit event
document.getElementById('taskForm');
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = `index.html`;
}
// Fetch task when admin clicked on view Details
async function fetchTasks() {
    try {
        const response = await fetch(`http://localhost:5000/task/get/${userId}`);
        const tasksData = await response.json();
        return tasksData;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

async function updateTask(index) {
    const taskId = tasks[index]._id;

    try {
        const response = await fetch(`http://localhost:5000/task/update/${userId}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: tasks[index].text,
                completed: !tasks[index].completed,
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }),
        });

        if (response.ok) {
            const updatedTask = await response.json();
            tasks[index] = updatedTask;
            renderTasks(tasks); // Render tasks after update
        } else {
            console.error('Failed to update task');
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

async function deleteTask(index) {
    const taskId = tasks[index]._id;

    try {
        const response = await fetch(`http://localhost:5000/task/delete/${userId}/${taskId}`, {
            method: 'DELETE',

        });

        if (response.ok) {
            tasks.splice(index, 1);
            renderTasks(tasks); // Render tasks after deletion
        } else {
            console.error('Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

function renderTasks(tasks) {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskCard = document.createElement('div');
        taskCard.classList.add('taskCard');
        let classVal = task.completed ? 'completed' : 'pending';
        const textVal = task.completed ? 'Completed' : 'Pending';
        taskCard.classList.add(classVal);

        const taskText = document.createElement('p');
        taskText.innerText = task.text;

        const taskStatus = document.createElement('p');
        taskStatus.classList.add('status');
        taskStatus.innerText = textVal;

        const toggleButton = document.createElement('button');
        toggleButton.classList.add("button-box");
        const btnContentEl = document.createElement("span");
        btnContentEl.classList.add("green");
        btnContentEl.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        toggleButton.appendChild(btnContentEl);
        toggleButton.addEventListener('click', () => {
            updateTask(index);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("button-box");
        const delBtnContentEl = document.createElement("span");
        delBtnContentEl.classList.add("red");
        delBtnContentEl.innerText = 'Reject';
        deleteButton.appendChild(delBtnContentEl);
        deleteButton.addEventListener('click', () => {
            indexToBeDeleted = index;
            confirmEl.style.display = "block";
            taskManagerContainer.classList.add("overlay");
        });

        taskCard.appendChild(taskText);
        taskCard.appendChild(taskStatus);
        taskCard.appendChild(toggleButton);
        taskCard.appendChild(deleteButton);

        taskContainer.appendChild(taskCard);
    });
}

confirmedBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
    deleteTask(indexToBeDeleted);
});

cancelledBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
});

async function initialize() {
    try {
        tasks = await fetchTasks();
        renderTasks(tasks);

    } catch (error) {
        console.error('Error initializing tasks:', error);
    }
}

// Parse the query parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
console.log(userId);
fetch(`http://localhost:5000/task/get/${userId}`,)

    .then(response => response.json())
    .then(tasks => {
        console.log("task-manager", tasks);
        // Render tasks in the UI or perform other tasks related to tasks
    })
    .catch(error => {
        console.error('Error fetching user details or tasks:', error);
        // Handle the error, e.g., show an error message to the user
    });

window.onload = initialize;