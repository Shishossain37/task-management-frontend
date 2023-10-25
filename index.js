let tasks = [];

const taskManagerContainer = document.querySelector(".taskManager");

document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmit);
document.getElementById('registerForm').addEventListener('submit', handleRegisterFormSubmit);





async function handleLoginFormSubmit(event) {
    event.preventDefault();
    console.log("handle Login Form");
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://task-management-backend-is6g.onrender.com/user/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            const userRole = data.user.role;
            if (userRole === 'admin') {
                window.location.href = 'admin-page.html';
            } else {
                window.location.href = 'task-manager.html';
            }
            } else {
            console.error('Failed to log in');
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

async function handleRegisterFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('https://task-management-backend-is6g.onrender.com/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        console.log(response);

        if (response.ok) {
            showLoginForm()
        } else {
            console.error('Failed to register');
        }
    } catch (error) {
        console.error('Error registering:', error);
    }
}


function showRegisterForm() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function showLoginForm() {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
}

async function initialize() {
    try {
        console.log("go to task app");
    } catch (error) {
        console.error('Error initializing tasks:', error);
    }
}

window.onload = initialize;


