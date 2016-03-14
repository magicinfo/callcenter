<?


$settings = json_decode(file_get_contents('settings.json'));
$url= $settings->url;

if(!isset($settings->folders))$settings->folders = array();

if(count($settings->folders)===0)$settings->folders[] = 'data0';
$folder = $settings->folders[count($settings->folders)-1];
if(!file_exists($folder))mkdir($folder,0755);
else if(count(scandir($folder))>1000){
	$folder = 'data'.count($settings->folders);
	$settings->folders[] = $folder;	
	mkdir($folder,'0755');
	file_put_contents('settings.json',json_encode($settings));
}

$filename = isset($_GET['filename'])?$_GET['filename']:'f';
$filename.= time().'.dat';
$data=0;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data=0;
if(($data = curl_exec($ch)) === FALSE){
    echo 'Curl error: ' . curl_error($ch);
} else{
		if($data) {
			$res =  file_put_contents($folder.'/'.$filename,$data);
			if($res) echo 'SUCCESS '.$res;
			else  echo'ERROR cant save file  '.$filename;
		}else 'ERROR no data in file  '.$url;
			
}

// Close handle
curl_close($ch);


