var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var mongo = require('mongodb');
// var monk = require('monk');
// var db = monk('192.168.33.11:27017/countries');

var async = require('async');
//Connect to the cluster
var ExpressCassandra = require('express-cassandra');
var models = ExpressCassandra.createClient({
    clientOptions: {
        contactPoints: ['127.0.0.1'],
        protocolOptions: { port: 9042 },
        keyspace: 'mykeyspace',
        queryOptions: {consistency: ExpressCassandra.consistencies.one}
    },
    ormOptions: {
        defaultReplicationStrategy : {
            class: 'SimpleStrategy',
            replication_factor: 1
        },
        migration: 'safe',
    }
});


const countryModel = models.loadSchema('countries', {
    fields: {
        country: "varchar",
        region: "varchar",
        population: "varchar",
        area: "varchar",
        population_density: "varchar",
        coastline: "varchar",
        net_migration: "varchar",
        infant_mortality: "varchar",
        gdp: "varchar",
        literacy: "varchar",
        phones: "varchar",
        arable: "varchar",
        crops: "varchar",
        other: "varchar",
        climate: "varchar",
        birthrate: "varchar",
        deathrate: "varchar",
        agriculture: "varchar",
        industry: "varchar",
        service: "varchar",

    },
    key: ["country"]
});

// MyModel or models.instance.Person can now be used as the models instance
console.log(models.instance.countries === countryModel);

// sync the schema definition with the cassandra database table
// if the schema has not changed, the callback will fire immediately
// otherwise express-cassandra will try to migrate the schema and fire the callback afterwards
countryModel.syncDB(function(err, result) {
    if (err) throw err;
    // result == true if any database schema was updated
    // result == false if no schema change was detected in your models
});

var indexRouter = require('./routes/index');
var countriesRouter = require('./routes/countries');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', indexRouter);
app.use('/countries', countriesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
