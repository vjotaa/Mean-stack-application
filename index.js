'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
mongoose.connect('mongodb://localhost:27017/mean2', (err,res)=>{
    if(err){
        throw err;
    }else{
        console.log('the connection to the database is active...');
        app.listen(port,function(){
            console.log("The server of the api REST is listening in http://localhost:"+port)
        });
    }
});