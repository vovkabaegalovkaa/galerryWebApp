<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_GET['login']) && isset($_GET['password']) && isset($_GET['remember'])){
    $login = clearData($_GET['login']);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE login = ?;");
    $stmt->bindParam(1, $login, PDO::PARAM_STR, 32);
    $stmt->execute();
    $userInfo=$stmt->fetch();
    header("content-type: application/json");
    $out = [];
    if(!$userInfo){
        $out["result"] = "Unknown user";
        $out = json_encode($out);
        echo $out;
    }
    elseif(!password_verify($_GET['password'], $userInfo['password'])){
        $out["result"] = "Incorrect password";
        $out = json_encode($out);
        echo $out;
    }
    else{
        if($_GET['remember'] == "yes"){
            setcookie("login", $userInfo['login'], time() + 3600*24*62, "/");
            setcookie("password", $userInfo['password'], time() + 3600*24*62, "/");
            setcookie("name", $userInfo['name'], time() + 3600*24*62, "/");
            setcookie("id", $userInfo['id'], time() + 3600*24*62, "/");
        }
        else{
            setcookie("name", $userInfo['name'], 0, "/");
            setcookie("id", $userInfo['id'], 0, "/");
        }
        $out["result"] = "Success";
        $out = json_encode($out);
        echo $out;
    }
}
function clearData($login){
    $login = stripslashes($login);
    return $login = htmlentities($login);
}