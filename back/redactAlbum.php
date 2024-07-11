<?php
require_once "connection.php";
define("ROOTDIR", "../photoes_examples/");
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(sizeof($_POST) == 1){
    echo "Success";
}
if(isset($_POST['id'])){
    $query = "";
    $fullPath = "";
    $name = "";
    $description = "";
    $fileStatus = false;
    $nameStatus = false;
    $descriptionStatus = false;
    if(isset($_FILES['file']) && isset($_POST['fileToDelete'])){
        $fileStatus = true;
        $fullPath = ROOTDIR . $_FILES['file']['name'];
        if(checkDublicate($_FILES['file']['name'], $pdo, false) == false){
            move_uploaded_file($_FILES['file']['tmp_name'], $fullPath);
        }
        if(checkDublicate($_POST['fileToDelete'], $pdo, true) == false){
            unlink($_POST['fileToDelete']);
        }
        $queryFile = "file_path=?";
        if(strlen($query) == 0){
            $query = "UPDATE albums SET " . $queryFile;
        }
        else{
            $query = $query . ", " . $queryFile;
        }
    }
    if(isset($_POST['name'])){
        $nameStatus = true;
        $name = sanitizeString($_POST['name']);
        $queryName = "title=?";
        if(strlen($query) == 0){
            $query = "UPDATE albums SET " . $queryName;
        }
        else{
            $query = $query . ", " . $queryName;
        }
    }
    if(isset($_POST['description'])){
        $descriptionStatus = true;
        $description = sanitizeString($_POST["description"]);
        $queryDescription = "description=?";
        if(strlen($query) == 0){
            $query = "UPDATE albums SET " . $queryDescription;
        }
        else{
            $query = $query . ", " . $queryDescription;
        }
    }
    $query = $query . " WHERE id=?";
    $stmt = $pdo->prepare($query);
    $x = 1;
    if($fileStatus){
        $stmt -> bindParam($x, $fullPath, PDO::PARAM_STR, 255);
        $x++;
    }
    if($nameStatus){
        $stmt -> bindParam($x, $name, PDO::PARAM_STR, 32);
        $x++;
    }
    if($descriptionStatus){
        $stmt -> bindParam($x, $description, PDO::PARAM_STR, 32);
        $x++;
    }
    $stmt -> bindParam($x, $_POST['id'], PDO::PARAM_INT);
    $stmt -> execute();
    echo "Success";
}
function sanitizeString($val){
    $val = stripslashes($val);
    return $val = htmlentities($val);
}
function checkDublicate($path, $pdo, $del){
    $stmt = $pdo->prepare("SELECT id FROM albums WHERE file_path = ?");
    $stmt->bindParam(1, $path, PDO::PARAM_STR, 255);
    $stmt->execute();
    if($del){
        return $stmt->rowCount() > 1 ? true : false;
    }
    else{
        return $stmt->rowCount() > 0 ? true : false;
    }
}