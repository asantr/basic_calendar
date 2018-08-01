<?php   
    $mysqli = new mysqli('localhost', 'as', 'S0urd0ugh!', 'calendar');
    
    if($mysqli->connect_errno) {
        printf("Connection Failed: %s\n", $mysqli->connect_error);
        exit;
    }
?>