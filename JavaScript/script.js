const urlBase = 'http://67.205.182.117/LAMPAPI'; // http://poostproject.xyz/LAMPAPI // 'http://67.205.182.117/LAMPAPI';
const extension = 'php';

const form = document.querySelector("body"),
pwShowHide = document.querySelectorAll(".eye-icon");

function doCreate()
{    
    let username = document.getElementById("registerUsername").value;
    let password = document.getElementById("registerPassword").value;
    let firstName = document.getElementById("registerFirstName").value;
    let lastName =  document.getElementById("registerLastName").value;
    let phoneNumber = document.getElementById("registerPhoneNumber").value;

    // document.getElementById("loginResult").innerHTML = "";

    let tmp = {username:username, password:password, firstName:firstName, lastName:lastName, phoneNumber:phoneNumber};
    let jsonPayload = JSON.stringify(tmp);
    console.log(jsonPayload);
    let url = urlBase + '/create_account.' + extension;

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
                console.log(jsonObject);
                userId = jsonObject.id;
        
                if(userId < 1) // ???
                {		
                    // document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
        
                // firstName = jsonObject.firstName;
                // lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "forgotpass.html";
            }
        };

        xhr.send(jsonPayload);

    }catch(err)
    {
        console.log("error");
    }
}

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
    let url = urlBase + '/login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true); // should this be GET?
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let jsonObject = JSON.parse(xhr.responseText);
                console.log(jsonObject); // print out the contents of the response.
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

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}