<h4 align="center">
<img src="https://raw.githubusercontent.com/interreg-simile/api/master/docs/media/logo.png" width="400" alt="SIMILE">
</h4>

# SIMILE API

RESTFul API developed the manage the citizen generated data of interreg project SIMILE. 


## Table of Contents

- [Usage](#usage)
- [Development setup](#development-setup)
    - [Built with](#built-with)
- [The project](#the-project)
- [Contributions](#contributions)
- [License](#license)


## Usage

Please refer to the [official documentation](https://api-simile.como.polimi.it/v1/docs).


## Development setup

1. Install [Node.js](https://nodejs.org/it/download/)
1. Clone this repository: ```git clone https://github.com/interreg-simile/api.git ``` 
1. Install NPM packages: ```npm install```
1. Create a ```.env``` file in the main directory following the example of the ```.env.example``` file.
1. Build: ```npm run build:prod```
1. (*Optional*) Populate the database with some dummy data: ```npm run seed:prod```
1. Run: ```npm run start:server```

#### Docs

The API documentation follows the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md).

Use ```npm run build:docs``` to build the documentation. For testing purposes you can use ```npm run serve:docs```
to spin up a live server that allows you to visualize the changes in real time.

#### Built with

- [Node.js](https://nodejs.org/it/)
- [Express](https://expressjs.com/it/)
- [MongoDB](https://www.mongodb.com/)


## The project

The [SIMILE project](https://progetti.interreg-italiasvizzera.eu/it/b/78/sistemainformativoperilmonitoraggiointegratodeilaghiinsubriciedeiloroe), 
through an advanced informative system and citizen participation, aims to improve the actual insubric lakes monitoring
system and to create a shared policy for water management. 

The project is funded under the Interreg Italy-Switzerland Cooperation Program in order to develop strategies for the
protection of lakes.


## Contributions

Developed by [Edoardo Pessina](mailto:edoardopessina@yahoo.it) - [GitHub](https://github.com/epessina)

A special thanks to the project partners:

- Politecnico di Milano
- Scuola universitaria professionale della Svizzera italiana
- Regione Lombardia
- CNR IRSA
- Fondazione Politecnico di Milano
- Cantone Ticino


## License

[GPL-3.0](https://choosealicense.com/licenses/gpl-3.0) © [SIMILE Project](mailto:interreg-simile@polimi.it)
