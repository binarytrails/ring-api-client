/*
 *  Copyright (C) 2016 Savoir-faire Linux Inc.
 *
 *  Author: Seva Ivanov <seva.ivanov@savoirfairelinux.com>
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301 USA.
 */

var program = require('commander'),
    ip_port_regex = require('ip-port-regex'),
    express = require('express'),
    app = express(),
    _ = require("underscore"),
    server = require('http').Server(app);

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-a, --address <ip:port>', 'listen on the ip address and port', ip_port_regex.v4())
  .parse(process.argv);

if (!program.address)
{
    console.log(program.help());
    process.exit(0);
}

var static_dir = "/ui";

server.listen(ip_port_regex.parts(program.address)['port'],
        ip_port_regex.parts(program.address)['ip'], function()
        {
            console.log("Listening on http://%s:%s",
                    server.address().address,
                    server.address().port
            );
        }
);

app.use(express.static(__dirname + static_dir));

app.get('/', function(req, res)
{
   res.sendFile(__dirname + '/ui/chat.html');
});

