<?
$settings = json_decode(file_get_contents('settings.json'));

$ar = explode('/',getenv('DOCUMENT_ROOT'));
array_pop($ar);
$user = implode('/',$ar).'/user.json';

$user = json_decode(file_get_contents($user));

$url= $settings->url;
$table = $settings->table;
$dbname = $settings->db;

$db = new PDO("mysql:host=localhost;dbname=$dbname",$user->user,$user->pass);
 $sql = "SHOW TABLES LIKE '$table'";
$res = $db->query($sql)->fetchAll(PDO::FETCH_OBJ);
if($res){}
else {
  $sql = "CREATE TABLE $table (id INTEGER PRIMARY KEY AUTO_INCREMENT, rawdata TEXT, stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP )";
  $res = $db->query($sql);
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data=0;
if(($data = curl_exec($ch)) === FALSE){
    echo 'Curl error: ' . curl_error($ch);
} else{
		if($data) {
		 $sql = "INSERT INTO $table (rawdata) VALUES (?)";
			$res = $db->prepare($sql)->execute([$data]);			
			if($res) echo 'SUCCESS '.$db->lastInsertId();
			else  echo'ERROR cant save file  '.$filename;
		}else 'ERROR no data in file  '.$url;
			
}

// Close handle
curl_close($ch);


