/**
 * Created by VladHome on 4/5/2016.
 */

module table2{
    import ItemValue = table.ItemValue

    class  VOItem{
        key:string
        id:number;
        stamp:number;
        t:number;
        icon:string;
        sort:number;
        msg:string;
        /* constructor(obj:any){
         for(var str in obj)this[str]=obj[str];
         }*/
    }

   export  class ListRow {
        $view:JQuery;
        id:number;
       key:string;
        stamp:number;
       // $timeout:JQuery;
        current:string = '';
        timer:number = 0;
        order:number;
        values:_.Dictionary<ItemValue>;

        template:string;
        static  disp:JQuery = $({})

        constructor(private item:VOItem){
            this.stamp = item.stamp;
            this.id = item.id;
            this.key = item.key
            this.order = -1;
        }
        initView(){
            var $view = $(this.template);
            var $els:any  = {};
            var values:any ={};
            $view.find('[data-id]').each(function (i, el:HTMLElement) {
                _.map(el.getAttribute('data-id').split(','),function(ind){ values[ind] = new ItemValue(ind,el);});

            })
            this.values = values;
            $view.hide();
            this.$view = $view;
            var data =  this.item;

        }
        render(){
            var item = this.item;
            for(var str in item){
                if(this.values[str]) var havechange =  this.values[str].setValue(item[str]);
            }
            this.show();
        }

        insertAt($cont,i:number):void{
            if(!this.$view)this.initView();
            var lastIndex = $cont.children().size();
            if(i < lastIndex)this.setOrder($cont,i);
            else  $cont.append(this.$view);
            this.render();
            this.$view.fadeIn();

        }
       appendTo($cont:JQuery){
           if(!this.$view)this.initView();
           $cont.append(this.$view);
           this.render();
           this.$view.fadeIn();
       }
        setOrder($cont,i:number):void{
            this.order = i;
            $cont.children().eq(i).before(this.$view);
        }

        setData(item:VOItem):ListRow {
            this.stamp = item.stamp;
            this.item = item;
            return this;
        }

        lastTime:number;
        remove():void {
            for(var str in this.values)this.values[str].destroy();

            this.$view.fadeOut(()=> {
                this.order = -1;
                this.$view.remove()
            })
        }

        hide():void{
            this.$view.fadeOut();
        }
        show():void{
            this.$view.fadeIn();
        }


    }
}