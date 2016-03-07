<?php

class Recoredr{
    var $db;
    function Recorder(){
        $this->db = new PDO('sqlite:records.db');
    }
    function createTable(){
        $sql ='CREATE TABLE IF NOT EXISTS status (id INTEGER PRIMARY KEY AUTOINCREMENT, idq TEXT, name TEXT, stamp INTEGER, handlingtime INTEGER , level INTEGER inqueue INTEGER)' ;
        $this->db->query($sql);
    }
   function recordStatus($ar){
       $this->createTable();
       $sql ='INSERT INTO status (idq,name,stamp,handlingtime,level,inqueue) VALUES (?,?,?,?,?,?)';

       foreach($ar as $item){
           $this->db->query($sql);
       }

       $item->id=(string) $node->QueueID;
       $item->name=(string) $node->Name;
       $time = (string) $node->EventDateTime;
       $item->now=str_replace('T',' ',$time);
       $item->handlingtime = (string) $node->AverageHandlingTime;
       $item->level = (string) $node->ServiceLevel;
       $item->inqueue = (string) $node->NumCallsInQueue;
       $item->answered =(string) $node->NumCallsAnswered;
       $ar[] = $item;
   }
}