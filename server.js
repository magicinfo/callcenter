/**
 * Created by VladHome on 3/6/2016.
 */

var http = require('http');

var parseString = require('xml2js').parseString;

var sqlite3 = require('sqlite3').verbose();
var dbfile = 'status7.db';
var  db = new sqlite3.Database('data/'+dbfile);
var fs = require('fs');
var Q = require('q');
var _  = require('underscore');
var util = require('util');
var date = new Date();
var logfilename =  '/data/debug'+(date.getMonth()+'-'+date.getDate()+'T'+date.getHours()+'-'+date.getMinutes())+'.log';
var log_file = fs.createWriteStream(__dirname +logfilename, {flags : 'w'});

var Log = function (d){
    var t =  new Date().toISOString().substr(0, 19);
    log_file.write(t+'    '+util.format(d) + '\n');
}


var url = 'http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/queuestatus.xml';
var url2 = 'http://107.170.97.252/IS&S/OakvilleDashboard/js/ajax/Oakville_public/agentstatus.xml';



var loadXMLData = function(url){
    var d = Q.defer();
    var req = http.get(url, function(res) {
        // save the data
        var str = '';
        res.on('data', function (chunk) {
            str += chunk;
        });

        res.on('end', function () {
            parseString(str, function (err, xml) {
                //  console.log(xml.ArrayOfXMLQueue.XMLQueue);
                if (err) {
                    console.log(err)
                    return
                }
                d.resolve(xml);

            });
        });
    })
        return d.promise;

    }



 var loadData = function(callBack,onError){
     var promises=[];
     promises.push(loadXMLData(url));
     promises.push(loadXMLData(url2));
   var all =  Q.all(promises);
     all.done(function(res,err){
                if(err) {
                    onError(err);
                    return
                }
         var xml1 =  res[0];
         var xml2 =  res[1];
         if(xml1 && xml1.ArrayOfXMLQueue && xml1.ArrayOfXMLQueue.XMLQueue && xml2 &&  xml2. ArrayOfXMLAgent &&  xml2. ArrayOfXMLAgent.XMLAgent ) {
             var ar1 = xml1.ArrayOfXMLQueue.XMLQueue;
             var ar2 = xml2.ArrayOfXMLAgent.XMLAgent;
             var out1=[];
             ar1.map(function(ar){ out1.push( _.mapObject(ar,function(v){return v[0]})) });
             var out2=[];
             ar2.map(function(ar){ out2.push( _.mapObject(ar,function(v){return v[0]})) });
             callBack(out1,out2);
         }else onError(xml1,xml2)
            // console.log(res,err);
     });

}


/////////////////////////////////////////////
var isTableStatus;
var createTableStatus = function(callBack){
    var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='status'";
    var res = db.all(sql,function(err,row){
        console.log(row);
        console.log(err);
        if(row.length==0){
            db.run("CREATE TABLE status (id INTEGER PRIMARY KEY AUTOINCREMENT, idq TEXT, name TEXT, r_stamp INTEGER, s_stamp INTEGER, h_time INTEGER , level INTEGER, inqueue INTEGER, flag INTEGER)");
            setTimeout(function(){
                isTableStatus =true;
                callBack();
            },100);
        }else {
            isTableStatus =true;
            setTimeout(function(){
                callBack();
            },100);
        }

    });
    console.log(res);

   //return db.run("CREATE TABLE status (id INTEGER PRIMARY KEY AUTOINCREMENT, idq TEXT, name TEXT, stamp INTEGER, htime INTEGER , level INTEGER, inqueue INTEGER)");
}

//////////////////////////////////
var isTableAgents;
var createTableAgents = function(callBack){
    var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='agents'";
    var res = db.all(sql,function(err,row){
       // console.log(row);
        console.log('error '+err);
        if(row.length==0){
            db.run("CREATE TABLE agents (id INTEGER PRIMARY KEY AUTOINCREMENT, ids TEXT, busy_reason TEXT, state TEXT, flag INTEGER, s_stamp INTEGER)");

            setTimeout(function(){
                isTableAgents =true;
                callBack();
            },100);
        }else {
            isTableAgents =true;
            setTimeout(function(){
                isTableAgents =true;
                callBack();
            },100);
        }

    });
   // console.log(res);

    //return db.run("CREATE TABLE status (id INTEGER PRIMARY KEY AUTOINCREMENT, idq TEXT, name TEXT, stamp INTEGER, htime INTEGER , level INTEGER, inqueue INTEGER)");
}


var insertAgentsStatus = function(IDS,makeBusyReason,states,flag){
    if(!isTableAgents){
        var onCreated = function(){
            insertAgentsStatus(IDS,makeBusyReason,states,flag);
        }
        createTableAgents(onCreated);
        return;
    }
    var now = Math.round(Date.now()/1000);
    var sql ="INSERT INTO agents (ids, busy_reason,state, s_stamp, flag ) VALUES (?,?,?,"+now+",?)";
   var res = db.run(sql,[IDS.toString(),makeBusyReason.toString(),states.toString(),flag]);
   return res
}



var insertStatus = function(ar,flag){
  if(!isTableStatus){
      var onCreated = function(){
          insertStatus(ar,flag);
      }
      createTableStatus(onCreated);
      return;
  }

   // db.serialize(function() {

    var now = Math.round(Date.now()/1000);
    var sql = "INSERT INTO status (idq, name, r_stamp, s_stamp, h_time, level, inqueue, flag ) VALUES (?,?,?,"+now+",?,?,?,"+flag+")";

         for(var i= 0,n=ar.length;i<n;i++){
             var item =  ar[i];
       var res =   db.run(sql,[item.QueueID,item.Name,item.EventDateTime,item.AverageHandlingTime,item.ServiceLevel,item.NumCallsInQueue]);

         }
      // res =  stmt.finalize();


    console.log('_end_');

   // });
}


var MB;
var ST;
var count = 0;

var AST;

var onDataLoaded = function(ar1,ar2){
    var sum;
    count++;

    ////////////////////////////////////////////////////////////////////////////
    var allStat=[];
    ar1.map(function(v){
        allStat.push(v.AverageHandlingTime);
        allStat.push(v.ServiceLevel);
        allStat.push(v.NumCallsInQueue);
    });

    if(AST){
      sum =  _.difference(allStat,AST).length +  _.difference(AST,allStat).length ;
        if(sum)insertStatus(ar1,sum);
    }else insertStatus(ar1,0);

    AST = allStat;


   /////////////////////////////////////////////////////////////////////
    var MakeBusyReason = [];
    var  State =[];
    var IDS=[];

    ar2.map(function(v){
        MakeBusyReason.push(v.MakeBusyReason);
        State.push(v.State);
        IDS.push(v.AgentID);
    });


    if(MB){
        sum =  _.difference(State,ST).length+ _.difference(ST,State).length ;
        sum += _.difference(MB,MakeBusyReason).length+ _.difference(MakeBusyReason,MB).length;

        if(sum) insertAgentsStatus(IDS,MakeBusyReason,State,sum);
        //console.log(sum);
    }else insertAgentsStatus(IDS,MakeBusyReason,State,0);
    ST = State;
    MB = MakeBusyReason;


console.log(count);
}

var onLoadErrror = function(err,err2){

    console.log(' error ',err,err2);
}

setInterval(function(){
    loadData(onDataLoaded,onLoadErrror);
},60000);

loadData(onDataLoaded,onLoadErrror);