/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
 class R_C{
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
    setData(item:any){
        //  console.log(item);
        for (var str in this.$texts)this.$texts[str].text(item[str]);
        for (var str in this.$visible)item[str]?this.$visible[str].show():this.$visible[str].hide();
        for (var str in this.$imgs)this.$imgs[str].css('background-image','url('+item[str]+')');
        for (var str in this.$chk)this.$chk[str].prop('checked',item[str]);

    }
}
 class ListItem2{
    $icon:JQuery;
    $view:JQuery;
    $msg:JQuery;
    $id:JQuery;
    id:number;
    stamp:number;
    $timeout:JQuery;
    current:string='';
    timer:number=0;
     rc:R_C;

    constructor(item:any,template:string){

        this.id = item.id;
        this.$view=$(template);
        this.rc = new R_C(this.$view)
        this.setData(item);
    }

    setData(item:VOAgent):void{
        this.rc.setData(item);
    }

    lastTime:number;
    currentTime:number;

    remove():void{
        this.$view.fadeOut(()=>{this.$view.remove()})
    }



}
