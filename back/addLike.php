<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int) $e->getCode());
}
if(isset($_POST['userId']) && isset($_POST['photoId'])){
    $stmt = $pdo->prepare("INSERT INTO likes VALUES(null, ?, ?)");
    $stmt->bindParam(1, $_POST["userId"], PDO::PARAM_INT);
    $stmt->bindParam(2, $_POST["photoId"], PDO::PARAM_INT);
    $stmt->execute();
    if($stmt->rowCount() > 0){
        echo "Success";
    }
    else{
        echo "No success";
    }
}