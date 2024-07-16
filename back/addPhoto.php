<?php
require_once "connection.php";
define('ROOTDIR', "../photoes_examples/");
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_POST['name']) && isset($_POST['description']) && isset($_POST['userId']) && isset($_POST['albumId']) && isset($_FILES['file'])){
    $name = sanitizeString($_POST['name']);
    $description = sanitizeString($_POST['description']);
    $filename = ROOTDIR . $_FILES['file']['name'];
    if(checkDublicate($_FILES['file']['name'], $pdo) == false){
        move_uploaded_file($_FILES['file']['tmp_name'], $filename);
    }
    $userId = $_POST['userId'];
    $albumId = $_POST['albumId'];
    $stmt = $pdo->prepare("INSERT INTO photoes VALUES(null, ?, ?, ?, ?, ?)");
    $stmt->bindParam(1, $name, PDO::PARAM_STR, 32);
    $stmt->bindParam(2, $description, PDO::PARAM_STR, 32);
    $stmt->bindParam(3, $filename, PDO::PARAM_STR, 255);
    $stmt->bindParam(4, $albumId, PDO::PARAM_INT);
    $stmt->bindParam(5, $userId, PDO::PARAM_INT);
    $stmt->execute();
    if($stmt->rowCount() > 0){
        echo "Success";
    }
    else{
        echo "No success";
    }

}
function sanitizeString($var){
    $var = stripslashes($var);
    return $var = htmlentities($var);
}
function checkDublicate($path, $pdo){
    $stmt = $pdo->prepare("SELECT id FROM albums WHERE file_path = ?");
    $stmt->bindParam(1, $path, PDO::PARAM_STR, 255);
    $stmt->execute();
    $stmt1 = $pdo->prepare("SELECT id FROM photoes WHERE file_path = ?"); 
    $stmt1->bindParam(1, $path, PDO::PARAM_STR, 255);
    $stmt1->execute();
    return ($stmt->rowCount() + $stmt1->rowCount()) > 0 ? true : false;
}