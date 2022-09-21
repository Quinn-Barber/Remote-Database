const urlBase = 'http://www.poostproject.xyz/LAMPAPI'; // poostproject.xyz -- does DNS work here, or should IP be used?
const extension = 'php';

let pageNum = 0;
let userId = 0;
let firstName = "";
let lastName = "";

function addContact()
{
	readCookie();
	let firstname = document.getElementById("fname").value;
	let lastname = document.getElementById("lname").value;
	let pnum = document.getElementById("pnumber").value;
	let email = document.getElementById("email").value;

	let tmp = {userID: userId, firstName: firstname, lastName: lastname, phoneNumber: pnum, email: email};
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);
	let url = urlBase + '/add_contact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // pass cookie here?
	
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
                window.location.href = "../html/landingpage.html";
            }
        };

        xhr.send(jsonPayload);

    }catch(err)
    {
		console.log(err);
        console.log("error");
    }
}

function editContact(id)
{

}

function deleteContact(id)
{
	readCookie();
	let idx = id;
	var res = idx.replace(/\D/g, "");
	idx = res;

	firstName = document.getElementById("fNameVal" + idx).innerHTML;
	lastName = document.getElementById("lNameVal" + idx).innerHTML;
	phoneNumber = document.getElementById("phoneNumVal" + idx).innerHTML;
	email = document.getElementById("eMailVal" + idx).innerHTML;

	// sanity check
	console.log()
	console.log(firstName);
	console.log(email);

	let tmp = {userID: userId, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, email, email};
	let payload = JSON.stringify(tmp);
	console.log(payload);
	let url = urlBase + "/remove_contact." + extension;

	let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                // let jsonObject = JSON.parse(xhr.responseText);
                // console.log(jsonObject);
				
				console.log("successfully deleted contact!");
				fetchContacts();

                // window.location.href = "/index.html";
            }
        };

        xhr.send(jsonPayload);

    }catch(err)
    {
        console.log("error");
    }
}

function doSearch()
{
	let id = readCookie().userId; // get the userID from the cookie and pass through
	// pass cookie through GET request to ensure search can search according to logged-in user; only userID?
	let query = document.getElementById("searchField").value; // searchfield does not yet exist
	let tmp = {search: query, userID: id};
	let payload = JSON.stringify(tmp);
	console.log(payload);
	let url = urlBase + '/search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try{}
	catch(err)
	{}
}

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

                window.location.href = "/index.html";
            }
        };

        xhr.send(jsonPayload);

    }catch(err)
    {
        console.log("error");
    }
}

function fetchContacts()
{
	readCookie();
	console.log("getting contacts for userID: " + userId);

	let tmp = {userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/populate_landingpage.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log(xhr.responseText);
				let jsonObject = JSON.parse( xhr.responseText );
				console.log(jsonObject);
				document.getElementById("pageNum").innerHTML = "Page 1/" + (Math.floor(jsonObject.results.length/6)+1);
				for(let i = 0; i < jsonObject.results.length; i++)
				{
					var elId = i % 6;
					var resultsArr = jsonObject.results[i].split(',');
					let fName = resultsArr[0];
					let lName = resultsArr[1];
					let phoneNum = resultsArr[2];
					let eMail = resultsArr[3];
					let fStr = "fName";
					let lStr = "lName";
					let pStr = "phoneNum";
					let eStr = "eMail";
					let eButStr = "edit";
					let dButStr = "delete";
					document.getElementById(new String(fStr + elId)).innerHTML = "First Name";
					document.getElementById(new String(lStr + elId)).innerHTML = "Last Name";
					document.getElementById(new String(pStr + elId)).innerHTML = "Phone Number";
					document.getElementById(new String(eStr + elId)).innerHTML = "E-mail";
					document.getElementById(new String(fStr + "Val" + elId)).innerHTML = fName;
					document.getElementById(new String(lStr + "Val" + elId)).innerHTML = lName;
					document.getElementById(new String(pStr + "Val" + elId)).innerHTML = phoneNum;
					document.getElementById(new String(eStr + "Val" + elId)).innerHTML = eMail;
					document.getElementById(new String(eButStr + elId)).removeAttribute("hidden");
					document.getElementById(new String(dButStr + elId)).removeAttribute("hidden");
					if(elId == 5) break;
				}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		// document.getElementById("loginResult").innerHTML = err.message;
	}
}

function changePage(nextPage = true)
{
	readCookie();
	if(nextPage){
		pageNum++;
		console.log("Updating next page contacts for userID: " + userId);
	}
	else{
		pageNum--;
		console.log("Updating previous page contacts for userID: " + userId);
	}

	let tmp = {userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/populate_landingpage.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				console.log(xhr.responseText);
				let jsonObject = JSON.parse( xhr.responseText );
				console.log(jsonObject);
				if(pageNum*6 >= jsonObject.results.length || pageNum < 0){
					if(nextPage){
						console.log("No info this far");
						pageNum--;
					}
					else{
						console.log("No info before this");
						pageNum++;
					}
					return;
				}
				document.getElementById("pageNum").innerHTML = "Page " + (pageNum+1) + "/" + (Math.floor(jsonObject.results.length/6)+1);
				for(let i = 0; i < 6; i++){
					let fStr = "fName";
					let lStr = "lName";
					let pStr = "phoneNum";
					let eStr = "eMail";
					let eButStr = "edit";
					let dButStr = "delete";
					document.getElementById(new String(fStr + i)).innerHTML = " ";
					document.getElementById(new String(lStr + i)).innerHTML = " ";
					document.getElementById(new String(pStr + i)).innerHTML = " ";
					document.getElementById(new String(eStr + i)).innerHTML = " ";
					document.getElementById(new String(fStr + "Val" + i)).innerHTML = " ";
					document.getElementById(new String(lStr + "Val" + i)).innerHTML = " ";
					document.getElementById(new String(pStr + "Val" + i)).innerHTML = " ";
					document.getElementById(new String(eStr + "Val" + i)).innerHTML = " ";
					document.getElementById(new String(eButStr + i)).setAttribute("hidden", "hidden");
					document.getElementById(new String(dButStr + i)).setAttribute("hidden", "hidden");
				}
				for(let i = pageNum*6; i < jsonObject.results.length; i++)
				{
					var elId = i % 6;
					var resultsArr = jsonObject.results[i].split(',');
					let fName = resultsArr[0];
					let lName = resultsArr[1];
					let phoneNum = resultsArr[2];
					let eMail = resultsArr[3];
					let fStr = "fName";
					let lStr = "lName";
					let pStr = "phoneNum";
					let eStr = "eMail";
					let eButStr = "edit";
					let dButStr = "delete";
					document.getElementById(new String(fStr + elId)).innerHTML = "First Name";
					document.getElementById(new String(lStr + elId)).innerHTML = "Last Name";
					document.getElementById(new String(pStr + elId)).innerHTML = "Phone Number";
					document.getElementById(new String(eStr + elId)).innerHTML = "E-mail";
					document.getElementById(new String(fStr + "Val" + elId)).innerHTML = fName;
					document.getElementById(new String(lStr + "Val" + elId)).innerHTML = lName;
					document.getElementById(new String(pStr + "Val" + elId)).innerHTML = phoneNum;
					document.getElementById(new String(eStr + "Val" + elId)).innerHTML = eMail;
					document.getElementById(new String(eButStr + elId)).removeAttribute("hidden");
					document.getElementById(new String(dButStr + elId)).removeAttribute("hidden");
					if(elId == 5) break;
				}
				

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		// document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	// document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
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
				console.log(xhr.responseText);
				let jsonObject = JSON.parse( xhr.responseText );
				console.log(jsonObject);
				userId = jsonObject.id;
		
				if(userId < 1)
				{		
					// document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					console.log("login credentials invalid");
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "html/landingpage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log(err);
		// document.getElementById("loginResult").innerHTML = err.message;
	}

	// search for all of the contacts in the user's list (GET request)
	// returned json payload: {numberContacts, contacts{}};
	// ^^^ accomplished by onLoad() (landingpage.html) and fetchContacts()
}

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
		// window.location.href = "index.html";
	}
	else
	{
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}
