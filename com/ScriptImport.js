/**
 * Created by VladHome on 3/8/2016.
 */
var importScript = (function (oHead) {
    function loadError (oError) {
        throw new URIError("The script " + oError.target.src + " is not accessible.");
    }
   var Registry={};
    return function (sSrc, fOnload) {
        if(Registry[sSrc]){
            if(fOnload){
                if(Registry[sSrc]===2) fOnload(2);
                else setTimeout(function(){
                    importScript(sSrc,fOnload);
                },500);
            }
            return;
        }
        Registry[sSrc]=1
        var oScript = document.createElement("script");
        oScript.type = "text\/javascript";
        oScript.onerror = loadError;
        if (fOnload) { oScript.onload = function(evt){
            Registry[sSrc]=2;
            fOnload(1);
        } }
        oHead.appendChild(oScript);
        oScript.src = sSrc;
    }

})(document.head || document.getElementsByTagName("head")[0]);

