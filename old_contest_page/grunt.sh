#!/bin/bash
echo "grunt uglify"
grunt uglify
echo "grunt compass:dev"
grunt compass:dev
echo "grunt compass:foundation"
grunt compass:foundation
echo "grunt"
grunt