/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>

class ItemModel{
    constructor(){

       require(['moment'],function(moment){

            console.log(moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
        })

    }
}