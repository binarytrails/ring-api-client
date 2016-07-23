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

var RingAPI = function(host, httpPort, wsPort)
{
    this.host = host;
    this.httpPort = httpPort;
    this.wsPort = wsPort;

    this.httpURL = 'http://' + host + ':' + httpPort + '/';
    this.wsURL = 'ws://' + host + ':' + wsPort + '/';
    this.websocket = new WebSocket(this.wsURL);
};

RingAPI.prototype.sendAccountMessage = function(
    accountId, toRingId, mimeType, message, successCallback)
{
    $.ajax(
    {
        type: 'POST',
        url: this.httpURL + 'accounts/' + currentAccountId + '/message/',
        dataType: 'json',
        data: JSON.stringify(
        {
            ring_id: toRingId,
            mime_type: mimeType,
            message: message
        }),
        success: successCallback,
        cache: false
    });
};

