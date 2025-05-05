# Webapps docs

Welcome to the webapps directory

Here lies the code to all of my public websites. 

## Adding a new website

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