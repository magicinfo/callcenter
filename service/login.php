<?php
class Login{
	function getRole($data,$file_name){		
		$user = $data->user;
		if(!$user) return 0;
		$user->user = md5($user->user);
		$user->pass = md5($user->pass);

		$root = (string)$_SERVER['DOCUMENT_ROOT'];
		$ind = strpos($root,'public_html');
		if($ind===FALSE) $ind = strpos($root,'www');
		$root = substr($root,0,$ind);
		$users_file = $root.'crawlusers.json';	
		if(!file_exists($users_file)) return 'nofile';
	
		$users = json_decode(file_get_contents($users_file))->data;
		$pass=0;
		$data->user=0;
		$i=0;
		foreach($users as $val){			
			if($user->user == $val->user && $user->pass == $val->pass) return 'admin';
		}
		return 'nouser';
	}
	
	function getUser($file_name){		
		$root = (string)$_SERVER['DOCUMENT_ROOT'];
		$ind = strpos($root,'public_html');
		if($ind===FALSE) $ind = strpos($root,'www');
		$root = substr($root,0,$ind);
		$users_file = $root.$file_name;	
		if(!file_exists($users_file)) return 'nofile';	
		return json_decode(file_get_contents($users_file));		
	}
	
}