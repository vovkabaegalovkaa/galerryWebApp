<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_GET["userId"])){
    $stmt = $pdo->prepare("SELECT photo_id FROM likes WHERE user_id=?");
    $stmt->bindParam(1, $_GET['userId'], PDO::PARAM_INT);
    $stmt->execute();
    $out = [];
    while($row = $stmt->fetch()){
        $out[] = $row;
    }
    echo json_encode($out);
}