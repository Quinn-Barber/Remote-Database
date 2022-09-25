const urlBase = 'http://www.poostproject.xyz/LAMPAPI'; // poostproject.xyz -- does DNS work here, or should IP be used?
const extension = 'php';

let pageNum = 0;
let userId = 0;
let firstName = "";
let lastName = "";
let modified = {};

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
    }
}

function editContact_populate()
{
	readCookie();
	modified = sessionStorage.getItem('originalContact');
	modified = JSON.parse(modified);

	let status = document.getElementById("status");
	let firstname = document.getElementById("fname");
	let lastname = document.getElementById("lname");
	let pnum = document.getElementById("pnumber");
	let email = document.getElementById("email");

	firstname.value = modified.firstName;
	lastname.value = modified.lastName;
	pnum.value = modified.phoneNumber;
	email.value = modified.email;
}

function submitEditContact()
{
	modified = sessionStorage.getItem('originalContact');
	modified = JSON.parse(modified);
	let firstname = document.getElementById("fname").value;
	let lastname = document.getElementById("lname").value;
	let pnum = document.getElementById("pnumber").value;
	let email = document.getElementById("email").value;

	let tmp = {userID: userId, og_firstName: modified.firstName, og_lastname: modified.lastName, og_phoneNumber: modified.phoneNumber, og_email: modified.email,
		   firstName: firstname, lastName: lastname, phoneNumber: pnum, email: email};

	let payload = JSON.stringify(tmp);
	console.log(payload);
	let url = urlBase + "/modify_contact." + extension;

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
				console.log("successfully modified contact!");
                window.location.href = "landingpage.html"; // redirect and refetch
            }
        };

        xhr.send(payload);

    }catch(err)
    {
        console.log(err);
    }
}

function editContact(id)
{
	readCookie();
	let idx = id;
	var res = idx.replace(/\D/g, "");
	idx = res;

	firstName = document.getElementById("fNameVal" + idx).innerHTML;
	lastName = document.getElementById("lNameVal" + idx).innerHTML;
	phoneNumber = document.getElementById("phoneNumVal" + idx).innerHTML;
	email = document.getElementById("eMailVal" + idx).innerHTML;
	modified = {userID: userId, firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, email: email};

	sessionStorage.setItem('originalContact', JSON.stringify(modified));


	window.location.href = "editContact.html";
}

function deleteContact(id)
{
	if(confirm("Press OK to Delete Contact") == false){
		return;
	}
	readCookie();
	let idx = id;
	var res = idx.replace(/\D/g, "");
	idx = res;

	firstName = document.getElementById("fNameVal" + idx).innerHTML;
	lastName = document.getElementById("lNameVal" + idx).innerHTML;
	phoneNumber = document.getElementById("phoneNumVal" + idx).innerHTML;
	email = document.getElementById("eMailVal" + idx).innerHTML;

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
				console.log("successfully deleted contact!");
                window.location.href = "landingpage.html"; // redirect and refetch
            }
        };

        xhr.send(payload);

    }catch(err)
    {
        console.log(err);
    }
}

function doSearch()
{
	readCookie();
	// let id = readCookie().userId; // get the userID from the cookie and pass through
	// pass cookie through GET request to ensure search can search according to logged-in user; only userID?
	let query = document.getElementById("searchBar").value; // searchfield does not yet exist	//CHANGED: 'searchField' into 'searchBar' to reflect existing searchbar from landingpage.html
	let tmp = {search: query, userID: userId};
	let jsonPayload = JSON.stringify(tmp);
	console.log(jsonPayload);
	let url = urlBase + '/search.' + extension;

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
				console.log("ABOUT TO ITERATE THROUGH RESULTS:");
				console.log(JSON.stringify(jsonObject.results));
 				document.getElementById("pageNum").innerHTML = "Page 1/" + (Math.floor((jsonObject.results.length)/6)+1);
				
				let blank = " \n";
				let resultCount = jsonObject.results.length-1;
				let fillerCount = Math.ceil((jsonObject.results.length)/6)*6;
				console.log("There are " + jsonObject.results.length + " results, meaning there should be " + fillerCount + " filled or empty spaces.");
				
				

				for(let i = 0; i < fillerCount; i++)
				{
					console.log("i = " + i + ", fillerCount = " + fillerCount + "  resultCount = "+ resultCount);
					var elId = i % 6;

					let fName = "gets_replaced";
					let lName = "gets_replaced";
					let phoneNum = "gets_replaced";
					let eMail = "gets_replaced";
					if(typeof(jsonObject.results[i]) == "string")
						{
						console.log("Can this|" + typeof(jsonObject.results[i]) +  "| even be printed?:  " + jsonObject.results[i]);
						var resultsArr = jsonObject.results[i].split(',');
						fName = resultsArr[0];
						lName = resultsArr[1];
						phoneNum = resultsArr[2];
						eMail = resultsArr[3];
						}
						else
						{
						fName = "MAKE_EMPTY";
						lName = "MAKE_EMPTY";
						phoneNum = "MAKE_EMPTY";
						eMail = "MAKE_EMPTY";
						}
					let fStr = "fName";
					let lStr = "lName";
					let pStr = "phoneNum";
					let eStr = "eMail";
					let eButStr = "edit";
					let dButStr = "delete";
					if(i<resultCount+1)
					{
						console.log("Filling elId = " + elId);
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
					}
					else
					{
						console.log("Blanking elId = " + elId);
						document.getElementById(new String(fStr + elId)).innerHTML = blank;
						document.getElementById(new String(lStr + elId)).innerHTML = blank;
						document.getElementById(new String(pStr + elId)).innerHTML = blank;
						document.getElementById(new String(eStr + elId)).innerHTML = blank;
						document.getElementById(new String(fStr + "Val" + elId)).innerHTML = blank;
						document.getElementById(new String(lStr + "Val" + elId)).innerHTML = blank;
						document.getElementById(new String(pStr + "Val" + elId)).innerHTML = blank;
						document.getElementById(new String(eStr + "Val" + elId)).innerHTML = blank;
						document.getElementById(new String(eButStr + elId)).hidden=true;
						document.getElementById(new String(dButStr + elId)).hidden=true;
					}
					
					if(elId == 5) break;
					
				}

			}
		};
		console.log("payload sent is "+ jsonPayload);
		xhr.send(jsonPayload); //FIXME? no longer in a "POST" //FIXME important?!?! caused an error though
	}
	catch(err)
	{
		console.log(err);
		// document.getElementById("loginResult").innerHTML = err.message;
	}
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
					document.getElementById("loginResult").innerHTML = "Username/Password Combination Incorrect";
					document.getElementById("loginName").style.backgroundColor = "lightcoral";
					document.getElementById("loginName").style.outlineColor = "#000";
					document.getElementById("loginName").style.outline = "3px solid";

					document.getElementById("loginPassword").style.backgroundColor = "lightcoral";
					document.getElementById("loginPassword").style.outlineColor = "#000";
					document.getElementById("loginPassword").style.outline = "3px solid";
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
	document.cookie = "firstName=" + firstName + "#lastName=" + lastName + "#userId=" + userId + "#expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split("#");
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