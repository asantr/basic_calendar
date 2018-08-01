<?php
    ini_set("session.cookie_httponly", 1);
    session_save_path("");
    session_name('calendar_session');
    session_start();
    require 'database.php';
    header("Content-Type: application/json");

    $users = [];
    $sql = "SELECT * from users";
    $res = $mysqli->query($sql);
    
    if($res === false){
        echo json_encode(array(
            "success" => false,
            "message" => "Not Logged In"
        ));
        exit;
    }
            
    while ($user = $res->fetch_assoc()) {
        array_push($users, $user);
    }
    echo json_encode(array("success"=> true,
                     "users"=>$users
                     ));
    exit;

?>