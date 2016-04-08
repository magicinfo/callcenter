/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
    ///<reference path="../typings/require.d.ts"/>
    ///<reference path="../typings/backbone-global.d.ts"/>




interface JQuery{
    nanoScroller():JQuery
}


interface  VOItem{
    key:string
    id:number;
    stamp:number;
    t:number;
    icon:string;
    sort:number;
    msg:string;
}

