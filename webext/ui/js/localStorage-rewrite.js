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

/* Documentation:   Storage.md -> wiki
 * Diagram:         Image -> extra/diagrams/localStorage.png
 */

// Constructor

var RingLocalStorage = function()
{
    // Generates a singleton
    this.userID = 'RingUser1';
};

// exposure to node.js
module.exports.RingLocalStorage = RingLocalStorage;

// User

// TODO validate accounts templates

RingLocalStorage.prototype.createUser = function(
    name, lastname, accounts, contacts={})
{
    if (localStorage.getItem(this.userID))
    {
        throw new Error('User already created');
    }
    else if (!accounts)
    {
        throw new Error('You need at least one account to create the user');
    }
    
    var user = {
        'ID':       this.userID,
        'NAME':     name,
        'LASTNAME': lastname,
        'ACCOUNTS': accounts,
        'CONTACTS': contacts
    };

    localStorage.setItem('user', JSON.stringify(user));
    return user;
};

RingLocalStorage.prototype.getUser = function()
{
    return JSON.parse(localStorage.getItem('user'));
};

RingLocalStorage.prototype.updateUser = function(
    name=null, lastname=null, accounts=null, contacts=null)
{
    var user = this.getUser();

    user = {
        'ID':       this.userID,
        'NAME':     !name ? user.name : name,
        'LASTNAME': !lastname ? user.lastname : lastname,
        'ACCOUNTS': !accounts ? user.accounts : accounts,
        'CONTACTS': !contacts ? user.contacts : contacts
    };

    localStorage.setItem('user', JSON.stringify(user));
    return user;
};

// deleteUser: You delete the plugin.

// Contacts

RingLocalStorage.prototype.accountContacts = function(accountId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx')),
        account = data[accountId];

    if (!account)
    {
        throw new Error("Account '" + account + "' doesn't exists");
    }

    return account['contacts'];
}

RingLocalStorage.prototype.accountContact = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
    return data[accountId]['contacts'][contactId];
}

RingLocalStorage.prototype.saveAccountContact = function(accountId, contact)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    accountContacts[contact.ringId] = {
        'profile': {
            'name': contact.name,
            'lastname': contact.lastname
        }
    };
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

RingLocalStorage.prototype.updateAccountContact = function(accountId, contact)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    delete accountContacts[contact.ringId];

    accountContacts[contact.ringId] = {
        'profile': {
            'name': contact.name,
            'lastname': contact.lastname
        }
    };
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

RingLocalStorage.prototype.deleteAccountContact = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    delete accountContacts[contactId];
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

// Notifications

RingLocalStorage.prototype.incrementContactsNotifications = function()
{
    var total = parseInt(localStorage.getItem('contactsNotifications'));
    localStorage.setItem('contactsNotifications', total += 1);
}

RingLocalStorage.prototype.contactsNotifications = function()
{
    return localStorage.getItem('contactsNotifications');
}

RingLocalStorage.prototype.substractContactsNotifications = function(value)
{
    var total = localStorage.getItem('contactsNotifications');
    localStorage.setItem('contactsNotifications', total - value);
    return total - value;
}

RingLocalStorage.prototype.clearContactsNotifications = function()
{
    localStorage.setItem('contactsNotifications', 0);
}

// Chat History

RingLocalStorage.prototype.accountContactHistory = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx')),
        contact = data[accountId]['contacts'][contactId];

    if (!contact)
    {
        return null;
    }
    else if (contact['history'])
    {
        return contact['history'];
    }
}

RingLocalStorage.prototype.addAccountContactHistory = function(
    accountId, contactId, messageStatus, message)
{
    if (!message)
    {
        throw new Error('No messageStatus provided');
    }

    if (!(messageStatus == 'sent' || messageStatus == 'received'))
    {
        throw new Error("The messageStatus is not in the list " +
            "('sent', 'received')");
    }

    var data = JSON.parse(localStorage.getItem('ring.cx')),
        contact = data[accountId]['contacts'][contactId],
        history = contact['history'];

    if (!history)
    {
        history = []
    }

    history.push({
        datetime: Date(),
        message: message,
        messageStatus: messageStatus
    });

    data[accountId]['contacts'][contactId]['history'] = history;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

RingLocalStorage.prototype.deleteContactHistory = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx')),
        contact = data[accountId]['contacts'][contactId];

    if (!contact)
    {
        throw new Error("Contact with id '" + contactId + "' doesn't exists");
    }
    else if (!contact['history'])
    {
        throw new Error("Contact with id '" + contactId + "' has no history");
    }

    delete data[accountId]['contacts'][contactId]['history'];
    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true
}

