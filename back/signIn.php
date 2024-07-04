<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
$stmt = $pdo->prepare("INSERT INTO users VALUES(null, ?, ?, ?)");
$stmt->bindParam(1, $login, PDO::PARAM_STR, 32);
$stmt->bindParam(2, $name, PDO::PARAM_STR, 32);
$stmt->bindParam(3, $password, PDO::PARAM_STR, 128);
$login = "vika228";
$name = "Vika";
$password = password_hash("123123v", PASSWORD_DEFAULT);
try {
    $stmt->execute();
    echo "User inserted successfully.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
