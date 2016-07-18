
/* TODO:
 *  replace SweetAlert by Semantics popup
 *  replace FontAwesome by Semantics Embeded FontAwesome?
 *  chatHistory: hide individual image if he sent the last message
 */

// HTML elements of the page

var htmlChatHistory = document.getElementById('chatHistory'),
    htmlContacts = document.getElementById('contacts'),
    htmlContactsItem = document.getElementsByClassName('contactsItem'),
    htmlAddContact = document.getElementById('addContact');

// Global variables

// TODO load from cookies after account wizard is coded

var ringApiUrl = 'http:/127.0.0.1:8080/',
    currentAccountId  = '2dcb4c8fd4cee100',
    currentContactId = null;

// Init: ensures it is called before Semantic Search callback

initLocalStorage();
initContacts();
initChatHistory();

// Global functions

function setInterlocutorContact(ringId)
{
    if (currentContactId)
    {
        document.getElementById(currentContactId).style.background = '#d7f5f0';
    }
    currentContactId = ringId;
    document.getElementById(ringId).style.background = '#cbf2eb';
}

function addChatHistoryItem(item, side, hideImage=false)
{
    var chatHistoryItem = htmlBuilder.chatHistoryItem(
        item.message, side, hideImage);
    htmlChatHistory.appendChild(chatHistoryItem);
}

function loadContactChatHistory()
{
    htmlChatHistory.innerHTML = '';

    var chatHistory = ringLocalStorage.accountContactHistory(
        currentAccountId, currentContactId);

    for (var key in chatHistory)
    {
        var item = chatHistory[key],
            side = 'left';

        if (item.messageStatus == 'sent')
        {
            side = 'right';
        }

        addChatHistoryItem(item, side, false);
    }
}

// Sweet alert templates

function showContact()
{
    var contact = ringLocalStorage.accountContact(currentAccountId, currentContactId);
    if (!contact.profile)
    {
        sweetAlert('Error', 'Contact has no profile', 'error');
    }
    profile = contact.profile;
    profile['ringId'] = currentContactId;

    html = "<div class='dynamicHtml'>" +
        "<p>Name:<input id='updateContactName' type='text' value='" +
            profile.name + "'></p>" +
        "<p>Lastname:<input id='updateContactLastname' type='text' value='" +
            profile.lastname + "'></p>" +
        "<p>Ring ID:<input id='updateContactRingId' type='text' value='" +
            profile.ringId + "'></p></div>";

    sweetAlert({
        title: 'Contact',
        html: html,
        confirmButtonText: 'Update',
        showCancelButton: true,
        cancelButtonText: 'Delete'

    }).then(
        function() // update
        {
            profile.name = document.getElementById('updateContactName').value;
            profile.lastname = document.getElementById('updateContactLastname').value;

            var ringId = document.getElementById('updateContactRingId').value;

            if (profile.ringId != ringId)
            {
                if (document.getElementById(ringId))
                {
                    sweetAlert(
                        'Contact exists',
                        'Contact with RingId "' + ringId  + '" exists.',
                        'error'
                    );
                    return;
                }
                document.getElementById(profile.ringId).id = ringId;
                ringLocalStorage.deleteAccountContact(currentAccountId, profile.ringId);
            }
            document.getElementById(ringId).childNodes[1].innerHTML =
                '<p>' + profile.name + ' ' + profile.lastname + '</p>';

            profile.ringId = ringId;
            ringLocalStorage.saveAccountContact(currentAccountId, profile);

            sweetAlert(
                'Updated',
                profile.name + ' ' + profile.lastname + ' has been updated.',
                'success'
            );
        },
        function(dismiss){
            if (dismiss == 'cancel') // delete
            {
                ringLocalStorage.deleteAccountContact(currentAccountId, profile.ringId);
                document.getElementById(profile.ringId).remove();

                sweetAlert(
                    'Deleted',
                    profile.name + ' ' + profile.lastname + ' has been deleted.',
                    'success'
                );
            }
        }
    );
}

// User Events listeners

// Chat

$('#chatReply').keypress(function(e)
{
    // enter key
    if (e.keyCode == 13)
    {
        var message = '<p>' + $('#chatReply input').val() + '</p>',
            messageStatus = 'sent';

        /*
        $.ajax({
            type: 'POST',
            url: ringApiUrl + 'account/' + currentAccountId + '/message/',
            data: {
                ring_id: currentContactId,
                mime_type: 'text/plain',
                message: message
            },
            sucess: function(data)
            {
                console.log(data);
                return;
                ringLocalStorage.addAccountContactHistory(currentAccountId,
                    currentContactId, messageStatus, message);

                var chatHistoryItem = htmlBuilder.chatHistoryItem(message, 'right');
                htmlChatHistory.appendChild(chatHistoryItem);

            }
        });
        */
        ringLocalStorage.addAccountContactHistory(currentAccountId,
            currentContactId, messageStatus, message);

        var chatHistoryItem = htmlBuilder.chatHistoryItem(message, 'right');
        htmlChatHistory.appendChild(chatHistoryItem);
    }
});

// Contacts

$('.ui.search')
    .search({
        source: ringSemantic.accountContactsSearchFormat(currentAccountId),
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
            setInterlocutorContact(result.ringId);
        },
    })
;

function contactsItemClick()
{
    var ringId = this.id;
    setInterlocutorContact(ringId);
    loadContactChatHistory();
}

function contactsItemOptionsClick()
{
    showContact();
}

addContact.addEventListener('click', function()
{
    html = "<div class='dynamicHtml'>" +
        "<p>Name:<input id='newContactName' type='text'></p>" +
        "<p>Lastname:<input id='newContactLastname' type='text'></p>" +
        "<p>Ring ID:<input id='newContactRingId' type='text'></p></div>";

    sweetAlert({
        title: 'New Contact',
        html: html,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true

    }).then(function()
    {
        var contact = {};
        contact['name'] = document.getElementById('newContactName').value;
        contact['lastname'] = document.getElementById('newContactLastname').value;
        contact['ringId'] = document.getElementById('newContactRingId').value;

        // Validate contact existence
        var htmlContactsItem = document.getElementById(contact.ringId);
        if (htmlContactsItem)
        {
            sweetAlert(
                'Contact exists',
                contact.name + ' ' + contact.lastname + ' is not a new contact.',
                'error'
            );
            return;
        }

        // Ensure data persistence using Local Storage
        ringLocalStorage.saveAccountContact(currentAccountId, contact);

        // Add new contact to HTML UI
        htmlContactsItem = htmlBuilder.contactsItem(
            contact.ringId, contact.name + ' ' + contact.lastname);
        htmlContactsItem.addEventListener('click', contactsItemClick, false);
        htmlContacts.insertBefore(htmlContactsItem, htmlAddContact);

        sweetAlert(
            'Added',
            contact.name + ' ' + contact.lastname + ' has been added.',
            'success'
        )
    })
});

// Initializing

function initContacts()
{
    var accountContacts = ringLocalStorage.accountContacts(currentAccountId);

    if (Object.keys(accountContacts).length)
    {
        for (var ringId in accountContacts)
        {
            var profile = accountContacts[ringId]['profile'];
            if (profile)
            {
                htmlContactsItem = htmlBuilder.contactsItem(ringId,
                    profile.name + ' ' + profile.lastname);
                htmlContactsItem.addEventListener('click', contactsItemClick, false);

                contactsItemOptions = htmlContactsItem.childNodes[2];
                contactsItemOptions.addEventListener(
                    'click', contactsItemOptionsClick, false);

                htmlContacts.insertBefore(htmlContactsItem, htmlAddContact);
            }
        }
        // set first contact as 'talk to'
        setInterlocutorContact(Object.keys(accountContacts)[0]);
    }
}

function initChatHistory()
{
    loadContactChatHistory();
}

// TODO move to account wizard creation
function initLocalStorage()
{
    var data = JSON.parse(localStorage.getItem('ring.cx')),
        account = null;

    if (!data)
    {
        data = {};
    }
    else
    {
        account = data[currentAccountId];
    }
    if (!account)
    {
        data[currentAccountId] = {
            'contacts': {}
        };
        localStorage.setItem('ring.cx', JSON.stringify(data));
    }
}

