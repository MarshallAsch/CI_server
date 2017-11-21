#!/bin/bash

cd  /opt/cis3750/cis3750_CI

eval "$(ssh-agent -s)"
ssh-add /home/sysadmin/.ssh/gitDeploymentCI
git pull

sudo systemctl restart 3750NodeServerCI.service

echo "CIS3750 CI server is now up to date with master."
