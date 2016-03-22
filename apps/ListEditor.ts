/**
 * Created by VladHome on 3/19/2016.
 */
    ///<reference path="base.ts"/>
    ///<reference path="ListItem2.ts"/>

class R_C5{
    $texts:_.Dictionary<JQuery>;
    $visible:_.Dictionary<JQuery>;
    $imgs:_.Dictionary<JQuery>;
    $chk:_.Dictionary<JQuery>;

    constructor($view:JQuery){
        this.$texts = this.createCollection('data-text',$view);
        this.$visible = this.createCollection('data-vis',$view);
        this.$imgs = this.createCollection('data-img',$view);
        this.$chk =  this.createCollection('data-chk',$view);
    }

    createCollection(type:string,$view:JQuery):_.Dictionary<JQuery>{
        var obj:any={}
        $view.find('['+type+']').each(function(i,el){
            obj[String(el.getAttribute(type))] = $(el);
        })
        return obj;
    }
    getObject(str:string){
        return this.$texts[str] || this.$visible[str] || this.$imgs[str] || this.$chk[str];
    }


    getData():any{
        var item={};
        for (var str in this.$texts)item[str] = this.$texts[str].text();
        //for (var str in this.$visible)item[str] = this.$visible[str].visible();
       // for (var str in this.$imgs)this.$imgs[str].css('background-image','url('+item[str]+')');
        for (var str in this.$chk)item[str] = this.$chk[str].prop('checked');

        return item;

    }

    setData(item:any){
        //  console.log(item);
        for (var str in this.$texts)this.$texts[str].text(item[str]);
        for (var str in this.$visible)item[str]?this.$visible[str].show():this.$visible[str].hide();
        for (var str in this.$imgs)this.$imgs[str].css('background-image','url('+item[str]+')');
        for (var str in this.$chk)this.$chk[str].prop('checked',item[str]);

    }
}


class ListItem5{
    static onDelete = function(itrm:ListItem5){};
    $icon:JQuery;
    $view:JQuery;
    $msg:JQuery;
    $id:JQuery;
    id:number;
    stamp:number;
    $timeout:JQuery;
    current:string='';
    timer:number=0;
    rc:R_C5;

    constructor(item:any,template:string,del:string){

        this.id = item.id;
        this.$view=$(template);
        this.rc = new R_C5(this.$view)
        if(del)  this.$view.find(del).click((evt)=>{
          ListItem5.onDelete(this);
        })
        this.setData(item);
    }

    setData(item:VOAgent):void{
        this.rc.setData(item);
    }

    getDaata():any{
        return this.rc.getData();
    }
    appendTo($cont:JQuery){
        $cont.append(this.$view);
    }
    lastTime:number;
    currentTime:number;

    remove():void{
        this.$view.fadeOut(()=>{this.$view.remove()})
    }



}


class ListEditor{
    $view:JQuery;
    $tbody:JQuery;
    $nano:JQuery;
    data:ListItem5[];
    private template:string;

    constructor(private listid:string,private options:any){
        for(var str in options)this[str] = options[str];

    }


    init():void{
        require(['base','ListItem','nano'],()=>{
            this.loadData(this.getparams);
        })
        this.$view = $(this.listid);
        this.$tbody =  this.$view.find('[data-id=list]:first');
        this.$nano = this.$view.find('.nano:first');
        this.template = this.$view.find('[data-id=template]').html();

        if(this.options.btnSave) $(this.options.btnSave).click(()=>{
           // console.log(this.getData());
            var ar:any[] = this.getData();
            this.saveData(ar);
        })

        if(this.options.btnAdd){
            this.$view.find(this.options.btnAdd).click(()=>{
                console.log('adding');
                var item= new ListItem5({msg:'',active:true},this.template,this.options.btnDelete);
                this.data.push(item);
                item.appendTo(this.$tbody);
            })
        }
        ListItem5.onDelete = (item)=>{
            var isdelete  = confirm('You want to delete Item');
            if(isdelete){
                console.log(item);
               this.deleteItem(item)

            }
        }

    }

    deleteItem(li:ListItem5):void{
        var ar = this.data
        for(var i=0,n=ar.length;i<n;i++){
            var item = ar[i];
            if(item == li){
                li.remove();
               var res =  this.data.splice(i,1);
                console.log('Deleted ',res);
                break;
            }
        }
    }
    getparams:string = '2016-03-15T7:58:34';
    postparams:string='';

   // collection:_.Dictionary<ListItem2> ={};
    stamp:number;
    geturl:string = '';
    saveurl:string='';

    private loadData(date:string):void{
        this.getparams = date;
        $.get(this.geturl+this.getparams).done((data)=>{
            console.log(data);
            this.getparams = data.stamp;
            Registry.event.triggerHandler(Registry.LIST_NEW_DATE,data.stamp)
            Registry.event.triggerHandler(Registry.LIST_NEW_DATA,data);
          // if(data.result) data = data.result;
            var list = data.data;
         this.setData(list);
            if(this.$nano.length)this.$nano.nanoScroller();
           // $("#AgentsScroll").nanoScroller();
        }).fail((reason)=>{
            console.log(reason);
        })
    }

    setData(data:any[]){
        var out:ListItem5[] = []
       var ar:any[] = data;
        this.$tbody.empty();
        for(var i=0,n=ar.length;i<n;i++) {
            var item = new ListItem5(ar[i],this.template,this.options.btnDelete);
           item.appendTo(this.$tbody);
            out.push(item);
        }
        this.data = out;
        //console.log(i);
    }

    getData():any[] {
        var out:any[]=[];
        var ar:any[] = this.data;
        for (var i = 0, n = ar.length; i < n; i++) {
            out.push(ar[i].getDaata());
        }
        return out;

    }

    saveData(data:any):void{
        var out:any={};
        out.data = data;
        console.log(data);
        var user:any = {}
        user.user = this.$view.find('[data-id=user]:first').val();
        user.pass = this.$view.find('[data-id=pass]:first').val();
        out.user= user;
        var url:string = this.saveurl+this.postparams;
        console.log(url);
            $.post(url,JSON.stringify(out)).done((res)=>{
                console.log(res);
                if(res.result=='SAVED') alert('Data saved on server');
                else alert('Error '+res.result);

            }).fail((fail)=>{
                console.log(fail);
                alert('Error '+fail);
            })
    }

}
