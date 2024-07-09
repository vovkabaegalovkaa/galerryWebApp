<?php
$names = ['login', 'password', 'name', 'id'];
foreach($names as $name){
    if(isset($_COOKIE[$name])){
        setcookie($name,'', time() - 1000, "/");
        unset($_COOKIE[$name]);
    }
}
if(sizeof($_COOKIE) == 0){
    echo "Nike";
}