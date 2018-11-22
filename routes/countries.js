var express = require('express');
var router = express.Router();

/* GET userlist. */
router.get('/countrylist', function(req, res) {
    var db = req.db;
    var collection = db.get('countries');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});
/* POST to addcountry. */
router.post('/addcountry', function(req, res) {
    var db = req.db;
    var collection = db.get('countries');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/* DELETE to deletecountri. */
router.delete('/deletecountry/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('countries');
    var countryToDelete = req.params.id;
    collection.remove({ '_id' : countryToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});
module.exports = router;