/**
 * Created by VladHome on 4/7/2016.
 */
///<reference path="base.ts"/>
var table;
(function (table) {
    var TableRow = table2.ListRow;
    var DataCollection = (function () {
        function DataCollection() {
        }
        DataCollection.prototype.setData = function (raw) {
            var newAr = [];
            var exists = [];
            var oldAr = [];
            var data = [];
            var newInd = _.indexBy(raw, 'key');
            if (this.data) {
                _.map(this.data, function (val) {
                    if (!newInd[val.key]) {
                        oldAr.push(val);
                    }
                });
                // console.log('old',oldAr);
                var dataInd = this.dataInd;
                _.map(raw, function (val) {
                    if (dataInd[val.key]) {
                        data.push(dataInd[val.key]);
                        exists.push(dataInd[val.key]);
                    }
                    else {
                        var row = new TableRow(val);
                        data.push(row);
                        newAr.push(row);
                    }
                });
            }
            else {
                data = _.map(raw, function (val) {
                    return new TableRow(val);
                });
                newAr = data;
            }
            // console.log('new',newAr);
            this.data = data;
            this.length = this.data.length;
            this.olddata = oldAr;
            this.newdata = newAr;
            this.exists = exists;
            this.dataInd = _.indexBy(data, 'key');
        };
        DataCollection.prototype.newToEnd = function () {
            this.data = this.exists.concat(this.newdata);
        };
        return DataCollection;
    })();
    table.DataCollection = DataCollection;
})(table || (table = {}));
//# sourceMappingURL=Collection.js.map