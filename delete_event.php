<?php
    session_start();
    ini_set("session.cookie_httponly", 1);
    require 'database.php';
    header("Content-Type: application/json");
    
    if(isset($_POST['token'])){
        $_SESSION['token'] = $_POST['token'];
    }
    
    if(!(hash_equals($_SESSION['token'], $_POST['token']))){
    	//echo "matching"; 
        exit();
    }
    
    $username = htmlentities($_POST['username']);
    $cal_name = htmlentities($_POST["cal_name"]);
    $event_name =  htmlentities($_POST["event_name"]);
    $event_date = htmlentities($_POST["event_date"]);
    $event_time = htmlentities($_POST["event_time"]);
    $id = htmlentities($_POST['id']);
    
    $stmt = $mysqli->prepare("delete from events WHERE id='$id'");
                             //insert into events (event_name, event_date, event_time, cal_name, username) values (?,?,?,?,?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Could edit event. Please Try again"
        ));
        exit;
    }
    
    $stmt->execute();
    
    $stmt->close();

    echo json_encode(array(
         "success" => true
    ));
    exit;
?>