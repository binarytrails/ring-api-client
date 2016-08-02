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


// ----------------------LocalStorage Tests---------------------------

console.log('Testing js/localStorage-rewrite.js');
localStorage.clear();

var storage = new uiLocalStorage.RingLocalStorage();
console.assert(storage != null, 'Failed to intiate RingLocalStorage');

// USER table

// create
var user = storage.createUser('a', 'b');
console.assert(user != {}, 'Failed to CREATE user');
console.assert(user.FIRSTNAME == 'a', 'Failed to SET user FIRSTNAME on CREATE');
console.assert(user.LASTNAME == 'b', 'Failed to SET user LASTNAME on CREATE');
console.assert(_.isEmpty(user.ACCOUNTS), 'Failed to SET user ACCOUNTS on CREATE');

// get
console.assert(_.isEqual(user, storage.getUser()),
    "Get didn't returned the created user");

// UPDATE
var newUser = storage.updateUser('c');
console.assert(_.isEqual(newUser.name, storage.getUser().name),
    'Failed to UPDATE the user');

// CONTACT table

// CREATE
var contactId = storage.createContact('a', 'b');

// test add to user contacts
console.assert(storage.contactExists(contactId), 'Failed to ADD contact to user');

// test add to contacts
var contact = storage.getContact(contactId);

console.assert(contact.FIRSTNAME == 'a',
    'Failed to SET contact FIRSTNAME on CREATE');
console.assert(contact.LASTNAME == 'b',
    'Failed to SET contact LASTNAME on CREATE');

// UPDATE

// update info
storage.updateContact(contact.ID, firstname='x', lastname='y');

console.assert(storage.getContact(contactId).FIRSTNAME == 'x',
    'Failed to SET contact FIRSTNAME on UPDATE');
console.assert(storage.getContact(contactId).LASTNAME == 'y',
    'Failed to SET contact LASTNAME on UPDATE');

// add account
var settings = {'x': 1, 'y': 2};
storage.addContactAccount(contact.ID, 'a', settings);

console.assert(_.isEqual(
    storage.getContact(contact.ID).ACCOUNTS['a'], settings),
    'Failed to ADD contact account');

// delete account

console.assert(storage.contactAccountExists(contact.ID, 'a'),
    'Cannot test delete account of a contact');
storage.deleteContactAccount(contact.ID, 'a');

console.assert(!storage.contactAccountExists(contact.ID, 'a'),
    'Failed to DELETE contact account');

// DELETE

console.assert(storage.contactExists(contactId),
    'Cannot test DELETE contact');

storage.deleteContact(contactId);

// test delete from user contacts
console.assert(!storage.userContact(contactId),
    'Failed to DELETE contact from user contacts');

// test delete from contacts
console.assert(!storage.contactExists(contactId),
    'Failed to DELETE contact from contacts');

console.log('\nAll unit-tests passed');

