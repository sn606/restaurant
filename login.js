document.getElementById("loginForm").onsubmit = function(e) {
    e.preventDefault();

    let formInfo = new FormData(e.target);
    let loginData = Object.fromEntries(formInfo);
    
    console.log("Login attempt:", loginData);
    
    let storedUser = localStorage.getItem('restaurant_user');
    
    if (storedUser) {
        storedUser = JSON.parse(storedUser);
        
        if (storedUser.email === loginData.email && 
            storedUser.password === loginData.password) {
            
            loginWithEducationAPI(loginData);
            
            Cookies.set("restaurant_token", "simulated_token_" + Date.now());
            
            alert("Login Successful! Redirecting to homepage...");
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
            
            return;
        }
    }
    
    loginWithEducationAPI(loginData);
};

function loginWithEducationAPI(loginData) {
    fetch("https://api.everrest.educata.dev/auth/sign_in", {
        method: "POST",
        headers: {
            "accept": "*/*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: loginData.email,
            password: loginData.password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`login failed: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("login successful:", data);
        Cookies.set("education_token", data.access_token);
    })
    .catch(error => {
        console.warn("login failed:", error);
    });
}

