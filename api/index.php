<?php
session_set_cookie_params(3600*24*30);
session_start();


@$http_proxy = "srv01gr.unx.sas.com:80";
@$enable_logging = true;
@$logging_db = array(
	"host" => "localhost:3306", 
	"user" => "ci360_inspector",
	"pass" => "CXfmZqwVzDpfzTKJ");



$mysql_link = new mysqli($logging_db['host'], $logging_db['user'], $logging_db['pass'], $logging_db['user']);

if ($mysql_link->connect_errno) {
    // Let's try this:
    echo "Sorry, this website is experiencing problems.";

    echo "Error: Failed to make a MySQL connection, here is why: \n";
    echo "Errno: " . $mysql_link->connect_errno . "\n";
    echo "Error: " . $mysql_link->connect_error . "\n";
    
    exit;
}

$mysql_link->query("set names 'utf8';");

return processRequest();
exit;
/**********************************************/




function getRequestParameter($parameter) {
	if($_SERVER['REQUEST_METHOD'] == "POST")
		return @$_POST[$parameter];
	else
		return @$_GET[$parameter];
}


function processRequest() {
	@header('Content-type: application/json');

	$action = getRequestParameter("action");
	//$token = getRequestParameter("token");

	if ($action == 'logSession') {
		$detail1 = getRequestParameter("detail1");
		$detail2 = getRequestParameter("detail2");
		$eventtype = getRequestParameter("eventtype");
		$eventdata = getRequestParameter("eventdata");
		logUsage($eventtype, $eventdata, $detail1, $detail2);
	}
 
	else {
		// display how to use service.
		$endpointVariables = array( "eventtype" => "ie. click, load, IdentityEvent", 
									"eventdata" => "{uri, page_title, ...}", 
									"detail1" => "uri",
									"detail2" => "PII Data");
		$serviceEndpoints = array( 	
			array( "Name" => "logSession", 
					"Description" => "....", 
					"Endpoint" => "/api?action=logSession", 
					"Variables" => $endpointVariables),
		);
		$serviceEndpointDesc = array("Service Endpoints" => $serviceEndpoints);

		echo json_encode($serviceEndpointDesc);	
	}


	return;
}





/**********************************************/
/**
*
*/
function generateRandomToken($bytes = 6){
	return base64_encode(openssl_random_pseudo_bytes($bytes));
}


function logUsage($eventType, $userPayload, $detail1, $detail2) {
	global $enable_logging;
	global $mysql_link;

	if($enable_logging == false) {
		return false; 
	}

	$userIp = (isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? "Proxy: " . ($_SERVER['HTTP_X_FORWARDED_FOR']) : $_SERVER['REMOTE_ADDR']);
	$userHost =  gethostbyaddr($_SERVER['REMOTE_ADDR']);
	$userSystem =  "Computer: " .  ($userHost != null ?  $userHost : "Unknown" ) . ". Browser: " . htmlspecialchars($_SERVER["HTTP_USER_AGENT"]) ;

	$sqlInsertQuery = "INSERT INTO ci360_inspector.demo_events (id, session,event_dttm, event_type, user_ip, user_system, user_scenario, detail1, detail2) VALUES (NULL, \"". session_id() ."\" ,CURRENT_TIMESTAMP, \"" . $eventType . "\", \"".$userIp."\",\"".$userSystem."\", \"". addslashes(json_encode($userPayload)) ."\", \"".$detail1."\",  \"".$detail2."\");";
	$mysql_link->query($sqlInsertQuery);
	return true;
}

?>