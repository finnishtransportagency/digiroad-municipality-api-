# Digiroad Municipality API

Digiroad Municipality API fetches data from municipalities' APIs and parses the data to Digiroad.

This project is done using the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Local development instructions

### Prerequisites

- [Node.js v20 & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed
- [serverless framework v3](https://www.npmjs.com/package/serverless) installed globally

### Installation and running

- More detailed instructions in [Confluence](https://extranet.vayla.fi/wiki/pages/viewpage.action?pageId=207002949).
- Install local Digiroad 2 database. Instructions found [Here](https://github.com/finnishtransportagency/digiroad2).
  - Dump available in `testFiles`
  - Copy data from the following production tables to local: - enumerated_value, property, kgv_roadlink and functional_class
<details>
  <summary>Provide the following environment variables in `.env`-file and remember to replace values between `<` and `>` with your own values</summary>

  ```sh
  OFFLINE=true
  PGHOST='localhost'
  PGPORT='5432'
  PGDATABASE=<database-name>
  PGUSER=<database-username>
  PGPASSWORD_SSM_KEY=<database-password>
  APIKEY=''
  STAGE_NAME='dev'
  DR_SECURITY_GROUP_ID=''
  DR_SUBNET_ID_1=''
  DR_SUBNET_ID_2=''
  SECURITY_GROUP_ID=''
  SUBNET_ID_1=''
  SUBNET_ID_2=''
  BBOX=<your-bounding-box-in-epsg:3067> # Bounding box for fetching data from Infra-O API
  AWS_ACCOUNT_ID=''
  AWS_CLOUDFORMATION_ROLE=''
  ADMINISTRATOR=''
  ```

</details>
<br/>

- Run `npm i` to install the project dependencies.
- Run local database in one terminal.
- Run `npm start` in another terminal to start the api.
- In a third terminal you can now run commands found in `package.json`.

### Deployment

Deployment is automated with GitHub actions. Pushing into `development` updates development, `test` updates QA and `main` updates production.

### Automation

Automated fetches can be set up via [Amazon EventBridge Scheduler](https://docs.aws.amazon.com/scheduler/latest/UserGuide/what-is-scheduler.html).