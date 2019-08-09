const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");

const fs = require("fs");

const wait = require("wait-for-stuff");

let configuration = fs.readFileSync(__dirname + "/integrationFor.json");
configuration = JSON.parse(configuration);

const app = express();


const util = require('util');
const exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(bodyParser.json());

app.locals.results = [];


// This will run the update script in a separate process
function runScript(script, eventType, event, argument="") {

	const timestamp = Date.now() + "";

	app.locals.results[timestamp] = {
		done: false,
	};

	const child = exec(`${script} "${eventType}" "${event}"  ${argument}`  , function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);


		app.locals.results[timestamp].status = 200;
		app.locals.results[timestamp].stdout = stdout;
		app.locals.results[timestamp].stderr = stderr;

		if (error !== null) {
			app.locals.results[timestamp].status = 500;
			console.log('exec error: ' + error);
		}

		app.locals.results[timestamp].done = true;

	});

	return timestamp;
}

// this function will check the configuration file for a matching script to run
function findToUpdate(res, id, ref, name, eventType, event, argument) {

	let foundServer = false;

	configuration.servers.forEach((server) => {

		if (server.repositoryID === id && server.ref === ref) {

			// skip if it needs an event and it does not match
			if (server.event && server.event !== eventType) {
				return;
			}

			const timestamp = runScript(server.runScript, eventType, event, argument);

			res.status(200);
			res.send(JSON.stringify({"key": timestamp}));
			foundServer = true;
		}
	});

	// send error response if it is no match
	if (!foundServer) {
		res.status(404);
		res.json({
			"status": 404,
			"message": "Rule for \"" + (event === undefined ? "none" : event)  + "\" on repository \"" + name + "\" (" + id + ") not found"
		});
	}
}


// this will do the the web hook for github
function github(req, res) {
	const id = req.body.repository.id;
	const ref = req.body.ref;
	const name = req.body.repository.name;
	const eventType = req.header("X-GitHub-Event");

	findToUpdate(res, id, ref, name, eventType, req.body);
}

// this will do the the web hook for github
function gitLab(req, res) {
	const id = req.body.project.id;
	const ref = req.body.ref;
	const name = req.body.project.name;
	const eventType = req.body.object_kind;


	findToUpdate(res, id, ref, name, eventType, req.body);
}


// This is kept for backward compatibility
app.post('/git-master-update', github);

// This is for github web hooks
app.post('/v1/github', github);

// this is for gitlab webhooks
app.post('/v1/gitlab', gitLab);


// this is for gitlab webhooks
app.post('/v1/manual', (req, res) => {

	const projectId = req.body.id;
	const branch = req.body.branch;
	const projectName = req.body.name;
	const event = req.body.event;
	const argument = req.body.argument;

	findToUpdate(res, projectId, branch, projectName, event, req.body, argument);
});

// this is for gitlab webhooks
app.get('/v1/result/:key', (req, res) => {

	const key = req.params.key;
	const result = app.locals.results[key];


	if (!result) {
		res.status(404);
		return res.json({status: 404, message: "not found"});
	}


	wait.for.value(app.locals.results[key], "done",  true);

	res.status(result.status);
	res.json({status: result.status, stdout: result.stdout, stderr: result.stderr});
});


const port = 3002;
const server = http.createServer(app);

server.listen(port, 'localhost');
server.on('listening', function() {
	console.log('Express server started on %s:%s', server.address().address, server.address().port);
});
