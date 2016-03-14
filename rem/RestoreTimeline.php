<?

class RestoreTimeline{

var $from;
var $to;
var $out;
var $data;

    function RestoreTimeline($data,$from,$to){	
		$this->from = $from;
		$this->to=$to;
		if(count($data)>2) $this->data = $this->restore($data);	
		else $this->data=[];

    }	
	private function restore($data){		
		$data[0]->stamp = (int)$data[0]->stamp;
		$first = $data[0];
		$last = $data[count($data)-1];
		$start = $this->from;
		$end = $this->to;
		$min = 60;
		$inter = $start;
		$out=array();
		$i=0;
		$max=count($data);
		while($inter<$end){
			$inter+=$min;
			//$stamp = (int)$data[$i]->stamp;
			$item = clone $data[$i];
			$item->stamp = $inter;
			$out[] = $item;			
			//echo $inter.'  ';
			if($inter > (int)$data[$i]->stamp){
				$i++;
				if($i==$max)$i--;				
			}						
		}
		return $out;
	}
	function total(){
		return count($this->data);
	}
	function compress($limit){
	
	$out = array();
	$from = $this->from;
	$to = $this->to;
			//$step = $this->total()/$limit;
			$data =  $this->data;
			if(count($data)===0) return$out;
			//return $data;
			/////////////////////////
			$first = clone $data[0];
			$first->stamp = $from;
			$first->time= date("Y-m-d H:i:s", $first->stamp);	
			$out[] =$first;
			////////////////////////////////////
			$last = clone $data[count($data)-1];
			
			$start = (int)$first->stamp;
			$end = (int)$last->stamp;
			$step = ($end-$start)/$limit;
			$inter = $data[0]->stamp;
			 $htime = -1;
			 $level=-1;
			 $inqueue = -1;
			$prev=$data[0];
			$prev->time= date("Y-m-d H:i:s", $prev->stamp);	
			
			
			
			$count=0;
			foreach($data as $v){
				if($v->htime>$prev->htime)$prev->htime=$v->htime;
				if($v->level>$prev->level)$prev->level = $v->level;
				if($v->inqueue>$prev->inqueue)$prev->inqueue = $v->inqueue;	
				//echo $count++;
					if($v->stamp > $inter){
						$htime = -1;
						$level=-1;
						$inqueue = -1;
						$v->stamp = $v->stamp+(60*60*5);
						$prev->time= date("Y-m-d H:i:s", $prev->stamp);						
						$out[] = $prev;
						$prev = $v;
						$inter+=$step;
					}					
			}
			$last->stamp = $to;
			$last->time=date("Y-m-d H:i:s", $last->stamp);	
			return $out;
	}
	
	
}