/**
 * Created by VladHome on 3/6/2016.
 */

var http = require('http');
var parseString = require('xml2js').parseString;

var sqlite3 = require('sqlite3').verbose();
var  db = new sqlite3.Database('data/status2.db');

var url = 'http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/queuestatus.xml';
 var loadData = function(){
    var req = http.get(url, function(res) {
        // save the data
        var str = '';
        res.on('data', function(chunk) {
            str += chunk;
        });

        res.on('end', function() {

            parseString(str, function (err, xml) {
             //  console.log(xml.ArrayOfXMLQueue.XMLQueue);
                if(err){
                    console.log(err)
                    return
                }
                if(xml && xml.ArrayOfXMLQueue && xml.ArrayOfXMLQueue.XMLQueue){
                    var ar = xml.ArrayOfXMLQueue.XMLQueue;
                    insertInDb(ar);
                }

            });
        });

        // or you can pipe the data to a parser
        // res.pipe(dest);
    });

    req.on('error', function(err) {
       console.log(err);
    });
}

var createTable = function(){
   return db.run("CREATE TABLE status (id INTEGER PRIMARY KEY AUTOINCREMENT, idq TEXT, name TEXT, stamp INTEGER, htime INTEGER , level INTEGER, inqueue INTEGER)");
}

var prevhtime1;
var prevlevel1;
var prvonqueue1;
var prevhtime2;
var prevlevel2;
var prvonqueue2;



var prevValues=[{htime:0,inqueue:0,level:0},{htime:0,inqueue:0,level:0}];

var insertInDb = function(ar){
   // createTable();
    //return;
   // db.serialize(function() {
         var stmt =  db.prepare("INSERT INTO status (idq, name,stamp, htime,level,inqueue ) VALUES (?,?,?,?,?,?)");
       /// console.log(stmt);

         for(var i= 0,n=ar.length;i<n;i++){
             var item =  ar[i];
             var time  = item.EventDateTime[0];
             var stamp = Date.parse(time)/1000;
             time = item.AverageHandlingTime[0];
             var arr = time.split(':');
             var htime = (+arr[0])*3600 + (+arr[1])*60 + (+arr[2]);
             var level = item.ServiceLevel[0];
             var inqueue = item.NumCallsInQueue[0];
             var prev = prevValues[i]
             if(prev.htime == htime && prev.inqueue == inqueue && prev.level == level ){

                 console.log('skip');
             }else{
                 prevValues[i].htime = htime;
                 prevValues[i].inqueue = inqueue;
                 prevValues[i].level = level;
                 stmt.run([ item.QueueID[0],item.Name[0],stamp,htime,level,inqueue]);
                 console.log('insert');
             }


         }
       res =  stmt.finalize();
        //console.log(res);

console.log('tick')
   // });
}


setInterval(function(){
    loadData();
},5000);

