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
    $og_fname = $inData["og_firstName"];
    $og_lname = $inData["og_lastname"];
    $og_pnum = $inData["og_phoneNumber"];
    $og_email = $inData["og_email"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_list_app_db");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
        $stmt = $conn->prepare("UPDATE contact_list SET firstname=?, lastname=?, phone_number=?, email=? WHERE user_id=? AND firstname=? AND lastname=? AND phone_number=? AND email=?");
        $stmt->bind_param("ssssissss", $fname, $lname, $pnum, $email, $user_id, $og_fname, $og_lname, $og_pnum, $og_email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Contact modified!");
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