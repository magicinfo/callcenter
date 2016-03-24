/**
 * Created by VladHome on 3/15/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
var Registry = (function () {
    function Registry() {
    }
    Registry.CURRENT_DATE = 'CURRENT_DATE';
    Registry.LOAD_DATA = 'LOAD_DATA';
    Registry.LIST_NEW_DATE = 'LIST_NEW_DATE';
    Registry.LIST_NEW_DATA = 'LIST_NEW_DATA';
    Registry.SET_CURRENT_DATE = 'SET_CURRENT_DATE';
    Registry.WORK_START_TIME = 'WORK_START_TIME';
    Registry.event = $({});
    Registry.data = {};
    return Registry;
})();
//# sourceMappingURL=Registry.js.map