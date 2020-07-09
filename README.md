# Digiroad Municipality API

This is a quick istructions on how to run this application. API Reference can be found on Väylä's Wiki page. Although this is pretty simpple project and having only few endpoints.


## Prerequisite

This is a [Node.js](https://nodejs.org/en/) project. You need a Node.js installation and NPM or Yarn packagemanagers. This has been developped with version 13 of Node.js.

Also Docker and Docker-Compose is highly recommended but not neccessary.

## Environment Variables

PostgreSQL Database connections:

```
PG_HOST:        (defaults => 'postgres')
PG_PORT:        (defaluts => 5432)
PG_USER:        (defaluts =>'postgres')
PG_PASSWORD:    required
PG_DATABASE:    (defalts => 'dr_r')
```

This uses another microservice called [Assetmatcher](https://github.com/finnishtransportagency/digiroad-municipality-assetmatcher). This can be started with docker-compose:

```
ASSET_MATCHER_URL: (defaults => http://localhost:3000)
```

Port can be defined in default Node.js way:

```
 PORT:    (defaults => 5000)
```
The authentication uses AWS Cognito These parameters hasto be configured always:

```
USER_POOL_REGION: ${USER_POOL_REGION}
USER_POOL_ID: ${USER_POOL_ID}
USER_POOL_CLIENT_ID: ${USER_POOL_CLIENT_ID}
```
Alternatively if you want to just try out the API without authentication you can turn authentication off. This will use default user. This is also been used in itegration tests.

```
AUTH=off
```

## Setting up the development database

The most simple and recommended way to set up development database is via Docker-Compose. If you want more indepth quide on setting up the database, check out Väylä's wiki or README.md of `digiroad-municipality-api` (related projet to asset matcher). This project needs a database related to municipality-api which has PGRouting, PostGIS and OSSP-UUID extensions already configured with Digiroad topology.

```bash
# This will start the database and assetmatcher (on localhost:3000)
docker-compose up -d
```


## Run development environment

Install packages:

```bash
yarn install
```

```bash
yarn start
```
You should get something similar to this:

```bash
$ yarn start
yarn run v1.22.4
$ nodemon ./src/index.js
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./src/index.js`
Express Running on port: 3000 🚀
Postgres connected: localhost:5432
```


## Continuous Integration

Currently this project is using GitHub Actions to perform automated testing with docker-compose and shipps images to registery. This pipeline is triggered when you make a `pull_request` or `push` to development branch. This can be configured later to respond other branches as well. A new Image is shipped with a tag representing 8 digits of commit sha.

Suggestion: In future version tagged `v0.0.1` release branches could be merged into master which triggers a production build on and tags it with github tag. This tag can be later used in continuous delivery systems (Flux) later with regex to determinene production deployments.

## GeoJSON

GeoJSON is a very intuitive format and most of the modern GIS tools are able to handle transform their native data to GeoJSON and vice versa. If you are developing GeoJSON yourself at some point in your data pipeline you can reference [RFC-7946](https://tools.ietf.org/html/rfc7946) specification which is the official specification.

There is also an old specification which is now obsolete but it's more comprehensive and can also be used to getting started. You can access it [here](https://geojson.org/geojson-spec.html).