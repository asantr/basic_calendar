<?php
    ini_set("session.cookie_httponly", 1);
    require 'database.php';
    //header("Content-Type: application/json");
    $username = htmlentities($_POST['username']);
    $cal_name = htmlentities($_POST['cal_name']);
    $cal_color = htmlentities($_POST['cal_color']);
    $username_two = htmlentities($_POST['username_two']);
        
    $stmt = $mysqli->prepare("insert into calendars (cal_name, username, username_two, cal_color) values (?,?,?,?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Could not create calendar. Please Try again"
        ));
        exit;
    }
    
    $stmt->bind_param('ssss', $cal_name, $username, $username_two, $cal_color);
    
    $stmt->execute();
    
    $stmt->close();
    
    echo json_encode(array(
                "success" => true
        ));
    exit;
?>