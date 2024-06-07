function loginUser(username, password) {
    const formData = {
        username: username,
        password: password
    };

    axios.post('http://localhost:8080/user/login', formData)
        .then(response => {
            localStorage.setItem('accessToken', response.data.accessToken);
            console.log(response);
            window.location.href = '../Dashboard/dashboard.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to login. Please try again.');
        });
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        loginUser(username, password); 
    });
});

