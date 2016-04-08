/**
 * Created by VladHome on 4/5/2016.
 */

module table{
    export class ItemValue {
        $view:JQuery;
        static disp:JQuery=$({});
        static format:any={};
        value:any;

        setValue(val:string):boolean{
            if(this.value == val) return false;
            this.$view = ItemValue.format[this.index](this.$view,val);
            this.value = val;
            return true
        }

        constructor(public index:string, public el:HTMLElement){
            ItemValue.disp.on(index,(evt,val)=>{
                if(val == -1) val += this.value;
                this.setValue(val)
            })
            this.$view = $(el);
        }
        destroy():void{
            ItemValue.disp.off(this.index);
        }
    }

    var formatTime = function(num){
        if(isNaN(num)) return '';

        var h = Math.floor(num/60/60);

        var min = Math.floor(num/60);
        var sec = num-(min*60);
        return h+':'+(min<10?'0'+min:min)+':'+(sec<10?'0'+sec:sec);
    }


    ItemValue.format['time']= function($view,val){
        return $view.text(formatTime(val));
    }
    ItemValue.format['name']= function($view,val){
        return  $view.text(val);
    }
    ItemValue.format['aux']= function($view,val){
        var $old = $view;
        var $el =  $old.clone();
        setTimeout(()=>{
            $old.hide('slow',()=>{
                $old.remove();
            });
        },500);
        $el.appendTo($old.parent());
        $el.text(val);
        return $el;
    }
    ItemValue.format['icon']= function($view,val){
        var $old = $view;
        var $el =  $old.clone();
        setTimeout(()=>{
            $old.hide('slow',()=>{
                $old.remove();
            });
        },500);
        $el.appendTo($old.parent());
        $el.attr('class', val);
        return $el;
    }
    ItemValue.format['time_color']= function($view,val){
        return  $view.attr('class', val);
    }
    ItemValue.format['aux_color']= function($view,val){
        return  $view.attr('class', val);
    }

}