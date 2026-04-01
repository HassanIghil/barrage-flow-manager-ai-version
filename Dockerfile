# Use official MySQL image
FROM mysql:8.0

# Environment variables
ENV MYSQL_DATABASE=barrage_flow_db_AI_Version
ENV MYSQL_ROOT_PASSWORD=root_password

# Copy SQL scripts to docker-entrypoint-initdb.d
# These will be executed in alphabetical order during container startup
COPY ./database/sql/01_schema.sql /docker-entrypoint-initdb.d/01_schema.sql
COPY ./database/sql/03_triggers.sql /docker-entrypoint-initdb.d/02_triggers.sql
COPY ./database/sql/04_procedures.sql /docker-entrypoint-initdb.d/03_procedures.sql
COPY ./database/sql/05_views.sql /docker-entrypoint-initdb.d/04_views.sql
COPY ./database/sql/02_seed_data.sql /docker-entrypoint-initdb.d/05_seed_data.sql

EXPOSE 3306
