# Continuous Integration Server

This is a generic continuous integration server that will listen to webhooks to
update a a git repository on the server.

It is a node.js server that will currently only listen to [push events](https://developer.github.com/v3/activity/events/types/#pushevent) from github.


This can be configured by adding elements to the integrationFor.json file.


This was originally created for CIS*3750 and has been modified to be more generic.
