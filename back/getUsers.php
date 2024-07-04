<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
} 
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
};
$query = "SELECT login FROM users";
$result = $pdo->query($query);
$data = [];
while($row = $result->fetch()){
    $data[] = $row["login"];
}
$res = json_encode($data);
header('Content-Type: application/json');
echo $res;
