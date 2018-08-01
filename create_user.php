<?php
    session_start();
    ini_set("session.cookie_httponly", 1);
    require 'database.php';
    header("Content-Type: application/json");
    
    $desired_username = htmlentities($_POST['username']);
    $desired_password = htmlentities($_POST['password']);
    $confirm_password = htmlentities($_POST['password_confirm']);
    
    if(strcmp($desired_password, $confirm_password) == 0){
//                    if the passwords match then we hash and submit to users table
        $desired_password = password_hash($desired_password, PASSWORD_DEFAULT);
        $stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        
        $stmt->bind_param('ss', $desired_username, $desired_password);
        
        $stmt->execute();
        
        $stmt->close();
        
        $stmt = $mysqli->prepare("insert into calendars (cal_name, username) values (?,?)");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        
        $stmt->bind_param('ss', $desired_username, $desired_username);
        
        $stmt->execute();
        
        $stmt->close();
        
        $_SESSION['username'] = $desired_username;
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
        
        echo json_encode(array(
                "success" => true
        ));
        exit;
    }else{
        echo json_encode(array(
            "success" => false,
            "message" => "Could not create user. Please Try again"
        ));
        exit;
    }
?>