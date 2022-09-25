<?php

	error_reporting(E_ALL);
	ini_set('display_errors', 'on');

	$inData = getRequestInfo();
	$zero = 0;
	$uname = $inData["username"];
	$pw = $inData["password"];
	$fname = $inData["firstName"];
	$lname = $inData["lastName"];
	$pnum = $inData["phoneNumber"];

    // FIXME
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_list_app_db");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into user_list (user_id, username, password, firstname, lastname) VALUES(?,?,?,?,?)");
		$stmt->bind_param("issss", $zero, $uname, $pw, $fname, $lname);
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