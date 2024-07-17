<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_POST['id']) && isset($_POST['filePath'])){
    if(checkDublicate($_POST['filePath'], $pdo, $_POST['id']) == false){
        unlink($_POST['filePath']);
    }
    $stmt1 = $pdo->prepare("SELECT * from photoes WHERE album_id = ?");
    $stmt1->bindParam(1, $_POST['id'], PDO::PARAM_INT);
    $stmt1->execute();
    while($row = $stmt1->fetch()){
        if(checkDublicate($row["file_path"], $pdo, $_POST["id"]) == false){
            unlink($row['file_path']);
        }
    }
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
function checkDublicate($path, $pdo, $albumId){
    $stmt = $pdo->prepare("SELECT id FROM albums WHERE file_path = ?");
    $stmt->bindParam(1, $path, PDO::PARAM_STR, 255);
    $stmt->execute(); 
    $stmt1 = $pdo->prepare("SELECT id FROM photoes WHERE file_path = ? AND album_id != ?"); 
    $stmt1->bindParam(1, $path, PDO::PARAM_STR, 255);
    $stmt1->bindParam(2, $albumId, PDO::PARAM_INT);
    $stmt1->execute();      
    return ($stmt->rowCount() + $stmt1->rowCount()) > 1 ? true : false;
}