document.addEventListener('DOMContentLoaded', () => {
    const userTableBody = document.getElementById('userTableBody');

    // Fetch users from the backend
    fetch('https://task-management-backend-is6g.onrender.com/admin/get', {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token') // Assuming you store the JWT token in localStorage
        }
    })
        .then(response => response.json())
        .then(users => {
            // Populate the table with user data
            // Inside the code where you populate the table with user data
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
        <td >${user._id}</td>
        <td >${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td class="actions">
            <button class="btn btn-outline-primary" onclick="editUser('${user._id}', '${user.name}', '${user.email}', '${user.role}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
            <button class="btn btn-primary" onclick="viewDetails('${user._id}')">View Details</button>

        </td>
    `;
                userTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
});
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = `index.html`;
}


function editUser(userId) {
    // Fetch user details by ID from the backend
    fetch(`https://task-management-backend-is6g.onrender.com/admin/update/${userId}`, {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token') // Assuming you store the JWT token in localStorage
        }
    })
        .then(response => response.json())
        .then(user => {
            // Populate a form or modal with user details for editing
            // For simplicity, let's log the user details to the console
            console.log('Editing user:', user);
        })
        .catch(error => {
            console.error('Error fetching user details for editing:', error);
        });
}


function deleteUser(userId) {
    // Confirm deletion with the user
    if (confirm('Are you sure you want to delete this user?')) {
        // Send a DELETE request to the backend API
        fetch(`https://task-management-backend-is6g.onrender.com/admin/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token') // Assuming you store the JWT token in localStorage
            }
        })
            .then(response => response.json())
            .then(data => {
                // console.log(document.getElementById(userId));
                console.log(data.message); // Log the delete success message
                
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    }
}


// Function to open the edit user modal and populate it with user details
function editUser(userId, userName, userEmail, userRole) {
    const modal = document.getElementById('editUserModal');
    const editUserId = document.getElementById('editUserId');
    const editUserName = document.getElementById('editUserName');
    const editUserEmail = document.getElementById('editUserEmail');
    const editUserRole = document.getElementById('editUserRole');

    // Set values in the modal
    editUserId.value = userId;
    editUserName.value = userName;
    editUserEmail.value = userEmail;
    editUserRole.value = userRole;

    // Display the modal
    modal.style.display = 'block';
}




// Function to close the edit user modal
function closeEditUserModal() {
    const modal = document.getElementById('editUserModal');
    modal.style.display = 'none';
}

// Handle edit user form submission
// Handle edit user form submission
document.getElementById('editUserForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const editedName = document.getElementById('editUserName').value;
    const editedEmail = document.getElementById('editUserEmail').value;

    // Prepare the data to be sent in the request body
    const updatedUserData = {
        name: editedName,
        email: editedEmail
    };

    // Send a PUT request to update user details
    fetch(`https://task-management-backend-is6g.onrender.com/admin/update/${userId}`, {
        method: 'PUT', // Use 'PATCH' if you want to perform a partial update
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token') // Assuming you store the JWT token in localStorage
        },
        body: JSON.stringify(updatedUserData)
    })
        .then(response => {
            if (response.ok) {
                console.log('User details updated successfully.');
                // Optionally, update the user details in the UI if needed
            } else {
                console.error('Failed to update user details.');
            }
            // Close the modal regardless of the response (success or error)
            closeEditUserModal();
        })
        .catch(error => {
            console.error('Error updating user details:', error);
        });
});

function viewDetails(userId) {
    // Redirect the admin to the task manager page with the user's ID as a query parameter
    window.location.href = `taskmanager.html?userId=${userId}`;
}

