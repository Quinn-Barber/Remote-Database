const urlBase = 'http://poostproject.xyz/LAMPAPI';
const extension = 'php';

const form = document.querySelector("body"),
pwShowHide = document.querySelectorAll(".eye-icon");
    
function doLogin()
{
    userId = 0;
    firstName = "";
    lastName = "";
    
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:login,password:password};
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
        
                if( userId < 1 )
                {		
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
        
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();
    
                window.location.href = "color.html";
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

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
