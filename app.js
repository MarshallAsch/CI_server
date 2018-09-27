var express = require('express');
var bodyParser = require('body-parser');
var http = require("http");

var fs = require("fs");

var configuration = fs.readFileSync(__dirname + "/integrationFor.json");

configuration = JSON.parse(configuration);
var app = express();


var util = require('util');
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(bodyParser.json());


// This will run the update script in a seperate process
function runScript(script) {

	var child = exec(script, function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
}

// this function will check the configuration file for a matchinig script to run
function findToUpdate(req, id, ref, res) {

	var foundServer = 0;

	// check all of the repositories that this is responcible for
	for (var i = 0; i < configuration.servers.length; i++)
	{
		// if it found a match then do the task
		if (configuration.servers[i].repositoryID == id && configuration.servers[i].ref == ref) {

			runScript(configuration.servers[i].runScript);

			res.status(200);
			res.send(JSON.stringify({"status": 200}));
			foundServer = 1;

			break;
		}
	}

	// send error respoince if it is no match
	if (foundServer === 0) {
		res.status(404);
		res.send(JSON.stringify({"status": 404, "message": "Rule for repository \"" + req.body.repository.name + "\" (" + id + ") not found"}));
	}
}


// this will do the the web hook for github
function github(req, res) {
	var id = req.body.repository.id;
	var ref = req.body.ref;

	findToUpdate(req, id, ref, res);
}

// this will do the the web hook for github
function gitLab(req, res) {
	var id = req.body.project.id;
	var ref = req.body.ref;

	findToUpdate(req, id, ref, res);
}


// This is kept for backward compatibility
app.post('/git-master-update',github);

// This is for github web hooks
app.post('/v1/github', github);

// this is for gitlab webhooks
app.post('/v1/gitlab', gitLab);


var port = 3002;

var server = http.createServer(app);

server.listen(port, 'localhost');
server.on('listening', function() {
	console.log('Express server started on %s:%s', server.address().address, server.address().port);
});
