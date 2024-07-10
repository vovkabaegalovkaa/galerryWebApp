<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_POST['id']) && isset($_POST['filePath'])){
    unlink($_POST['filePath']);
    $stmt = $pdo->prepare("DELETE FROM albums WHERE id=?");
    $stmt->bindParam(1, $_POST['id'], PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->rowCount();
    header("Content-type: application/json");
    if($rows > 0){
        $out = json_encode(['result' => "Success"]);
    }
    else{
        $out = json_encode(['result' => "Success"]);
    }
    echo $out;
}