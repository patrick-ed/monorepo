# Adding cicd

## webapps
### building 
for this workflow, workflow checks if any webapps changed, stores changed webapps in json array, passes array onto matrix, matrix builds each webapp 

to add new webapps be sure to add it in "Fetch changed webapps" and "Track changed webapps in json array" for it to be integrated properly.

### testing
todo

### deploying

to add a new webapps be sure to include a `depoy.sh` script that will be used by the `cicd.yml` script 

Checklist for adding a new project:
- Add a `deploy.sh` on root of project, this will be used for the github workflow script
  - Basic process is that it copies project files to pi and uses docker to build. 
- Add a `docker-compose.yml` script on root of project defining your services 
  - Note: service name = hostname