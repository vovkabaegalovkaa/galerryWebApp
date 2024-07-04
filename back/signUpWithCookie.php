<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_GET['login']) && isset($_GET['password'])){
    $login = clearData($_GET['login']);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE login = ?;");
    $stmt->bindParam(1, $login, PDO::PARAM_STR, 32);
    $stmt->execute();
    $userInfo=$stmt->fetch();
    if(!$userInfo){
        $out["result"] = "Unknown user";
        $out = json_encode($out);
        echo $out;
    }
    elseif(!($_GET['password'] == $userInfo['password'])){
        $out["result"] = "Incorrect password";
        $out = json_encode($out);
        echo $out;
    }
    else{
        $out["result"] = "Success";
        $out = json_encode($out);
        echo $out;
    }
}
function clearData($login){
    $login = stripslashes($login);
    return $login = htmlentities($login);
}