/**
 * Created by VladHome on 4/4/2016.
 */
///<reference path="base.ts"/>



interface VOAgent{
    id:number;
    fa:string;
    name:string;
    time:number;
    aux:string;
}
class AgentM extends Backbone.Model{

    defaults():VOAgent{
        return {
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
    constructor(options:any){
        super(options)
        this.url = options.url
    }
}


class Row extends Backbone.View<AgentM>{
    template:(data:any)=>string;
    model:AgentM;
    constructor(options:any){
        super(options);
        this.template = _.template($('#row-template').html());
        this.model.bind('change', this.render);
        this.model.bind('destroy', this.remove);
    }
    render() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
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
        collection.bind('reset', this.render);
        this.model = collection;
        this.model.bind("add",(evt)=>{

        })
      collection.fetch();
        this.collection = collection;
    }

    render():TableView{

        console.log('render');

        return this;
    }


}


