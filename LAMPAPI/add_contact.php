<?php

	error_reporting(E_ALL);
	ini_set('display_errors', 'on');

	$inData = getRequestInfo();
	$zero = 0;
    // $contact_id = $inData["contactId"];
    $user_id = $inData["userId"];
	$fname = $inData["firstName"];
	$lname = $inData["lastName"];
    $email = $inData["email"];
	$pnum = $inData["phoneNumber"];

    // FIXME
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_list_app_db");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into contact_list (user_id, firstname, lastname, email, phone_number) VALUES(?,?,?,?,?)");
		$stmt->bind_param("issss", $user_id, $fname, $lname, $email, $phone_number);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
?>