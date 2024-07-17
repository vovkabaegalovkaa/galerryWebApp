<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int) $e->getCode());
}
if(isset($_POST["userId"]) && isset($_POST['photoId']) && isset($_POST['content'])){
    $content = sanitizeString($_POST['content']);
    $stmt = $pdo->prepare("INSERT INTO comments VALUES(null, ?, ?, ?)");
    $stmt->bindParam(1, $_POST["userId"], PDO::PARAM_INT);
    $stmt->bindParam(2, $_POST["photoId"], PDO::PARAM_INT);
    $stmt->bindParam(3, $content, PDO::PARAM_STR);
    $stmt->execute();
    if($stmt->rowCount() > 0){
        echo "Success";
    }
    else{
        echo "No success";
    }
}
function sanitizeString($val){
    $val = stripslashes($val);
    return $val = htmlentities($val);
}