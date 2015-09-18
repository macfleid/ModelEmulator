/**
 * Created by mcfly on 07/09/2015.
 */
ObjectID = require('mongodb').ObjectID
var MongoClient = require('mongodb').MongoClient;

var db = {};
var url = 'mongodb://localhost:27017/eproServer';
/////////////////////////////////////////////////////////////////////

MongoClient.connect(url, function(err, db_) {
    if(err) {
        console.log("Error:"+err);
        return;
    }
    console.log("Connected correctly to mongoDb server");
    db = db_;
});

/**
 * TODO : handle errors
 * @param table
 * @param data
 * @param callback
 */
insertInDb = function(table,data,callback) {
    if (db == null) {
        console.log('Empty connection');
    }
    var collection = db.collection(table);
    collection.insertOne(
        data,
        function (err, result) {
            if (err != null) {
                console.log("Error insertion :" + err)
            }
            console.log("Result :" + result)
            callback.send(result);
        }
    );
}

/**
 * TODO : handle errors
 * @param table
 * @param data
 * @param callback
 */
updateInDb = function(table,data,callback) {
    if (db == null) {
        console.log('Empty connection');
        return;
    }
    var collection = db.collection(table);
    myId = data._id;
    delete data._id;
    console.log('#updating:'+myId);
    console.log('#data:'+ JSON.stringify(data));
    collection.updateOne(
        {_id: new ObjectID(myId)},
        {$set: data},
        function(err,result) {
            console.log(err);
            console.log(result.result);
            callback.send(result);
        }
    )
}

queryInDb = function(table,searchReq,callback) {
    if (db == null) {
        console.log('Empty connection');
        return;
    }
    var collection = db.collection(table);
    collection.find(searchReq).toArray(function (err, res) {
        callback.send(res);
    });
}

////////////////////////////////////////////////////////////////////////////
