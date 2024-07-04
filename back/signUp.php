<?php
require_once "connection.php";
try{
    $pdo = new PDO($attr, $user, $pass, $opts);
}
catch(PDOException $e){
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
if(isset($_GET['login']) && isset($_GET['password']) && isset($_GET['remember'])){
    $login = clearData($_GET['login']);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE login = ?;");
    $stmt->bindParam(1, $login, PDO::PARAM_STR, 32);
    $stmt->execute();
    $userInfo=$stmt->fetch();
    if(!$userInfo){
        echo "Пользователя не существует, поверьте введенные данные и повторите ввод";
    }
    elseif(!password_verify($_GET['password'], $userInfo['password'])){
        echo "Пароль введен неверно, поверьте введенные данные и повторите ввод";
    }
    else{
        if($_GET['remember'] == "yes"){
            setcookie("login", $userInfo['login'], time() + 3600*24*62, "D:\\MAMP\\htdocs\\gallery\\index.html");
            setcookie("password", $userInfo['password'], time() + 3600*24*62, "");
        }
        echo "Попытка успешна";
    }
}
function clearData($login){
    $login = stripslashes($login);
    return $login = htmlentities($login);
}