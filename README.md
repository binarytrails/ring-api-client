# Ring-client-web

Web client using [Ring API](https://github.com/sevaivanov/ring-api).

## Roadmap

* Implement basic socket communication
* Design an interface
* Implement an interface

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

