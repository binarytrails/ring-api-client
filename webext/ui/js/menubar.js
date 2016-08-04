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

// Notifications

function incrementNotification(contactId)
{
    if (contactId == currentContactId) return;

    var value = $('#' + contactId + ' .notifications').html();

    if (!value)
    {
        value = 1;
    }
    else
    {
        value = parseInt(value);
        value += 1;
    }

    // global contacts counter
    storage.incrementContactsNotifications();
    $('#contactsNotifications').html(storage.contactsNotifications());

    // this contact
    $('#' + contactId + ' .notifications').html(value);
    $('#' + contactId + ' .notifications').css('display', '');
}

function clearNotifications(contactId)
{
    // global contacts counter
    var counter = $('#' + contactId + ' .notifications').html();
        newTotal = storage.substractContactsNotifications(counter);
    $('#contactsNotifications').html(newTotal);

    // this contact
    $('#' + contactId + ' .notifications').html('');
    $('#' + contactId + ' .notifications').css({'display': 'none'});
}

