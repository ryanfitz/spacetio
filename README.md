# Nestio.space Backend

## Getting Started 

First you will need to install [`nodejs`](https://nodejs.org) and [`yarn`](https://yarnpkg.com).

With those installed then install all dependencies:

```bash
yarn install
```

## Launch server

```bash
yarn start
```

The server will start listening at `http://localhost:8080`

Two endpoints are available:
* [`stats`](http://localhost:8080/stats)
* [`health`](http://localhost:8080/health)

## Running tests

This project comes with a full test suite, which can be executed with:

```bash
yarn test
```

Test coverage report will be generated 

```bash
open coverage/lcov-report/index.html 
```

### Author

- [Ryan Fitzgerald](http://github.com/ryanfitz)