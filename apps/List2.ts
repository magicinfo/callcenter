/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>
    ///<reference path="ListItem2.ts"/>

module listU {


    class VOItem{
        key:number
        id:number;
       // b_r:number;
        t:number;
        icon:string;
        sort:number;
        msg:string;
        constructor(obj:any,public stamp:number){
            for(var str in obj)this[str]=obj[str];
        }
    }
   export class List2 {
        $view:JQuery;
        $tbody:JQuery;
        $nano:JQuery;
        onData = function (data) {
            console.log(data);
        }
        private template:string;

        constructor(private listid:string, private options:any) {
            for (var str in options)this[str] = options[str];
        }

       init():void{
           this.$view = $(this.listid);
           this.$tbody = this.$view.find('[data-id=list]:first');
           this.$nano = this.$view.find('.nano:first');
           //require(['nano'], ()=> {
           //  this.loadData(this.getparams);
           // })


           this.template = this.$view.find('[data-id=template]').html();
       }

        getparams:string = '2016-03-15T7:58:34';

        collection:_.Dictionary<ListItem> = {};
        stamp:number;
        geturl:string = 'http://front-desk.ca/mi/callcenter/rem/getagents?date=';

        loadData():void {
            this.getparams;
            var url = this.geturl + this.getparams

            $.get(url).done((data)=> {
                //   console.log(data);
                this.onData(data);
               // this.setData(data);


            }).fail((reason)=> {
                console.log(reason);
            })
        }

        /*parseData(data:any[]):VOAgent[] {
            var ar = data
            var out:VOAgent[] = [];
            var stamp = Date.now();
            for (var i = 0, n = ar.length; i < n; i++)out.push(new VOAgent(ar[i], stamp))
            this.stamp = stamp;
            return out;

        }*/

        setData(data:VOItem[]) {
           // console.log(this);
            var stamp:number = Date.now();
            var ar = data
            var coll = this.collection;
           // console.log(coll);
            for (var i = 0, n = ar.length; i < n; i++) {
                var item = ar[i];
                item.stamp = stamp;
                if (coll[item.key]) coll[item.key].setData(item);
                else {
                    coll[item.key] = new ListItem(item, this.template);
                    coll[item.key].$view.appendTo(this.$tbody)
                    // console.log(coll[item.id].$view);
                }
                // ;
                if (item.stamp !== stamp) {
                    this.collection[item.key].remove();
                    this.collection[item.key] = null;
                }
            }

            if (this.$nano.length)this.$nano.nanoScroller();
        //console.log(this.$nano.length);
        }


    }

    class R_C {
        $texts:_.Dictionary<JQuery>;
        $visible:_.Dictionary<JQuery>;
        $imgs:_.Dictionary<JQuery>;
        $chk:_.Dictionary<JQuery>;
        $class:_.Dictionary<JQuery>;

        constructor($view:JQuery) {
            this.$texts = this.createCollection('data-text', $view);
            this.$visible = this.createCollection('data-vis', $view);
            this.$imgs = this.createCollection('data-img', $view);
            this.$chk = this.createCollection('data-chk', $view);
            this.$class =  this.createCollection('data-class', $view);
        }

        createCollection(type:string, $view:JQuery):_.Dictionary<JQuery> {
            var obj:any = {};
            $view.find('[' + type + ']').each(function (i, el) {
                obj[String(el.getAttribute(type))] = $(el);
            })
            return obj;
        }

        getObject(str:string) {
            return this.$texts[str] || this.$visible[str] || this.$imgs[str] || this.$chk[str];
        }

        setData(item:VOItem) {
            //  console.log(item);
            for (var str in this.$texts)this.$texts[str].text(item[str]);
            for (var str in this.$visible)item[str] ? this.$visible[str].show() : this.$visible[str].hide();
            for (var str in this.$imgs)this.$imgs[str].css('background-image', 'url(' + item[str] + ')');
            for (var str in this.$chk)this.$chk[str].prop('checked', item[str]);
            for (var str in this.$class)this.$class[str].attr('class', item[str]);
        }
    }
    class ListItem {
        $icon:JQuery;
        $view:JQuery;
        $msg:JQuery;
        $id:JQuery;
        id:number;
        stamp:number;
        $timeout:JQuery;
        current:string = '';
        timer:number = 0;
        rc:R_C;

        constructor(item:any, template:string) {

            this.id = item.id;
            this.$view = $(template);
            this.rc = new R_C(this.$view);
            this.setData(item);
        }

        setData(item:VOItem):void {
            this.stamp = item.stamp;
            this.rc.setData(item);
        }

        lastTime:number;
        currentTime:number;

        remove():void {
            this.$view.fadeOut(()=> {
                this.$view.remove()
            })
        }


    }


    class List3 extends List2 {
        constructor(listId:string, options) {
            super(listId, options);
        }
    }
}