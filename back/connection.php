<?php
$host = 'localhost';//host name
$data = 'gallery';//database name
$user = 'root';//user name
$pass = '01012001Gh';//user password
$chrs = 'utf8mb4';//char set
$attr = "mysql:host=$host;dbname=$data;charset=$chrs";
$opts = array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false);
?>