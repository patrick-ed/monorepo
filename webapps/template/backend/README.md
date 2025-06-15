# This is template

This template is a very simple full stack app
It has one table being ping_stats which keeps track of the total amount of pings

A user can ping in the route frontend/ping or backend/api/v1/ping
A user can view the total pings in TODO(frontend/ping/stats) or backend/api/v1/ping/stats

## Developing

- set up .env using .env-template
- Create a db with name "templatedb"
- Connect to templatedb and run `INSERT INTO ping_stats VALUES(0,0,'total_pings');`

## TODO

- complete set up for prod
    - setting up proxy.conf.json