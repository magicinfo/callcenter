<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL ^ E_NOTICE);
session_start();
$filename = '../data/crawl.json';
$out = new stdClass();
if(!isset($_GET['a'])) die('LOL');
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
if($_GET['a'] == 'get'){
	$list = array();	
	if(file_exists($filename)){
		$data = json_decode(file_get_contents($filename))->data;
		foreach($data as $row) if($row->active)$list[]=$row->msg;
		//if(isset($_SESSION['crawl']))$_SESSION['crawl'] ++;
		//else $_SESSION['crawl'] =0;		
		
	}
	
	$out->list = $list;		
		echo json_encode($out);
	
	exit();
}
if($_GET['a'] == 'getall'){
	if(file_exists($filename)){		
		echo file_get_contents($filename);
		exit();
	}
	
}

$data = json_decode(file_get_contents('php://input'));

$user = $data->user;



if(!$user) die('OOPS');

$user->user = md5($user->user);
$user->pass = md5($user->pass);



	$root = (string)$_SERVER['DOCUMENT_ROOT'];
	$ind = strpos($root,'public_html');
	$root = substr($root,0,$ind);
	$users_file = $root.'crawlusers.json';	
	if(!file_exists($users_file)){
		$out->ind=$ind;	
		$out->root=$root;	
		echo json_encode($out);
		 exit();
	}
	
	$users = json_decode(file_get_contents($users_file))->data;
	$pass=0;
	$data->user=0;
	$i=0;
	foreach($users as $val){
		$i++;
		if($user->user == $val->user && $user->pass == $val->pass)$data->user = $i;
	}

if($data->user === 0){
	 $out->result = 'wrong username or password';
	 echo json_encode($out);
	 exit();
	
}

	if(file_exists($filename) && file_exists('../arch')) copy($filename,'../arch/crawl'.time().'.json');	
	 $res = file_put_contents($filename,json_encode($data));
	 
	 
	 if($res){
		// $out ->file = $data;
		// $out->filename = $filename;
		  $out->result='SAVED';
	 }
	 else $out->error= 'ERROR';
	 echo json_encode($out)
	 
	 

?>