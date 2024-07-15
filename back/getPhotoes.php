<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_GET['albumId'])){
    $stmt = $pdo->prepare("SELECT * FROM photoes WHERE album_id=?");
    $stmtLikes = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE photo_id=?");
    $stmtComments = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE photo_id=?");
    $stmt->bindParam(1, $_GET['albumId'], PDO::PARAM_INT);
    $stmt->execute();
    while($row = $stmt->fetch()){
        $stmtLikes->bindParam(1, $row['id'], PDO::PARAM_INT);
        $stmtLikes->execute();
        $row['likes'] = $stmtLikes->fetch()["COUNT(*)"];
        
        $stmtComments->bindParam(1, $row['id'], PDO::PARAM_INT);
        $stmtComments->execute();
        $row['comments'] = $stmtComments->fetch()["COUNT(*)"];

        $out[] = $row;

    }
    echo json_encode($out);
}