/**
 * Created by VladHome on 3/18/2016.
 */
///<reference path="base.ts"/>
///<reference path="List2.ts"/>
var App2 = (function () {
    function App2() {
        this.hello = 'hello   3';
        require(['underscore', 'apps/ItemModel'], function (_, args) {
        });
        console.log('app2Start tt ');
        console.log($);
    }
    return App2;
})();
//# sourceMappingURL=App2.js.map