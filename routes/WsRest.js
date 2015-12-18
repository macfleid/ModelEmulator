var express = require('express');
var router = express.Router();
var dbUtils = require('./mongo/dbFunctions');

////////////////////////////////////////////////////////////////////////////
var wsList = [
    {name : "/settingsinstance", table: "InstanceSettingsSyncModel", singleValue: true},
    {name : "/study", table: "StudySyncModel", args : ["studyname"], singleValue: true},
    {name : "/sites", table: "SitesSyncModel", args : ["studyname","sitesnumber"], singleValue: false},
    {name : "/users", table: "tmp", args : ["studyname","sitenumber"], singleValue: false},
    {name : "/usersitesinfo", table: "tmp", args : ["studynames"], singleValue: false}
]

/**
 * retrieve wss from url or null if not found
 * @param url
 * @returns {{name, table}|{name, table, args}|*}
 */
var getFromUrl = function(url) {
    for(var key in wsList) {
        var value = wsList[key];
        var name = value['name'];
        if(name === url)  {
            return value;
        }
    }
    return null;
}
////////////////////////////////////////////////////////////////////////////

/**
 *
 */
for(var key in wsList) {
    var value = wsList[key];
    var table = value['table'];
    var name = value['name'];
    var isSingleValue = value['singleValue'];
    console.log("[declaring "+value['name']+"]"+ "isSingleValue:"+isSingleValue);
    /**
     * declares all wss with parameters
     */
    router.get(value['name'], function(req, res, next) {
        var ws = getFromUrl(req.path);
        console.log('[called]'+'/'+ws.name);
        var callback = function(result) {
            if(ws.singleValue == true) {
                res.send(result[0].data);
            } else {
                _arrayedResult_ = []
                for(element in result) {
                    _arrayedResult_.push(result[element].data)
                }
                res.send(_arrayedResult_);
            }
        }
        request = ""
        if(req.query)
            request = createWhereSelection(req.query);
        dbUtils.queryInDb(ws.table, request, callback);
    });
}

var createWhereSelection = function createWhereSelection(reqObjects) {
    console.log('[called createWhereSelection]');
    result = {params : reqObjects}
    console.log('[ result]'+ JSON.stringify(result));
    return result;
}

module.exports = router;