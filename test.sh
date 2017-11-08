#!/bin/bash

cd ../CIS3750_backend
git pull

sudo systemctl restart 3750NodeServer.service

echo "CIS3750 server is now up to date with master."


