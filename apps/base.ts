/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
    ///<reference path="../typings/require.d.ts"/>


///<reference path="../com/Registry.ts"/>

interface JQuery{
    nanoScroller():JQuery
}

class VOAgent{
    id:number;
    b_r:number;
    t:number;
    icon:string;
    sort:number;
    msg:string;
    constructor(obj:any,public stamp:number){
       for(var str in obj)this[str]=obj[str];
    }
}