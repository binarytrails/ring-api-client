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

var htmlContacts = document.getElementById('contacts'),
    htmlContact = document.getElementsByClassName('contact'),
    htmlAddContact = document.getElementById('addContact');

// User event listeners

$('#showContacts').click(function()
{
    $('#sidebarContacts')
        .sidebar('toggle');
        //.sidebar('setting', 'transition', 'overlay')
});

$('#addContact').click(function()
{
    showContactModal(null, 'New Contact', 'Cancel', 'Submit');

    $('#contactModal').modal(
    {
        onApprove: addContact
    
    }).modal('show');
});

$('#contactModalErrorClose').click(function(){
    $('#contactModalError').hide();
});

$('.ui.search')
    .search({
        source: formatContactsSearch(currentAccountId),
        searchFields: [
            'ringId', 'name', 'lastname'
        ],
        fields: {
            categories      : 'results',     // array of categories (category view)
            categoryName    : 'name',        // name of category (category view)
            categoryResults : 'results',     // array of results (category view)
            description     : 'description', // result description
            results         : 'results',     // array of results (standard)
            title           : 'title'        // result title
        },
        onSelect: function(result)
        {
            talkToContact(result.ringId);
        },
    })
;
$('.ui.search .results').css({'width': '100%'});

// Global functions

function initContacts()
{
    var contacts = storage.getUserContacts();

    for (var i = 0; i < contacts.length; i++)
    {
        var contact = storage.getContact(contacts[i]);

        addContactToHtml(contact.ID, contact.FIRSTNAME, contact.LASTNAME,
            selectContact, updateContact);
    }

    if (contacts)
    {
        talkToContact(contacts[0]);
    }
}

function talkToContact(contactId)
{
    // set current background to default
    var htmlContact = document.getElementById(currentContactId);

    if (htmlContact)
    {
        htmlContact.style.opacity = 0.8;
    }

    // set new interlocutor as current
    currentContactId = contactId;
    htmlContact = document.getElementById(currentContactId);

    // set new interlocutor background to focused
    if (htmlContact)
    {
        htmlContact.style.opacity = 1;
    }

    initChatHistory()
}
function formatContactsSearch(accountId)
{
    var searchArray = new Array(),
        contacts = storage.getUserContacts();

    for (var i = 0; i < contacts.length; i++)
    {
        var contact = storage.getContact(contacts[i]),
            name = contact.FIRSTNAME + ' ' + contact.LASTNAME;

        searchArray.push({
            'title':        name,
            'description':  contact.ID,
            'contactId':    contact.ID,
            'name':         contact.FIRSTNAME,
            'lastname':     contact.LASTNAME
        });
    }

    return searchArray;
}

function selectContact()
{
    var ringId = this.id;
    talkToContact(ringId);
}

function showContactModal(contact, header, deny, accept)
{
    $('#contactModalHeader').text('Update Contact');
    $('#contactModalDeny').text(deny);
    $('#contactModalError').hide();
    
    if (contact)
    {
        $('#contactModalName').val(contact.FIRSTNAME);
        $('#contactModalLastname').val(contact.LASTNAME);
    }
    else
    {
        $('#contactModalName').val('');
        $('#contactModalLastname').val('');
    }
}

function updateContact()
{
    var contactId = $(this).parent()[0].id;
        contact = storage.getContact(contactId);
    
    talkToContact(contactId);
    
    showContactModal(contact, 'Update Contact', 'Delete', 'Submit');

    if (!contact)
    {
        throw new Error('Contact with Id ' + contactId + " wasn't found.");
    }

    $('#contactModal').modal({
        // update
        onApprove: function() {
            var first = $('#contactModalName').val(),
                last = $('#contactModalLastname').val();

            storage.updateContact(contactId, first, last);
            $('#' + contactId + ' .text').html(first + ' ' + last);
        },
        // delete
        onDeny: function()
        {
            storage.deleteContact(contactId);
            document.getElementById(currentContactId).remove();
        }
    }).modal('show');
}

function showContactModalError(header, body)
{
    $('#contactModalErrorHeader').text(header);
    $('#contactModalErrorMessage').text(body);
    $('#contactModalError').show();
    $('#contactModal').show();
}

function addContactToHtml(contactId, firstname, lastname,
    onBodyClick, onOptionsClick)
{
    var name = firstname + ' ' + lastname;

    // You can add an image path as last argument
    // i.e. 'images/avatar/large/white-image.png');
    htmlContact = htmlBuilder.contact(contactId, name);

    htmlContact.addEventListener('click', onBodyClick, false);

    var contactsItemOptions = htmlContact.childNodes[2];
    contactsItemOptions.addEventListener('click', onOptionsClick, false);

    htmlContacts.insertBefore(htmlContact, htmlAddContact);
}

function addContact()
{
    var firstname = $('#contactModalName').val(),
        lastname = $('#contactModalLastname').val();

    var contactId = storage.createContact(firstname, lastname);

    addContactToHtml(contactId, firstname, lastname,
        selectContact, updateContact);

    talkToContact(contactId);

    return true;
}

