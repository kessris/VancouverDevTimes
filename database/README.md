# Some Useful Commands

### Workflow:

The Dockerfile inside 'database' folder copies the sql files to 'docker-entrypoint-initdb.d', where
the sql files are automatically run upon container startup. Thus we can just write all the sql files necessary
to create tables & insert data inside 'sql-scripts' folder.

The connection to the database is made by the file in 'src/server/db/database.js'.

Volumes preserve the database. So if you want to reset the database, you need to call
docker-compose down -v, and remove the volume first.



### Docker Commands:

- Go inside container:
    - docker exec -it <Container_ID or Container_Name> bash
- Go inside MySQL once you're in the container:
    - mysql -u user -p
    - After executing the line above, input 'password' as password.
- See running containers:
    - docker ps
    - (if you want to view all containers including running and stopped, include '-a' at the end)
- See docker images you have:
    - docker images
- Run a docker image:
   - docker run -d --name <container_name_you_want_to_set_to> -p <port_like_3306:3306> <docker_image_name>
- Stop container:
   - docker stop <container>
- Remove containers:
   - docker container rm  <Container_IDs>
- Remove all stopped containers:
   - docker container prune
- Remove docker images:
   - docker image rm <Image_ID>
- Remove dangling images (not tagged/used by any container):
   - docker image prune
- Remove all unused objects (including containers, images):
   - docker system prune
- Build image from Dockerfile (NOTE: NOT DOCKERCOMPOSE FILE):
   - docker image build -t <name>:<version>
   - or
   - docker build .
- Stop and remove all Docker containers:
   - docker stop $(docker ps -a -q)
   - docker rm $(docker ps -a -q)
- Remove all images:
   - docker rmi $(docker images -a -q)
- Build docker-compose after making changes:
   - docker-compose build
- Run Docker-compose file:
   - docker-compose up


### MySQL Commands:

- show databases;
- use <database_name>;
- user <table_name>;
- show tables;


- select * from <table_name> where <condition>;



To exit container or mySQL, use command 'exit'.