const form = document.querySelector("body"),
    pwShowHide = document.querySelectorAll(".eye-icon");
    

pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".loginPassword");
        
        console.log(pwFields);

        pwFields.forEach(loginPassword => {
            if(loginPassword.type === "password"){
                loginPassword.type = "text";
                eyeIcon.classList.replace("bx-show", "bx-hide");
                return;
            }
            loginPassword.type = "password";
            eyeIcon.classList.replace("bx-hide", "bx-show");
        })
    })
})
