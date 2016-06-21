# Ring-webextension

It's using the [Ring API](https://github.com/sevaivanov/ring-api).

> WebExtensions are a new way to write browser extensions. The technology is designed for cross-browser compatibility: to a large extent the API is compatible with the extension API supported by Google Chrome and Opera. Extensions written for these browsers will in most cases run in Firefox with just a few changes. The API is also fully compatible with multiprocess Firefox. -- [Mozilla](https://developer.mozilla.org/en-US/Add-ons/WebExtensions)

## Roadmap

* Write a skeleton
* Define the Ring API Socket.IO communication library
* Write the chronological list of features to implement
* Design a responsive user interface
* Implement an interface
* Adapt it for all browsers
* Define tests

## Architecture

### WebSockets vs Socket.IO

[Socket.IO](https://github.com/socketio/engine.io) contains WebSocket and adds the [fallback transports](https://github.com/socketio/engine.io/tree/master/lib/transports). The user can define them by passing *transports* option to the server constructor:

    transports (<Array> String): transports to allow connections to (['polling', 'websocket'])

The advantage of using the WebSockets is that they are directly integrated to HTML5. The counter part is that [they are not supported by everyone](http://caniuse.com/#feat=websockets).

To ensure flexibility and support for a wider range of software, it would be better to use Socket.IO that contains the WebSocket implementation.

## License

The code is licensed under a GNU General Public License [GPLv3](http://www.gnu.org/licenses/gpl.html).

## Authors

Seva Ivanov seva.ivanov@savoirfairelinux.com

