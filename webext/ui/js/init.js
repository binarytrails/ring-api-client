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

// Global variables

/* TODO under same domain:
 *          - persistent websocket
 *          - use active user account / contact from local storage
 *              - remove current account, contact variables
 */

var ringAPI = new RingAPI('127.0.0.1', '8080', '5678'),
    storage = new RingLocalStorage(),
    currentAccountId  = '2dcb4c8fd4cee100',
    currentContactId = null;

initRingUser();

function initRingUser()
{
    var ringUser = storage.getUser();

    if (!ringUser)
    {
        ringUser = storage.createUser('Richard', 'User');
    }
}

