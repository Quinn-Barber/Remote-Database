<?php

	$inData = getRequestInfo();
	error_reporting(E_ALL);
	ini_set('display_errors', 'on');

	$searchResults = "";
	$searchCount = 0;
	$debugStr = "XXXXXX";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_list_app_db");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// check to see if information in contact_list also has the same firstname from the cookie
		// $stmt = $conn->prepare("SELECT * FROM contact_list WHERE firstname LIKE ? AND user_id = ?");
		// $searchTerm = $inData["search"];			//CHANGED: was $inData["query"];
		// $stmt->bind_param("si", $searchTerm, $inData["userId"]);	//	$colorName changed to $searchTerm from prototype
		// $stmt->execute();
		// $result = $stmt->get_result();
		
		$userId = $inData["userID"];
		$searchTerm = $inData["search"];

		$stmt = $conn->prepare("select * from contact_list where user_id=?");	//FIXME attempted to mimic populate_landingpage, remove if desired and uncomment the lines directly above (18-21)
		$stmt->bind_param("i", $userId);										//FIXME attempted to mimic populate_landingpage, remove if desired and uncomment the lines directly above (18-21)
		$stmt->execute();														//FIXME attempted to mimic populate_landingpage, remove if desired and uncomment the lines directly above (18-21)
		$result = $stmt->get_result();											//FIXME attempted to mimic populate_landingpage, remove if desired and uncomment the lines directly above (18-21)


		while($row = $result->fetch_assoc())
		{
			if($searchCount % 2) continue;

			if($searchCount > 0)	//TODO: Also compare to other fields : compareStrings($searchTerm, $row["firstname"])
			{
				$searchResults .= ",";
			}

			$searchCount++;
				$searchResults .= '"' . $row["firstname"] .','. $row["lastname"] .','. $row["phone_number"] . ','. $row["email"] . '"';	//CHANGED: to a more complete version from landingpage.html

			// if(compareStrings($searchTerm, $row["firstname"], $row["lastname"], $row["phone_number"], $row["email"])) //FIXME syntax?
			// {
				
			// }
			
			
			
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

	function compareStrings($submit, $storedFirst, $storedLast, $storedPhone, $storedEmail)
	{
		$goal = strtolower($submit);
		$first = strtolower($storedFirst);
		$last = strtolower($storedLast);
		//phone number should be fine?
		$mail = strtolower($storedEmail);

		if(strpos($goal, $first))
		{
			return true;
		}
		elseif(strpos($goal, $last))
		{
			return true;
		}
		elseif(strpos($goal, $storedPhone))
		{
			return true;
		}
		elseif(strpos($goal, $mail))
		{
			return true;
		}
		else
		{
			return false;
		}

	}
	
?>
