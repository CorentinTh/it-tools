sudo docker build -t it-tools .
sudo docker tag it-tools:latest abambah/it-tools:v3
sudo docker push abambah/it-tools:v3
sudo docker rm --force it-tools
sudo docker run -d --name it-tools --restart unless-stopped -p 8081:80 abambah/it-tools:v3