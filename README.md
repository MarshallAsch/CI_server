[![Maintainability](https://api.codeclimate.com/v1/badges/e4094b17da2b2b66650f/maintainability)](https://codeclimate.com/github/MarshallAsch/CI_server/maintainability)

# Continuous Integration Server

This is a generic continuous integration server that will listen to webhooks to
update a a git repository on the server.

It is a node.js server that will currently only listen to [push events](https://developer.github.com/v3/activity/events/types/#pushevent) from github.


This can be configured by adding elements to the integrationFor.json file.

Scripts can be specified to run for specific projects, but can be specified for specific branches or events.

If a hook matches multiple scripts then a response will only be sent for the first script that is ran. 

This was originally created for CIS*3750 and has been modified to be more generic.
