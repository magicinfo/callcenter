/**
 * Created by VladHome on 3/5/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../list/Service.ts"/>
///<reference path="../list/BasicList.ts"/>
///<reference path="../list/FieldsUpdate.ts"/>
///<reference path="../list/Graphs.ts"/>
///<reference path="Registry.ts"/>
$(document).ready(function () {
    var R = Registry;
    R.data[R.CURRENT_DATE] = '2016-03-15T8:30:00';
    R.data[R.WORK_START_TIME] = '08:00:00';
    setInterval(function () { Registry.event.triggerHandler(Registry.LOAD_DATA, Registry.data[R.CURRENT_DATE]); }, 5000);
    setTimeout(function () { Registry.event.triggerHandler(Registry.LOAD_DATA, Registry.data[R.CURRENT_DATE]); }, 666);
    Registry.event.on(Registry.LIST_NEW_DATE, function (evt, date) {
        Registry.data[Registry.CURRENT_DATE] = date;
        Registry.event.triggerHandler(Registry.SET_CURRENT_DATE, date);
    });
    /* service.Service.service.start();
      var list = new desh.BasicList($('#listtable'));
      var screen = new callcenter.FieldsUpdate();
      var graphs = new callcenter.Graphs();
  */
});
//# sourceMappingURL=App.js.map