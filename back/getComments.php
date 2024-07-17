<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_GET['photoId'])){
    $stmt = $pdo->prepare("SELECT * FROM comments WHERE photo_id = ?");
    $stmt -> bindParam(1, $_GET['photoId'], PDO::PARAM_INT);
    $stmt -> execute();
    $out = [];
    while($row = $stmt->fetch()){
        $stmt1 = $pdo->prepare("SELECT name FROM users WHERE id = ?");
        $stmt1->bindParam(1, $row['user_id'], PDO::PARAM_INT);
        $stmt1->execute();
        $name = $stmt1->fetch();
        $row['userName'] = $name['name'];
        $out[] = $row;
    }
    echo json_encode($out);
}