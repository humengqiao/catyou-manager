#!bin/bash

if [ ! -n "$1" ]; then
  tag=$(date +%Y-%m-%d)
else
  tag=$1
fi

name="production-manager:$tag"

# build docker镜像
docker build -t $name .

# 删除悬空镜像
docker rmi $(docker images -f "dangling=true" -q) --force

# 保存docker镜像为文件
docker save $name -o "$name.tar"

# 上传docker镜像文件到服务器
sshpass -p SHENZHENYONGLI2019 scp "./$name.tar" root@119.23.185.128:/external_project/production-manager/

# 删除本地docker镜像文件
rm -rf "../$name.tar"

# 远程服务器载入镜像，滚动更新
sshpass -p SHENZHENYONGLI2019 ssh root@119.23.185.128 << remoteSSH
  cd /external_project/production-manager/
  docker load -i $name.tar
  docker rmi $(docker images -f "dangling=true" -q) --force
  sed -i "s/image:\s*[^\n\r]\+/image: $name/g" docker-stack.yml
  docker service update --image $name --force production-manager_production-manager
remoteSSH