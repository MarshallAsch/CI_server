#!/bin/bash

cd ../CIS3750_backend

eval "$(ssh-agent -s)"
ssh-add /home/sysadmin/.ssh/gitDeployment
git pull

sudo systemctl restart 3750NodeServer.service

echo "CIS3750 server is now up to date with master."


