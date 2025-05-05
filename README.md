monorepo

to deploy onto pi,
- extract binaries and sftp into pi
- to start up fullstackproject, docker compose up in `webapps/fullstackproject` directoru
- to start up nginx website server, docker compose up in `webapps` 

simple cl that does this

from /webapps
```cd fullstackproject/ && docker compose up -d && cd .. && docker compose  up -d && docker container ls```
``` cd fullstackproject/ && docker compose down -v && docker compose up -d && cd .. && docker compose down && docker compose up -d && docker container ls ```

things to note

steps to deploy:
- test ofc
- build binaries for frontend and backend
- send binaries to the pi
- the pi also needs all nginx.conf files 
- rebuild docker compose files and spin containers up
- finished
- ALSO have the option to clone whole repo onto pi and build there. will offer better dev expereince as dont have to worry about missing files.


next steps:
- push docker files for cicd