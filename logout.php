<?php
    ini_set("session.cookie_httponly", 1);
    header("Content-Type: application/json");
    session_start();
//    destroy that session and send to the front 
    session_destroy();
    if(!(isset($_SESSION['username']))){
        echo json_encode(array(
            "success" => true
        ));
        exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Could not log out user"
        ));
        exit;
    }

?>