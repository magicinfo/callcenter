<?php
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);
session_start();

$folder = 'assets';

$out = new stdClass();
if(!isset($_GET['a'])) die('LOL');
$a = $_GET['a'];
header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");

if($a == 'logout'){
	$_SESSION['user']=0;	
		$out->result = 'logout';
		echo json_encode($out);
		exit();	
}

if($a == 'login'){
	$_SESSION['user']=0;
	require 'login.php';
	$login = new Login();
	$data = json_decode(file_get_contents('php://input'));
	$role = $login->getRole($data);
	if($role =='admin'){
		$_SESSION['user'] = 'admin';
		$out->reason = $role;
		$out->result = 'loggedin';	
		echo json_encode($out);
		exit();
	}else{
		$out->result = 'Please check username and password';
		$out->reason = $role;	
		echo json_encode($out);
		exit();
	}
}
if($_SESSION['user'] !== 'admin'){
		//$out->result = 'please login';
		$out->error = 'please login';
		echo json_encode($out);
		exit();
}


 if($a == 'upload'){	
	$file = $_FILES["file"];
	$out=new stdClass();
				
		if ($file["error"] > 0){
			$out->error= $file["error"];
			return $out;
		}
		$filename= $file["name"];				
		if(move_uploaded_file($file["tmp_name"],'../'.$folder.'/'.$filename)){
			$out->success='success';
			$out->result=$folder.'/'.$filename;
		}
		
		echo json_encode($out);
		exit();
		
	
}else if($a == 'delete'){
	$filename = $_GET['filename'];
	$out=new stdClass();
	//if(strpos('/',$filename) !== NULL) return $out;
	$file = '../'.$folder.'/'.$filename;
	$res = unlink($file);	
	if($res){
		$out->success='success';
		$out->result='removed';
	}else $out->eroor = $file;
	
	echo json_encode($out);
		exit();
}
else if($a == 'rename'){
	$data = json_decode(file_get_contents('php://input'));
	$newname = $data->newname;
	$oldname = $data->oldname;
	
	$out=new stdClass();
	$res = rename('../'.$folder.'/'.$oldname,'../'.$folder.'/'.$newname);		
	if($res) {
		$out->success='success';	
		$out->newname = $folder.'/'.$newname;
	}
	echo json_encode($out);
		exit();
}



$out->assets = getAssets($folder);
echo json_encode($out);

function getAssets($folder){
	$ar = scandir('../'.$folder);
	$out=array();
	foreach($ar as $file)if(!is_dir($file)) $out[] = $file;
	return $out;
}

function saveAsset($filename){
	
	
}
function deleteAsset(){
	
	
}



	 

?>