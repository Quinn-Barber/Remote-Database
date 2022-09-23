<?php

	$inData = getRequestInfo();
	error_reporting(E_ALL);
	ini_set('display_errors', 'on');

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "contact_list_app_db");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// check to see if information in contact_list also has the same firstname from the cookie
		$stmt = $conn->prepare("SELECT * FROM contact_list WHERE firstname LIKE ? AND user_id=?");
		
		$searchTerm = $inData["search"];				//CHANGED: was "%" . $inData["query"] . "%"
		$stmt->bind_param("si", $searchTerm, $inData["userId"]);	//	$colorName changed to $searchTerm since it's now the value being searched for.
		$stmt->execute();

		$result = $stmt->get_result();
		echo "result is below":
		echo $result;
		
		while($row = $result->fetch_assoc())
		{
			// echo "searchCount is $searchCount, Comparing search: $searchTerm, to first name: $row["firstname"]";
			if( $searchCount > 0 )
			{
				
				$searchResults .= ",";
				
			}

			$searchCount++;
			
			$searchResults .= '"' . $row["firstname"] .','. $row["lastname"] .','. $row["phone_number"] . ','. $row["email"] . '"';	//CHANGED: to a more complete version from landingpage.html
			
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
	
?>
