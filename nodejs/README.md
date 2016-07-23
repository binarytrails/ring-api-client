# Ring API client

## Dependecies

### Server

    $ npm install

### User Interface

It depends on JQuery & Semantics UI. We build it with everything from Semantics UI but later we shall desactivate many of the unused features.

    $ cd ui/libs/
    $ npm install

    ? Set-up Semantic UI
    ❯ Automatic (Use defaults locations and all components)
    ? Set-up Semantic UI Automatic (Use defaults locations and all components)
    ❯ Yes
    ? Where should we put Semantic UI inside your project? (semantic/)

    $ npm install -g gulp
    $ cd semantics/
    $ gulp build

## Development

    $ node app.js -h

    $ node app.js -a 127.0.0.1:8081

