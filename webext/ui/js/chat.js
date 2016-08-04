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

var htmlChatHistory = document.getElementById('chatHistory');

initContacts();
initChatHistory();

// Global functions

function initChatHistory()
{
    loadContactChatHistory();
    clearNotifications(currentContactId);
    $('#chatReply input').focus();
    scrolldownChatHistory();
}

function showError(header, body)
{
    $('#errorHeader').html(header);
    $('#errorBody').html(body);
    $('#error').modal('show');
}

function addChatHistoryItem(mimeType, message, side, hideImage=false)
{
    var chatHistoryItem = htmlBuilder.chatHistoryItem(
        message, side, hideImage);

    htmlChatHistory.appendChild(chatHistoryItem);
}

function scrolldownChatHistory()
{
    $('#chatHistory').animate({
        scrollTop: $('#chatHistory').prop("scrollHeight")
    }, 0);
}

function loadContactChatHistory()
{
    htmlChatHistory.innerHTML = '';

    var chatHistory = storage.accountContactHistory(
        currentAccountId, currentContactId);

    for (var key in chatHistory)
    {
        var item = chatHistory[key],
            side = 'left';

        if (item.messageStatus == 'sent')
        {
            side = 'right';
        }

        addChatHistoryItem('text/plain', item.message, side, false);
    }
}

// Websockets callbacks

ringAPI.websocket.onopen = function(event)
{
    console.log('Ring API websocket opened');
};

ringAPI.websocket.onclose = function(event)
{
    showError('Websocket connection failed',
        'Verify that the Ring API is running and you are using the same port');
};

ringAPI.websocket.onmessage = function(event)
{
    var data = JSON.parse(event.data);

    if (data.account_message)
    {
        var message = data.account_message,
            messageStatus = 'received',
            ringId = message.from_ring_id,
            content = message.content;

        var contact = storage.getContact(ringId);

        // in contacts
        if (contact)
        {
            var textPlain = content['text/plain']; // FIXME

            // save to storage
            storage.addAccountContactHistory(
                currentAccountId, ringId, messageStatus, textPlain);

            if (ringId == currentContactId)
            {
                addChatHistoryItem('text/plain', textPlain, 'left', false);
                $('#chatReply input').focus();
                scrolldownChatHistory();
            }
            else
            {
                incrementNotification(ringId);
            }
        }
    }
};

$('#contactsNotifications').html(storage.getContactsNotifications());
