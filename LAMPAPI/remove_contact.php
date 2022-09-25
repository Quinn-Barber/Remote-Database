<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 'on');

	$inData = getRequestInfo();
	$zero = 0;
    $user_id = $inData["userID"];
	$fname = $inData["firstName"];
	$lname = $inData["lastName"];
    $email = $inData["email"];
	$pnum = $inData["phoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_list_app_db");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		$stmt = $conn->prepare("DELETE from contact_list WHERE user_id=? AND firstname=? AND lastname=? AND email=? AND phone_number=?");
		$stmt->bind_param("issss", $user_id, $fname, $lname, $email, $pnum);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Contact removed!");
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