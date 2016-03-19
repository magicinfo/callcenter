/**
 * Created by VladHome on 3/19/2016.
 */
///<reference path="../typings/jquery.d.ts"/>
///<reference path="../typings/underscore.d.ts"/>
///<reference path="../typings/require.d.ts"/>
///<reference path="../com/Registry.ts"/>
var VOAgent = (function () {
    function VOAgent(obj, stamp) {
        this.stamp = stamp;
        for (var str in obj)
            this[str] = obj[str];
    }
    return VOAgent;
})();
//# sourceMappingURL=base.js.map