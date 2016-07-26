# Introduction

The requirements specifies to use the storage associated and supported by major browsers Firefox, Chrome and Opera to make it possible to run the Ring API client directly in a browser as a WebExtension.

# Web SQL Database

> Beware. This specification is no longer in active maintenance and the Web Applications Working Group does not intend to maintain it further. -- [w3.org](https://dev.w3.org/html5/webdatabase/)

# IndexedDB

More explorations needed but seems heavy in code [w3.org](https://www.w3.org/TR/IndexedDB/)

# HTML5 Storage

It is light in code, mature and supported by almost every web browser.

## Cache

This data is attached to the current browser session.

    account_id      # what account is being used

## LocalStorage

This data persists after closing a browser.

    /* Layout
     *
     * ring.cx-<account_id>
     *   |
     *   +---contacts
     *           |
     *           +---<ring_id>
     *                   |
     *                   +---details
     *                   |     |
     *                   |     +---name
     *                   |     +---lastname
     *                   |
     *                   +---chat_history
     *                           |
     *                           +---<datetime>
     *                                  |
     *                                  +---id
     *                                  +---status
     *                                  +---content
     *                                  +---mime_type
     */

TODO:
* accounts types (native SIP IP2IP and SIP with Ring encrypting over OpenDHT)
* profile image

Local Storage is based on *(key, value)* pair where the value is a JSON string. Therefore, it is better to avoid having nested *ring.cx -- account_id -- type -- ...* because for a simple write operation to a chat history you will have to load (parse) the whole JSON string and then overwrite it to save it. This may cause an increase in latency on operations and potentially corrupt other user accounts due to programming errors.

## Chrome Storage

This API has been optimized to meet the specific storage needs of extensions. It provides the same storage capabilities as the localStorage API with the following key differences:

* It's asynchronous with bulk read and write operations, and therefore faster than the blocking and serial localStorage API.

* User data can be stored as objects (the localStorage API stores data in strings).

### Cons

1. Dead Objects with modal windows

    It happened when the chrome storage generated Dead Objects if the modal window was closed before the asynchronous operation was completed.

2. Incompatible with native LocalStorage

        localStorage.setItem('a', 'b');
        localStorage.getItem('a');
        //"b"

        chrome.storage.local.get('a', function(item){console.log(item)})
        //Object {}

        chrome.storage.local.set('a', 'b')
        chrome.storage.local.get('a', function(item){console.log(item)})
        //Object {a: "b"}

