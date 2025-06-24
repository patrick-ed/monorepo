# patrick's monorepo

"*premature optimization is the root of all evil*" - Donald Knuth

with that being said this is my fully dockerised monorepo complete with a CI/CD pipeline that deploys onto my single home server serving multiple websites and a database :).

### purpose

for now this monorepo holds the code for my websites under [patrickdd.com](http://patrickdumdum.com/) and [patrickdumdum.com](https://patrickdumdum.com/) and i plan to build other projects on this monorepo but this mainly hosts my webapps.

### Development

Frontend - Angular v19+
Backend - Springboot (Kotlin), JDK 21 
Database - psql 17

For each webapp, installation remains practically the same as they all use very similar techstacks: 
- git clone `https://github.com/patrick-ed/monorepo.git`
- cd into which ever webapp you want to develop: `cd webapps/[webappname]`
- For full webapp functionallity, frontend and backend should be running

#### Frontend development
- cd into `frontend`
- To start the application: `ng serve`
- Frontend hosted at `localhost:4200`

#### Backend development
- cd into `backend`
- If applicable create a new `.env` file and follow the tempate in `.env-template`
- This also usually involves making a database using psql. database names are usually `[webappname]-db`
- To start the application: `./gradlew bootrun`
- Backend hosted at `localhost:8080`

#### Docker
You also have the option to use docker to develop:
- cd into which ever webapp you want to develop: `cd webapps/[webappname]`
- Run `docker compose up -d`
- To check logs: `docker logs [container-name]`



## Webapps

This monorepo hosts all of the code to my public webapps. It is complete with cicd using github workflows and custom bash scripts. Consisder all of these webapps to be WIP.

### Webapps
- [patrickdd.com](http://patrickdd.com/) - Portfolio
- [template.patrickdd.com](http://template.patrickdd.com/) - Template fullstack webapp, simple clicker.
- [fsp.patrickdd.com](http://fsp.patrickdd.com/) - Under construction

### structure

websites are organised into their own folders inside the `webapps` directory. Each webapp should have at minimum a frontend.
all webapps have a:
- `docker-compose.yml` file that hosts the frontend, backend database services. 
- `deploy.sh` script that runs to deploy the webapp on every update.

### nginx

The monorepo uses nginx as a reverse proxy and forwards requests to the right webapp in `webapps/shared/nginx` 

### CICD
The CICD pipline is set up in a modular style using custom bash scripts which github workflow just works out which files have been changed and SSHs into the server and runs its corresponding `deploy.sh` which is usually in the projects root. 
each `deploy.sh` is responsible for:
- Cleaning up old files and backing up .envs
- Updating files
- Rebuilding docker containers 
- Restarting docker containers
This structure makes it very easy to wire in a new webapp.

### Adding a new webapp

- Create a new folder within webapps
- Add a dockerfile for your frontend dir and (if you have one) backend dir
  - these dockerfiles should expose the ports for each service.
- Add a `docker-compose.yml` file building each dockerfile for the services needed for the website.
  - Including but not limited to,
    - frontend
    - backend
    - database
  - NOTE: the of service becomes the hostname of the service.
- Add a server block in `shared/nginx/nginx.conf` 
- Integrate with the CI/CD pipeline (optional).
  - pipline workflow is defined on the root of the monorepo under `webapps-cicd.yml`
  - for webapp to be discovered, add its path to `Fetch changed webapps` and `Track changed webapps in json array`
  - after that create a `deploy.sh` script on root of your new website app dir.
  - this should include **copying files** over to the server and running the command to build your docker img and run the containers.

## TODO
- More docs
