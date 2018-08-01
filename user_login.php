<?php
    ini_set("session.cookie_httponly", 1);
    session_save_path("");
    session_name('calendar_session');
    session_start();
    
    require 'database.php';
    header("Content-Type: application/json");
    $username = htmlentities($_POST['username']);
    $password = htmlentities($_POST['password']);
        
        $sql = "SELECT password from users where username='$username'";
        $res = $mysqli->query($sql);
        $passwords = $res->fetch_assoc();
        $pass_hash = $passwords['password'];
        
//                Check password 
        if (password_verify($password, $pass_hash)) {
            
            $_SESSION['username'] = $username;
            $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 
            
            echo json_encode(array(
                "success" => true,
                "user"=> $_SESSION['username'],
                "token"=>$_SESSION['token']
            ));
            session_write_close();
            exit;
        }else{
            echo json_encode(array(
                "success" => false,
                "message" => "Incorrect Username or Password"
            ));
            exit;
        }
?>

