document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    let restaurantToken = Cookies.get("restaurant_token");
    let educationToken = Cookies.get("education_token");
    
    if (!restaurantToken && !educationToken) {
        // not logged in - redirect to login
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }
    
    let profileInfo = document.getElementById("profileInfo");
    
    let storedUser = localStorage.getItem('restaurant_user');
    
    if (storedUser) {
        storedUser = JSON.parse(storedUser);
        profileInfo.innerHTML = `
            <h3>Welcome, ${storedUser.firstName} ${storedUser.lastName}!</h3>
            <p>Email: ${storedUser.email}</p>
            <p>Account Type: Restaurant User</p>
        `;
    } else if (educationToken) {
        fetch("https://api.everrest.educata.dev/auth", {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": `Bearer ${educationToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            profileInfo.innerHTML = `
                <h3>Welcome, ${data.firstName} ${data.lastName}!</h3>
                <p>Email: ${data.email}</p>
                <p>Account Type: Education Platform User</p>
            `;
        })
        .catch(error => {
            profileInfo.innerHTML = `<p>Welcome! (Education account connected)</p>`;
        });
    } else {
        profileInfo.innerHTML = `<p>Welcome! You are logged in.</p>`;
    }
    
});

// Logout function
function logout() {
    // Clear all tokens
    Cookies.remove("restaurant_token");
    Cookies.remove("education_token");
    
    alert("Logged out successfully");
    window.location.href = "index.html";
}