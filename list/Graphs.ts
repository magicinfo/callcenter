/**
 * Created by VladHome on 3/7/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="Service.ts"/>
///<reference path="BasicList.ts"/>
module callcenter{
    export class Graphs{
        constructor(){
            service.Service.service.dispatcher.on( service.Service.service.ON_HELP_DESK,(evt,data)=>{
                this.setData(data);
            })
        }

        private setData(data){

        }
    }
}