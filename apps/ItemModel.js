/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="base.ts"/>
var ItemModel = (function () {
    function ItemModel() {
        require(['moment'], function (moment) {
            console.log(moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));
        });
    }
    return ItemModel;
})();
//# sourceMappingURL=ItemModel.js.map