<h4 align="center">
<img src="https://raw.githubusercontent.com/interreg-simile/api/master/docs/media/logo.png" width="400" alt="SIMILE">
</h4>

# SIMILE API

[![Coverage Status](https://coveralls.io/repos/github/interreg-simile/api/badge.svg?branch=master)](https://coveralls.io/github/interreg-simile/api?branch=master)
[![Inline docs](http://inch-ci.org/github/dwyl/hapi-auth-jwt2.svg?branch=master)](https://api-simile.como.polimi.it/v1/docs)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![javascript style guide](https://img.shields.io/badge/code_style-standard--mia-orange.svg)](https://github.com/mia-platform/eslint-config-mia)

RESTFul API developed the manage the citizen generated data of [interreg project SIMILE](https://progetti.interreg-italiasvizzera.eu/it/b/78/sistemainformativoperilmonitoraggiointegratodeilaghiinsubriciedeiloroe).

The project aims to improve the actual insubric lakes monitoring system and to create a shared policy for water management
through an advanced informative system and citizen participation. The project is funded under the Interreg Italy-Switzerland Cooperation
Program in order to develop strategies for the protection of lakes.


## Table of Contents

- [Usage](#usage)
- [Local development](#local-evelopment)
  - [Running the tests](#running-the-tests)
  - [Building the docs](#building-the-docs)
- [Contributions](#contributions)
- [License](#license)


## Usage

Please refer to the [official documentation](https://api-simile.como.polimi.it/v1/docs).


## Local development

To develop the service locally you need:

- Node 12+
- MongoDB up and running

To set up Node, please if possible try to use [nvm](https://github.com/nvm-sh/nvm), so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
`nvm install` and the `.nvmrc` file will install and select the correct version of Node if you don’t already have it.

Once you have all the dependencies in place, you can launch:

```shell
npm i
```

This command will install the dependencies. Now you can create your local copy of the `env` variables needed for
launching the application.

```shell
cp ./example.env ./.env
```

Once you have all your dependency in place, you can launch:

```shell
npm run dev
```

and you will have the service exposed on your machine on the port `8000`.

### Running the tests

The project contains unit and e2e tests. To run the e2e test you will need a docker container with MongoDB up and
running. To do that, run:

```
docker run -d --name simile-mongo -p 27888:27017 mongo
```

Now you can run

```shell
npm run unit
```

This command will run all the tests and generate a coverage report that you can view as an HTML page in
`coverage/lcov-report/index.html`.

### Building the docs

The API documentation follows the
[OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md).

For development purposes you can run

```shell
npm run serve:docs
```

to spin up a live server that allows you to visualize the changes in real time.

To build the final version of the documentation, run

```shell
npm run build:docs
```


## Contributions

Developed by [Edoardo Pessina](mailto:edoardopessina.priv@gmail.com) - [GitHub](https://github.com/epessina)

A special thanks to the project partners:

- Politecnico di Milano
- Scuola universitaria professionale della Svizzera italiana
- Regione Lombardia
- CNR IRSA
- Fondazione Politecnico di Milano
- Cantone Ticino


## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) © [SIMILE Project](mailto:interreg-simile@polimi.it)
