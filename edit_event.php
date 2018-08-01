<?php
    session_start();
    ini_set("session.cookie_httponly", 1);
    require 'database.php';
    header("Content-Type: application/json");
    
    if(isset($_POST['token'])){
        $_SESSION['token'] = htmlentities($_POST['token']);
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
    
    $sql = "SELECT * from calendars where username='$username' and cal_name='$cal_name'";
    $res = $mysqli->query($sql);
        
    $username_two = $res->fetch_assoc()['username_two'];
    if($res === false){
        echo json_encode(array(
            "success" => false,
            "message" => "res_one"
        ));
        exit;
    }
    
    if(is_null($username_two)){
        $sql_three = "SELECT * from calendars where username_two='$username' and cal_name='$cal_name'";
        $res_three = $mysqli->query($sql_three);
        if($res_three === false){
        echo json_encode(array(
            "success" => false,
            "message" => "res_three"
        ));
        exit;
    }
            
        $username_two = $res_three->fetch_assoc()['username'];
    }
    
    $sql_old = "SELECT * from events where id='$id'";
    $res_old = $mysqli->query($sql_old);
    
    if($res_old === false){
        echo json_encode(array(
            "success" => false,
            "message" => "res_four"
        ));
        exit;
    }
    $id_two = 0;
    $old_time = null;
    $old_date = null;
    $old_name = null;
    while ($event = $res_old->fetch_assoc()) {
        $old_time = $event['event_time'];
        $old_name = $event['event_name'];
        $old_date = $event['event_date'];
    }   
    $sql_two = "SELECT * from events where username='$username_two' and cal_name='$cal_name' and event_date='$old_date' and event_name='$old_name' and event_time='$old_time'";
    $res_two = $mysqli->query($sql_two);
    
    if($res_two === false){
        echo json_encode(array(
            "success" => false,
            "message" => "res_four"
        ));
        exit;
    }
    $id_two = null;
    while ($id_find = $res_two->fetch_assoc()) {
        $id_two = $id_find['id'];
    }
    
    
    $stmt_two = $mysqli->prepare("UPDATE events SET username='$username_two', event_name='$event_name', cal_name='$cal_name', event_time='$event_time', event_date='$event_date' WHERE id='$id_two'");
                             //insert into events (event_name, event_date, event_time, cal_name, username) values (?,?,?,?,?)");
    if(!$stmt_two){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Could not edit event. Please Try again"
        ));
        exit();
    }
    
    $stmt_two->execute();
    
    $stmt_two->close();
    
    $stmt = $mysqli->prepare("UPDATE events SET username='$username', event_name='$event_name', cal_name='$cal_name', event_time='$event_time', event_date='$event_date' WHERE id='$id'");
                             //insert into events (event_name, event_date, event_time, cal_name, username) values (?,?,?,?,?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Could not edit event. Please Try again"
        ));
        exit();
    }
    
    $stmt->execute();
    
    $stmt->close();
    

    echo json_encode(array(
         "success" => true
    ));
    exit();
?>