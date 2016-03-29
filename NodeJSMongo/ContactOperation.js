

var ContactModel = require('./ContactModel');


var contactInsert = function(request, callBack){

    var requestType = request.get('Content-Type');

    if(requestType == 'application/json')
    {
        var contact = new ContactModel();
        contact.name = request.body.name;
        contact.phone_number = request.body.phone_number;
        contact.salutation = request.body.salutation;

       

        contact.save(function(err){
            if(err)
            {
                callBack(err);
            }
            else{
                callBack(contact);
            }
        });
    }
}


var contactDelete = function(request,callBack){

    model.remove({ _id: request.body.id }, function(err) {
        if (!err) {
            callBack(err)
            message.type = 'notification!';
        }
        else {
            callBack('deleted succesfuly');
        }
    });
}




module.exports.contactInsert = contactInsert;
module.exports.contactDelete = contactDelete;
