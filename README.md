# Users API
Before you setup everything please check the file .env.example, you'll need to update MAIL variables for your mailing service to work. Don't forget to save the file as .env after you finsih your updates and before running the project.

Please run the following command to setup the whole project through Docker in the development environment:

    yarn run docker:dev



This will start the backend, database, redis server, frontend and the nginx reverse proxy.

## Access API (Swagger)
Please visit http://localhost/api/v1 for a detailed documentation of the API and a quick test of its ability.

## Access Frontend
You can visit the front-end through http://localhost/ directly.