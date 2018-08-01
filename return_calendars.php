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
    if(!(is_null($username)) ){
        $calendars = [];
        $sql = "SELECT * from calendars where username='$username'";
        $res = $mysqli->query($sql);
        
        if($res === false){
            echo "failed";
        }
                
        while ($cal = $res->fetch_assoc()) {
            array_push($calendars, $cal);
        }
        
        
        $sql_two = "SELECT * from calendars where username_two='$username'";
        $res_two = $mysqli->query($sql_two);
        
        if($res_two === false){
            echo "failed";
        }
                
        while ($cal = $res_two->fetch_assoc()) {
            array_push($calendars, $cal);
        }
        
        
        echo json_encode(array("success"=> true,
                         "calendars"=>$calendars)
                         );
        exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Not Logged In"
        ));
        exit;
    }
?>
