var express = require('express');
var bodyParser = require('body-parser');
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

child = exec('./test.sh', // command line argument directly in string
  		function (error, stdout, stderr) {      // one easy function to capture data/errors
    	console.log('stdout: ' + stdout);
    	console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});

});

app.listen(3002);
