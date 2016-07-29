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

// Libs

// MOQ -- we aren't in a browser
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
    
var _ = require('lodash'),
    diff = require('deep-diff').diff;

// Files

var uiLocalStorage = require('../js/localStorage-rewrite.js');

// LocalStorage Tests

console.log('Testing js/localStorage-rewrite.js');

// USER

var ringLs = new uiLocalStorage.RingLocalStorage();
console.assert(ringLs != null, 'Failed to intiate RingLocalStorage');

var user = ringLs.createUser('a', 'b', {});
console.assert(user != {}, 'Failed to create user');

console.assert(_.isEqual(user, ringLs.getUser()),
    "Get didn't returned the created user");

var newUser = ringLs.updateUser('c');
console.assert(_.isEqual(newUser.name, ringLs.getUser().name),
    'Failed to update the user');

