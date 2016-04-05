/**
 * Created by VladHome on 4/4/2016.
 */
///<reference path="base.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VOAgent = (function () {
    function VOAgent() {
    }
    return VOAgent;
})();
var AgentM = (function (_super) {
    __extends(AgentM, _super);
    function AgentM() {
        _super.apply(this, arguments);
    }
    AgentM.prototype.defaults = function () {
        return {
            stamp: 0,
            id: 0,
            fa: '',
            name: '',
            time: 0,
            aux: ''
        };
    };
    return AgentM;
})(Backbone.Model);
var AgentsC = (function (_super) {
    __extends(AgentsC, _super);
    function AgentsC(options) {
        var _this = this;
        _super.call(this, options);
        this.model = AgentM;
        this.url = options.url;
        this.parse = function (res) {
            _this.data = res;
            var stamp = Date.now();
            _.map(res.result.list, function (item) {
                item.stamp = stamp;
                item.icon = 'fa fa-' + item.fa;
            });
            console.log(res.result.list.length);
            //  console.log(res);
            return res.result.list;
        };
    }
    return AgentsC;
})(Backbone.Collection);
var Row = (function (_super) {
    __extends(Row, _super);
    function Row(options) {
        var _this = this;
        _super.call(this, options);
        this.template = _.template($('#row-template').html());
        this.model.bind('change', function () { return _this.render(); });
        this.model.bind('destroy', function () { return _this.destroy(); });
        this.model.bind('remove', function () { return _this.remove(); });
        this.model.bind('add', function () { return _this.add(); });
    }
    Row.prototype.render = function () {
        console.log(this.model);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    };
    Row.prototype.remove = function () {
        var _this = this;
        this.$el.fadeOut(function () {
            _super.prototype.remove.call(_this);
        });
        return this;
    };
    Row.prototype.add = function () {
        console.log('add');
    };
    Row.prototype.destroy = function () {
        console.log('destroy');
    };
    return Row;
})(Backbone.View);
var AppModel = (function (_super) {
    __extends(AppModel, _super);
    function AppModel() {
        _super.apply(this, arguments);
    }
    return AppModel;
})(Backbone.Model);
var TableView = (function (_super) {
    __extends(TableView, _super);
    function TableView() {
        var _this = this;
        _super.call(this);
        this.setElement($("#TableList"), true);
        var collection = new AgentsC({ url: 'http://callcenter.front-desk.ca/service/getagents?date=2016-03-15T7:58:34' });
        // collection.bind('reset', this.render);
        this.collection = collection;
        this.collection.bind('remove', function (evt) {
            console.log('remove', evt);
        }, this);
        this.collection.bind("add", function (evt) {
            console.log('add', evt);
            var row = new Row({ model: evt, tagName: 'tr' });
            _this.$el.append(row.render().el);
        }, this);
        this.render = function () {
            console.log(this);
            return this;
        };
        collection.fetch();
        setInterval(function () {
            _this.collection.fetch();
        }, 5000);
    }
    TableView.prototype.render = function () {
        console.log('render');
        return this;
    };
    return TableView;
})(Backbone.View);
//# sourceMappingURL=App5.js.map