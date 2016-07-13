
// TODO export sweetAlert and HTML

// Useful elements of the page

var chatHistory = document.getElementById('chatHistory'),
    contacts = document.getElementById('contacts'),
    contactsItem = document.getElementsByClassName('contactsItem'),
    addContact = document.getElementById('addContact');

// Extra objects

var accountId  = '1'; // TODO connect to user account

// Sweet alert templates

function showContact(contact)
{
    html = "<div class='dynamicHtml'>" +
        "<p>Name:<input id='updateContactName' type='text' value='" +
            contact.name + "'></p>" +
        "<p>Lastname:<input id='updateContactLastname' type='text' value='" +
            contact.lastname + "'></p>" +
        "<p>Ring ID:<input id='updateContactRingId' type='text' value='" +
            contact.ringId + "'></p></div>";

    sweetAlert({
        title: 'Contact',
        html: html,
        confirmButtonText: 'Update',
        showCancelButton: true,
        cancelButtonText: 'Delete'

    }).then(
        function() // update
        {
            contact.name = document.getElementById('updateContactName').value;
            contact.lastname = document.getElementById('updateContactLastname').value;

            var ringId = document.getElementById('updateContactRingId').value;

            if (contact.ringId != ringId)
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
                document.getElementById(contact.ringId).id = ringId;
                ringLocalStorage.deleteAccountContact(accountId, contact.ringId);
            }
            document.getElementById(ringId).childNodes[1].innerHTML =
                '<p>' + contact.name + ' ' + contact.lastname + '</p>';

            contact.ringId = ringId;
            ringLocalStorage.saveAccountContact(accountId, contact);

            sweetAlert(
                'Updated',
                contact.name + ' ' + contact.lastname + ' has been updated.',
                'success'
            );
        },
        function(dismiss){
            if (dismiss == 'cancel') // delete
            {
                ringLocalStorage.deleteAccountContact(accountId, contact.ringId);
                document.getElementById(contact.ringId).remove();

                sweetAlert(
                    'Deleted',
                    contact.name + ' ' + contact.lastname + ' has been deleted.',
                    'success'
                );
            }
        }
    );
}

// User Events listeners

// Contacts

function contactsItemClick()
{
    var ringId = this.id,
        data = JSON.parse(localStorage.getItem('ring.cx'));

    try
    {
        contact = data[accountId]['contacts'][ringId]['details'];
    }
    catch (error)
    {
        sweetAlert('Error', error.message, 'error');
    }
    contact['ringId'] = ringId;
    showContact(contact);
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
        var contactsItem = document.getElementById(contact.ringId);
        if (contactsItem)
        {
            sweetAlert(
                'Contact exists',
                contact.name + ' ' + contact.lastname + ' is not a new contact.',
                'error'
            );
            return;
        }

        // Ensure data persistence using Local Storage
        ringLocalStorage.saveAccountContact(accountId, contact);

        // Add new contact to HTML UI
        contactsItem = buildHtmlContactsItem(
                contact.ringId, contact.name + ' ' + contact.lastname);
        contactsItem.addEventListener('click', contactsItemClick, false);
        contacts.insertBefore(contactsItem, addContact);

        sweetAlert(
            'Added',
            contact.name + ' ' + contact.lastname + ' has been added.',
            'success'
        )
    })
});

function initChatHtml()
{
    var accountContacts = ringLocalStorage.accountContacts(accountId);

    if (Object.keys(accountContacts).length)
    {
        for (var ringId in accountContacts)
        {
            contact = accountContacts[ringId]['details'];
            contactsItem = buildHtmlContactsItem(ringId,
                    contact.name + ' ' + contact.lastname);
            contactsItem.addEventListener('click', contactsItemClick, false);
            contacts.insertBefore(contactsItem, addContact);
        }
    }
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
        account = data[accountId];
    }

    if (!account)
    {
        data[accountId] = {
            'contacts': {}
        };
        localStorage.setItem('ring.cx', JSON.stringify(data));
    }
}

initLocalStorage();
initChatHtml();

