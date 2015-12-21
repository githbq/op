#!/bin/bash
export NODE_HOME=/opt/nodejs
export PATH=$NODE_HOME/bin:$PATH
npm install
grunt release
