/**
 * Created by VladHome on 4/7/2016.
 */

    ///<reference path="base.ts"/>

module table {
    import TableRow = table2.ListRow;
   export  class DataCollection {
        data:TableRow[];
        dataInd:_.Dictionary<TableRow>;
        olddata:TableRow[];
        exists:TableRow[];
        newdata:TableRow[];
        length:number;

        setData(raw:VOItem[]):void {

            var newAr:TableRow[] = [];
            var exists:TableRow[] = [];
            var oldAr:TableRow[] = [];
            var data:TableRow[] = [];

            var newInd:_.Dictionary<VOItem> = _.indexBy(raw, 'key');

            if (this.data) {
                _.map(this.data, function (val:TableRow) {
                    if (!newInd[val.key]) {
                        oldAr.push(val)
                    }
                });
                // console.log('old',oldAr);
                var dataInd = this.dataInd;
                _.map(raw, function (val:VOItem) {
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
            } else {
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
        }

        newToEnd() {
            this.data = this.exists.concat(this.newdata);
        }

    }
}

