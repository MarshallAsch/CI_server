var express = require('express');
var bodyParser = require('body-parser');
var http = require("http");


var app = express();


var util = require('util');
var exec = require('child_process').exec;
var child;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(bodyParser.json());


app.post('/git-master-update', function(req, res) {

	console.log(req.body.ref);


	res.send(JSON.stringify({"status": 200}));

child = exec('/opt/cis3750/cis3750_CI/test.sh', // command line argument directly in string
  		function (error, stdout, stderr) {      // one easy function to capture data/errors
    	console.log('stdout: ' + stdout);
    	console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});

});


var port = 3002;

var server = http.createServer(app);

server.listen(port, 'localhost');
server.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});
