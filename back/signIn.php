<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_POST['login']) && isset($_POST['name']) && isset($_POST['password'])){
    $login = sanitizeString($_POST['login']);
    $name = ucfirst(sanitizeString($_POST['name']));
    $password = password_hash(sanitizeString($_POST['password']), PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users VALUES(null, ?, ?, ?)");
    $stmt->bindParam(1, $login, PDO::PARAM_STR, 32);
    $stmt->bindParam(2, $name, PDO::PARAM_STR, 32);
    $stmt->bindParam(3, $password, PDO::PARAM_STR, 128);
    try {
        $stmt->execute();
        echo "User inserted successfully.";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
function sanitizeString($var){
    $var = stripslashes($var);
    return $var = htmlentities($var);
}