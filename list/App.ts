/**
 * Created by VladHome on 3/5/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
///<reference path="FieldsUpdate.ts"/>
///<reference path="Graphs.ts"/>

$(document).ready(function(){

   service.Service.service.start();
    var list = new desh.BasicList($('#listtable'));
    var screen = new callcenter.FieldsUpdate();
    var graphs = new callcenter.Graphs();



})