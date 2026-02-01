let allInputs = document.querySelectorAll("input");
let formButton = document.getElementById("registerbtn");

let regexData = {
    firstName: /^[A-Z]{1}[a-z]{1,8}$/,
    lastName: /^[A-Z]{1}[a-z]{2,15}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    password: /^[0-9]{5,10}$/,
};

formButton.disabled = true;

allInputs.forEach((input) => {
    input.onkeyup = function (e) {
        let nameAttribute = e.target.attributes.name.value;
        if (regexData[nameAttribute].test(input.value)) {
            input.className = "valid";
        } else {
            input.className = "invalid";
        }

        let inputList = Array.from(allInputs);
        let isAllValid = inputList.every(input => input.classList.contains("valid"));

        formButton.disabled = !isAllValid;
    };
});

// submission
document.getElementById("registerForm").onsubmit = function(e) {
    e.preventDefault();

    let formInfo = new FormData(e.target);
    let userData = Object.fromEntries(formInfo);
    
    console.log("Registering user:", userData);
    
    localStorage.setItem('restaurant_user', JSON.stringify(userData));
    
    registerWithEducationAPI(userData);
    
    alert("Registration Successful! You can now login.");
}

function registerWithEducationAPI(userData) {
    let educationData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password,
        gender: "male",
        agreeToTerms: true
    };
    
    fetch("https://api.everrest.educata.dev/auth/sign_up", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(educationData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("registration successful:", data);
    })
    .catch(error => {
        console.warn("registration failed (continuing anyway):", error);
    });
}

