<?php
    ini_set("session.cookie_httponly", 1);
    session_save_path("");    
    session_name('calendar_session');
    session_start();
    
    require 'database.php';
    header("Content-Type: application/json");

    if(isset($_SESSION['username'])){
        $username = $_SESSION['username'];
    } else {
        $username = htmlentities($_POST['username']);
    }
    
    $day_to_get = htmlentities($_POST['day_to_get']);
    
    if(!(is_null($username)) ){
        $events = [];
        $colors = [];
        $sql = "SELECT * from calendars where username='$username'";
        $res = $mysqli->query($sql);
        
        if($res === false){
            echo json_encode(array(
                "success" => false,
                "message" => "Not Logged In"
            ));
            exit;
        }
                
        while ($cal = $res->fetch_assoc()) {
            $cal_name = $cal['cal_name'];
            $sql_two = "SELECT * from (SELECT * from events where username='$username' and cal_name='$cal_name' and event_date='$day_to_get') AS r ORDER BY r.event_time ASC";
            $res_two = $mysqli->query($sql_two);
            
            if($res_two === false){
                echo json_encode(array(
                    "success" => false,
                    "message" => "Not Logged In"
                ));
                exit;
            }
            
                    
            while ($event = $res_two->fetch_assoc()) {
                if(!(is_null($event))){
                    array_push($events, $event);
                    $sql_three = "SELECT cal_color from calendars where username='$username' and cal_name='$cal_name'";
                    $res_three = $mysqli->query($sql_three);
                    
                    if($res_three === false){
                        echo "failed";
                    }
                    while ($cal_color = $res_three->fetch_assoc()) {
                        if(!(is_null($cal_color))){
                            array_push($colors, $cal_color);
                        }
                    }
                }
            }
        } 
        
        $sql_four = "SELECT * from calendars where username_two='$username'";
        $res_four = $mysqli->query($sql_four);
        
        if($res_four === false){
            echo json_encode(array(
                "success" => false,
                "message" => "Not Logged In"
            ));
            exit;
        }
                
        while ($cal = $res_four->fetch_assoc()) {
            $cal_name = $cal['cal_name'];
            $sql_five = "SELECT * from (SELECT * from events where username='$username' and cal_name='$cal_name' and event_date='$day_to_get') AS r ORDER BY r.event_time ASC";
            $res_five = $mysqli->query($sql_five);
            
            if($res_five === false){
                echo json_encode(array(
                    "success" => false,
                    "message" => "Not Logged In"
                ));
                exit;
            }
            
                    
            while ($event = $res_five->fetch_assoc()) {
                if(!(is_null($event))){
                    array_push($events, $event);
                    $sql_six = "SELECT cal_color from calendars where username_two='$username' and cal_name='$cal_name'";
                    $res_six = $mysqli->query($sql_six);
                    
                    if($res_six=== false){
                        echo "failed";
                    }
                    while ($cal_color = $res_six->fetch_assoc()) {
                        if(!(is_null($cal_color))){
                            array_push($colors, $cal_color);
                        }
                    }
                }
            }
            
        }
        echo json_encode(array(
            "success"=> true,
            "events"=>$events,
            "color"=>$colors));
        exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Couldn't get events"
        ));
        exit;
    }
?>