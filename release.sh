#!/bin/bash
export NODE_HOME=/opt/nodejs
export PATH=$NODE_HOME/bin:$PATH
npm --registry http://registry.npm.taobao.org install 
gulp release
