# patrick's monorepo

this monorepo so far contains just webapps, can expand into other projects.

## to deploy onto pi,
- extract binaries and sftp into pi
- to start up fullstackproject, docker compose up in `webapps/fullstackproject` directoru
- to start up nginx website server, docker compose up in `webapps` 

simple cl that does this (this is only for fsp)

from `/webapps`:
```
cd fullstackproject/ &&
docker compose down -v && 
docker compose up -d && 
cd .. && 
docker compose down && 
docker compose up -d && 
docker container ls 
```

## steps to deploy:
- test ofc
- build binaries for frontend and backend
- send binaries to the pi
- the pi also needs all nginx.conf files 
- rebuild docker compose files and spin containers up
- finished
- ALSO have the option to clone whole repo onto pi and build there. will offer better dev expereince as dont have to worry about missing files.

## managing webapps:
- use docker compose down to shut website down
- use docker compose build to update websites
- use docker compose up to start website
- this needs to be automated soon

## next steps:
- push docker files for cicd
