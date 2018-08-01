<?php
    session_start();
    ini_set("session.cookie_httponly", 1);
    require 'database.php';
    header("Content-Type: application/json");
    
    $username = htmlentities($_POST['username']);
    $cal_name = htmlentities($_POST["cal_name"]);
    $event_name =  htmlentities($_POST["event_name"]);
    $event_date = htmlentities($_POST["event_date"]);
    $event_time = htmlentities($_POST["event_time"]);
    
//    get user if there is a shared calendar
    $username_two = null;
    
    $sql_user = "SELECT username_two from calendars where username='$username' and cal_name='$cal_name'";
    $res_user = $mysqli->query($sql_user);
            
    while ($user = $res_user->fetch_assoc()) {
        $username_two = $user['username_two'];
    }
    
    if(is_null($username_two)){
        $sql_user_two = "SELECT username from calendars where username_two='$username' and cal_name='$cal_name'";
        $res_user_two = $mysqli->query($sql_user_two);
                
        while ($user = $res_user_two->fetch_assoc()) {
            $username_two = $user['username'];
        }
    }
    
    
    $stmt = $mysqli->prepare("insert into events (event_name, event_date, event_time, cal_name, username) values (?,?,?,?,?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Could not create event. Please Try again"
        ));
        exit;
    }
    
    $stmt->bind_param('sssss', $event_name, $event_date, $event_time, $cal_name, $username);
    
    $stmt->execute();
    
    $stmt->close();

    
    if(!(is_null($username_two))){
        $stmt_two = $mysqli->prepare("insert into events (event_name, event_date, event_time, cal_name, username) values (?,?,?,?,?)");
        if(!$stmt_two){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            echo json_encode(array(
                "success" => false,
                "message" => "Could not create event. Please Try again"
            ));
            exit;
        }
        
        $stmt_two->bind_param('sssss', $event_name, $event_date, $event_time, $cal_name, $username_two);
        
        $stmt_two->execute();
        
        $stmt_two->close();
    

    }
    echo json_encode(array(
         "success" => true
    ));
    exit;
?>