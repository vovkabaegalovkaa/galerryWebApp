<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
$input = file_get_contents("php://input");
parse_str($input, $data);
if(isset($data['id'])){
    $stmt = $pdo->prepare("DELETE FROM albums WHERE id=?");
    $stmt->bindParam(1, $data['id'], PDO::PARAM_INT);
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