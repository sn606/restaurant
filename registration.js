let allInputs = document.querySelectorAll("input");
let formButton = document.getElementById("registerbtn");

let regexData = {
    firstName: /^[A-Z]{1}[a-z]{1,8}$/,
    lastName: /^[A-Z]{1}[a-z]{2,15}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    password: /^[0-9]{5,10}$/,
}

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

document.querySelector("form").onsubmit = function(e) {
    e.preventDefault();
    alert("Registration Successful!");
};



