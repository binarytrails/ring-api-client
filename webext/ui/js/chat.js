
/* TODO:
 *  chat history:
 *      store message_id
 *      store / load mime_type
 *  add profile image
 *  chatHistory: hide same user image if the last history item is his
 */

/* FIXME:
 * enter key to create / update contact
 * search not working without refresh on update / create contact
 */

// HTML elements of the page

var htmlChatHistory = document.getElementById('chatHistory'),
    htmlContacts = document.getElementById('contacts'),
    htmlContact = document.getElementsByClassName('contact'),
    htmlAddContact = document.getElementById('addContact');

// Global variables

// TODO load from cookies after account wizard is coded

var ringAPI = new RingAPI('127.0.0.1', '8080', '5678'),
    storage = new RingLocalStorage(),
    currentAccountId  = '2dcb4c8fd4cee100',
    currentContactId = null;

// Initializing

initRingUser();
initContacts();
initChatHistory();

// Contact notifications
storage.clearContactsNotifications();
$('#contactsNotifications').html('0');

function initRingUser()
{
    var ringUser = storage.getUser();

    if (!ringUser)
    {
        ringUser = storage.createUser('Richard', 'User');
    }
}

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
        // set first contact as 'talk to'
        talkToContact(contacts[0]);
    }
}

// Global functions

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

// Chat

function showError(header, body)
{
    $('#errorHeader').html(header);
    $('#errorBody').html(body);
    $('#error').modal('show');
}

function initChatHistory()
{
    loadContactChatHistory();
    clearNotifications(currentContactId);
    $('#chatReply input').focus();
    scrolldownChatHistory();
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

// Contact

function incrementNotification(contactId)
{
    if (contactId == currentContactId)
    {
        return;
    }

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

// User Events listeners

// Chat

$('#chatReply').keypress(function(e)
{
    if (e.keyCode == 13) // Enter
    {
        var message = $('#chatReply input').val(),
            messageStatus = 'sent';

        ringAPI.sendAccountMessage(
             currentAccountId, currentContactId,
            'text/plain', message,
            function(data)
            {
                var message_id = data['message_id'];

                // save to storage
                storage.addAccountContactHistory(currentAccountId,
                    currentContactId, messageStatus, message);

                addChatHistoryItem('text/plain', message, 'right', false);
                scrolldownChatHistory();

                $('#chatReply input').val('');
                $('#chatReply input').focus();
            }
        );
    }
});

// Contacts

$('#showContacts').click(function()
{
    $('#sidebarContacts')
        .sidebar('toggle');
        //.sidebar('setting', 'transition', 'overlay')
});

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

function selectContact()
{
    var ringId = this.id;
    talkToContact(ringId);
}

function updateContact()
{
    var contactId = $(this).parent()[0].id;
    talkToContact(contactId);

    var contact = storage.getContact(currentContactId);

    if (!contact.profile)
    {
        throw new Error('Contact has no profile');
    }

    // Setup the Contact Modal
    $('#contactModalHeader').text('Update Contact');
    $('#contactModalDeny').text('Delete');
    $('#contactModalError').hide();
    $('#contactModalName').val(contact.profile.name);
    $('#contactModalLastname').val(contact.profile.lastname);
    $('#contactModalRingId').val(currentContactId);

    $('#contactModal').modal({
        // update
        onApprove: function() {

            var ringId = $('#contactModalRingId').val();

            // Updated Ring ID
            if (ringId != currentContactId)
            {
                var existingContact = storage.getContact(ringId);

                if (existingContact)
                {
                    $('#contactModalErrorHeader').text('Not a new contact');
                    $('#contactModalErrorMessage').text(
                        'There is a contact with the same Ring ID. ' +
                        'Please, modify the existing one.'
                    );
                    $('#contactModalError').show();
                    $('#contactModal').show();
                    return false;
                }
                // New Ring Id means we have to delete the current
                storage.deleteAccountContact(
                    currentContactId, currentAccountId);

                // Update HTML
                document.getElementById(currentContactId).id = ringId;
            }

            // Update
            var first = $('#contactModalName').val(),
                last = $('#contactModalLastname').val();

            storage.updateContact(ringId, first, last);
            console.log(contactId);

            // Update HTML
            $('#' + contactId + ' .text').html(first + ' ' + last);

        },
        // delete
        onDeny: function() {
            storage.deleteAccountContact(
                currentAccountId, currentContactId);
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

    /* TODO: format contact name length
     * It's possible to achieve it via css but not with .text using <i>.
     *
    if (name.length > 10)
    {
        name = name.substring(0, 10) + '..';
    }
    */

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

    // create it
    var contactId = storage.createContact(firstname, lastname);

    // add to html
    addContactToHtml(contactId, firstname, lastname,
        selectContact, updateContact);

    // set interlocutor
    talkToContact(contactId);

    return true;
}

$('#addContact').click(function()
{
    $('#contactModalHeader').text('New Contact');
    $('#contactModalError').hide();
    $('#contactModalDeny').text('Cancel');
    $('#contactModalName').val('');
    $('#contactModalLastname').val('');
    $('#contactModalRingId').val('');

    $('#contactModal').modal({
        onApprove: addContact
    }).modal('show');
});

$('#contactModalErrorClose').click(function(){
    $('#contactModalError').hide();
});

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
            var textPlain = content['text/plain']; // FIXME see: top list

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

