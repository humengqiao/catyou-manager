#!bin/bash

if [ ! -n "$(docker images -f \"dangling=true\" -q)" ]; then
  echo no docker dangling images, exit...
  exit 0
fi

docker rmi $(docker images -f "dangling=true" -q) --force