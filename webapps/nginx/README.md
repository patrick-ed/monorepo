Two nginx files.

What's the difference? 

## nginx.conf
This is used for prod. It recognises `.com` TLDs instead of `.test`

## nginx-dev.conf
This is used for local devleopment. It recognises `.test` TLDs instead of `.com`

## why?
- when locally running the docker containers, you simply cannot use `127.0.0.1` as the monorepo uses subdomains to serve the correct files.
- therefore when you develop locally, you have to add the hosts in the host "database" (`/etc/hosts`)
  - an entry in the `hosts` would look like `127.0.0.1  template.patrickdd.test`
- `.test` is used as to not conflic with actual prod.
- to use `nginx-dev.conf` run `NGINX_CONF_FILE=nginx-dev.conf docker-compose up -d` in `/webapps`