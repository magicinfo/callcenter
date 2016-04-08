/**
 * Created by VladHome on 3/15/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
class Registry {
    static CURRENT_DATE:string='CURRENT_DATE';
    static LOAD_DATA:string='LOAD_DATA';
    static LIST_NEW_DATE:string='LIST_NEW_DATE';
    static LIST_NEW_DATA:string='LIST_NEW_DATA';
    static SET_CURRENT_DATE:string='SET_CURRENT_DATE';
    static WORK_START_TIME:string ='WORK_START_TIME';

    static event:JQuery = $({});
    static data:any = {};
}
