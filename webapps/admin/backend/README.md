# Admin webapp
Dashboards for webapps

# Authentication
username and password along with MFA is set up.

zoho is used for the emailing service.

## Developing
- set up .env using .env-template
- use `openssl rand -base64 64` to generate a JWT secret
- Create a db with name "admindb"
  - although this db might not be used 
 - Create a "free forever" account on zoho.com
  - Generate an application specific password on My Account > Security > Application-specific passwords
  - populate these details in .env
