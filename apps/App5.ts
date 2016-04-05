/**
 * Created by VladHome on 4/4/2016.
 */
///<reference path="base.ts"/>



class VOAgent{
    stamp:number;
    id:number;
    fa:string;
    name:string;
    time:number;
    aux:string;
}

class AgentM extends Backbone.Model{

    defaults():VOAgent{
        return {
            stamp:0,
            id:0,
            fa:'',
            name:'',
            time:0,
            aux:''
        }
    }
}

class AgentsC extends Backbone.Collection<AgentM>{

    model = AgentM;
    data:any;

    constructor(options:any){
        super(options)
        this.url = options.url
        this.parse = (res)=>{
            this.data = res;

            var stamp = Date.now();
            _.map(res.result.list,function(item:any){
                item.stamp = stamp;
                item.icon = 'fa fa-'+item.fa;

            });
            console.log(res.result.list.length);
          //  console.log(res);
            return res.result.list
        }
    }
    //parse:(data)=>{ }
}


class Row extends Backbone.View<AgentM>{
    template:(data:any)=>string;
    model:AgentM;
    constructor(options:any){
        super(options);
        this.template = _.template($('#row-template').html());
        this.model.bind('change', ()=>this.render());
        this.model.bind('destroy',()=>this.destroy());
        this.model.bind('remove',()=>this.remove());
        this.model.bind('add',()=>this.add());
    }

    render() {

        console.log(this.model);
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    }

    remove():Row{
        this.$el.fadeOut(()=>{
            super.remove();
        })
        return this;

    }
    add():void{
console.log('add');
    }
    destroy():void{
        console.log('destroy');
    }




}

class AppModel extends Backbone.Model{

    
}


class TableView extends Backbone.View<AppModel>{
   collection:AgentsC;
    constructor(){
        super();
       this.setElement($("#TableList"), true);
      var collection = new AgentsC({url:'http://callcenter.front-desk.ca/service/getagents?date=2016-03-15T7:58:34'})
       // collection.bind('reset', this.render);
      this.collection = collection;
        this.collection.bind('remove',(evt)=>{
            console.log('remove',evt);
        },this);

        this.collection.bind("add",(evt)=>{
            console.log('add',evt);
            var row = new Row({model:evt,tagName:'tr'});
           this.$el.append(row.render().el);
      },this);
        this.render = function(){
            console.log(this);
            return this;
        }
      collection.fetch();
       setInterval(()=> {
            this.collection.fetch();

        }, 5000);
    }

    render():TableView{

        console.log('render');

        return this;
    }


}


