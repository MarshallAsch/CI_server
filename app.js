var express = require('express');
var bodyParser = require('body-parser');
var http = require("http");

var fs = require("fs");

var configuration = fs.readFileSync(__dirname + "/integrationFor.json");

configuration = JSON.parse(configuration);
var app = express();


var util = require('util');
var exec = require('child_process').exec;
var child;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(bodyParser.json());


// This is for github web hooks
app.post('/v1/github', function(req, res) {

	var id = req.body.repository.id;
	var ref = req.body.ref;
	var foundServer = 0;

	for (var i = 0; i < configuration.servers.length; i++)
	{
		console.log(id + " " + configuration.servers[i].repositoryID);
		if (configuration.servers[i].repositoryID == id && configuration.servers[i].ref == ref) {
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
		res.send(JSON.stringify({"status": 404, "message": "Rule for repository \"" + req.body.repository.name + "\" (" + id + ") not found"}));
	}
});


// this is for gitlab webhooks
app.post('/v1/gitlab', function(req, res) {

	var id = req.body.project.id;
	var ref = req.body.ref;
	var foundServer = 0;

	for (var i = 0; i < configuration.servers.length; i++)
	{
		console.log(id + " " + configuration.servers[i].repositoryID);
		if (configuration.servers[i].repositoryID == id && configuration.servers[i].ref == ref) {
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
		res.send(JSON.stringify({"status": 404, "message": "Rule for repository \"" + req.body.repository.name + "\" (" + id + ") not found"}));
	}
});


app.post('/git-master-update', function(req, res) {

	var id = req.body.repository.id;
	var ref = req.body.ref;
	var foundServer = 0;

	for (var i = 0; i < configuration.servers.length; i++)
	{
		console.log(id + " " + configuration.servers[i].repositoryID);
		if (configuration.servers[i].repositoryID == id && configuration.servers[i].ref == ref) {
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
		res.send(JSON.stringify({"status": 404, "message": "Rule for repository \"" + req.body.repository.name + "\" (" + id + ") not found"}));
	}
});


var port = 3002;

var server = http.createServer(app);

server.listen(port, 'localhost');
server.on('listening', function() {
	console.log('Express server started on %s:%s', server.address().address, server.address().port);
});
