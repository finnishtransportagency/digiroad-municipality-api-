# Digiroad Municipality API

Municipality API is an API that municipalities can use to automate the maintenance of some assets in Digiroad. 

This project is done using the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

### Installation/deployment instructions

- Run `npm i` to install the project dependencies
- Run `sls package --stage <stage>` to create a package that contains the Lamba zip files as well as cloudformation templates
- Run cloudformation-template-create-stack in AWS cloudformation if it is the first deployment
- Upload packaged files into the created deployment s3 bucket. The path of the uploaded files should be `serverless/DRKunta/<stage>/<timestamp>`. The exact path can be found in the cloudformation-template-update-stack file, with the key "s3Key"
- Run cloudformation-template-update-stack in AWS cloudformation

### Usage

Usage requires an API-key, which are municipality specific.

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── exampleFunction
│   │   │   ├── handler.ts      # `exampleFunction` lambda source code
│   │   │   ├── index.ts        # `exampleFunction` lambda Serverless configuration
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`
