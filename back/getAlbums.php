<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
$out = [];
$stmt = $pdo->prepare("SELECT * FROM albums");
$stmt->execute();
while($result = $stmt->fetch()){
    $out[] = $result;
}
$out = json_encode($out);
echo $out;