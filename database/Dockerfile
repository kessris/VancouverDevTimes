# Derived from official mysql image (our base image)
FROM mysql:5.7.24
# Add a database
ENV MYSQL_DATABASE vanDevTimesDB
# Add the content of the sql-scripts/ directory to your image
# All scripts in docker-entrypoint-initdb.d/ are automatically
# executed during container startup
COPY ./sql-scripts/ /docker-entrypoint-initdb.d/

CMD ["--character-set-server=utf8", "--collation-server=utf8_general_ci", "--skip-character-set-client-handshake"]