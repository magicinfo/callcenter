/**
 * Created by VladHome on 3/6/2016.
 */

var http = require('http');
var fs = require('fs');
var path = require('path');

var logfilename = function(){
    var date = new Date();
    return '_'+(date.getMonth()+1)+'-'+date.getDate()+'.log';
}

var url='saveurl.php';

var settings = JSON.parse(fs.readFileSync("settings.json"));
var str = __dirname;
var ind  = str.indexOf('public_html');
if(ind==-1){
    ind = str.indexOf('www');
    settings.server='http://localhost';
}
if(ind===-1)console.log('error no web folder ');
else{
    str = str.substr(ind+1);
    var ar = str.split(path.sep);
    ar.shift();
    str = ar.join('/');
    url=settings.server+'/'+str+'/'+url;
}
console.log(url);
//var url = 'http://front-desk.ca/mi/callcenter/arch/saveurl.php?url=http://107.170.97.252/IS%26S/OakvilleDashboard/js/ajax/Oakville_public/agentstatus.xml';
var counter=0;
var errors=0;
var success=0;

var loadData = function(onDataLoaded,onLoadErrror){
    var req = http.get(url, function(resp) {
        var str = '';
        resp.on('data', function (chunk) {
            str += chunk;
        });

        resp.on('end', function () {
            onDataLoaded(str);

        });

    }).on('error',function(e){ onLoadErrror(e)});

    }

var onDataLoaded = function(res){
    res = "\n\r"+(new Date()).toLocaleString()+"\n"+res;
    fs.appendFile('success'+logfilename(), res, function (err) {

    });
    success++
}
var onLoadErrror = function(res){
    res = "\n\r"+(new Date()).toLocaleString()+"\n"+res;
    fs.appendFile('error'+logfilename(), res, function (err) {

    });
errors++;
}



setInterval(function(){
    counter++
    console.log(' counter '+ counter+' success '+success+'  errors '+ errors);
    loadData(onDataLoaded,onLoadErrror);
},60000);

loadData(onDataLoaded,onLoadErrror);