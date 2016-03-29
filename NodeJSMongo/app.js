var express = require('express');

var app = express();

var mongoose = require("mongoose");

app.set('port', process.env.PORT || 3000);

var bodyParser = require('body-parser');

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.raw({extended:true}))

function getEnvironmentVariables() {

    if(process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        // Pattern match to find the first instance of a Cloudant service in
        // VCAP_SERVICES. If you know your service key, you can access the
        // service credentials directly by using the vcapServices object.
        for(var vcapService in vcapServices){
            if(vcapService.match(/Mongo/i)){
                dbCredentials.host = vcapServices[vcapService][0].credentials.host;
                dbCredentials.port = vcapServices[vcapService][0].credentials.port;
                dbCredentials.user = vcapServices[vcapService][0].credentials.username;
                dbCredentials.password = vcapServices[vcapService][0].credentials.password;
                dbCredentials.url = vcapServices[vcapService][0].credentials.uri;
                dbCredentials.database = vcapServices[vcapService][0].credentials.database;

                break;
            }
        }
        if(db==null){
            console.warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
        }
    } else{
        console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
        // For running this app locally you can get your Cloudant credentials
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment
        // Variables section for an app in the Bluemix console dashboard).
        // Alternately you could point to a local database here instead of a
        // Bluemix service.
        //dbCredentials.host = "REPLACE ME";
        //dbCredentials.port = REPLACE ME;
        //dbCredentials.user = "REPLACE ME";
        //dbCredentials.password = "REPLACE ME";
        //dbCredentials.url = "REPLACE ME";
    }
}

getEnvironmentVariables();

var ContactModel = require('./ContactModel');
var ContactOperation = require('./ContactOperation');

mongoose.connect(dbCredentials.url);

var router = express.Router();

router.get('/contacts', function(request,response){
    ContactModel.find(function(err,contacts){
        if(err)
        {
            response.send(err);
        }
        else
        {
            response.send(contacts);
        }

    });

});
router.get('/test', function(request,response){
    response.send('App is working')

});


router.post('/createcontact', function(request,response){


    ContactOperation.contactInsert(request,function(res){
        response.send(res);
    });
});



app.use('/', router);
app.listen(port);

