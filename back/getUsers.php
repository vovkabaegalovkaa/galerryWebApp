<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
} 
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
};
if(isset($_GET['login'])){
    $login = sanitizeString($_GET['login']);
    $stmt = $pdo->prepare("SELECT login FROM users WHERE login = ?");
    $stmt->bindParam(1, $login, PDO::PARAM_STR, 32);
    $stmt->execute();
    $result = $stmt->fetch();
    $data = [];
    if(!$result){
        $data['result'] = "ok";
    }
    else{
        $data['result'] = "no";
    }
    $res = json_encode($data);
    header('Content-Type: application/json');
    echo $res;
}
function sanitizeString($login){
    $login = stripslashes($login);
    return $login = htmlentities($login);
}

