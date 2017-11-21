var express = require('express');
var bodyParser = require('body-parser');
var http = require("http");

var configuration = require(__dirname + "/integrationFor.json");

var app = express();


var util = require('util');
var exec = require('child_process').exec;
var child;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(bodyParser.json());


app.post('/git-master-update', function(req, res) {

	console.log(req.body.ref);

	var id = req.body.repository.id;
	var foundServer = 0;

	for (var i = 0; i < configuration.servers.length; i++)
	{
		if (configuration.servers[i].repositoryID === id) {
			child = exec(configuration.servers[i].runScript, function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
		 		if (error !== null) {
					console.log('exec error: ' + error);
				}
			});

			res.status(200);
			res.send(JSON.stringify({"status": 200}));
			foundServer = 1;

			break;
		}
	}

	if (foundServer === 0) {
		res.status(404);
		res.send(JSON.stringify({"status": 404, "message": "Rule for repository \"" + req.body.repository.name + "\" not found"}));
	}
});


var port = 3002;

var server = http.createServer(app);

server.listen(port, 'localhost');
server.on('listening', function() {
	console.log('Express server started on %s:%s', server.address().address, server.address().port);
});
