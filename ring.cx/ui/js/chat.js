
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
        html: html
    });

    // TODO update contact data
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
        sweetAlert('Error!', error.message, 'error');
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
        var name = document.getElementById('newContactName').value,
            lastname = document.getElementById('newContactLastname').value,
            ringId = document.getElementById('newContactRingId').value;

        // Validate contact existence

        var contactsItem = document.getElementById(ringId);
        if (contactsItem)
        {
            sweetAlert(
                'Contact exists!',
                name + ' ' + lastname + ' is not a new contact.',
                'error'
            );
            return
        }

        // Ensure data persistence using Local Storage

        var data = JSON.parse(localStorage.getItem('ring.cx'));
            accountContacts = data[accountId]['contacts'];

        accountContacts[ringId] = {
            'details': {
                'name': name,
                'lastname': lastname
            }
        };
        data[accountId]['contacts'] = accountContacts;

        localStorage.setItem('ring.cx', JSON.stringify(data));

        // Add new contact to HTML UI

        contactsItem = buildHtmlContactsItem(ringId, name + ' ' + lastname);
        contactsItem.addEventListener('click', contactsItemClick, false);
        contacts.insertBefore(contactsItem, addContact);

        sweetAlert(
            'Added!',
            name + ' ' + lastname + ' has been added.',
            'success'
        )
    })
});

function initChatHtml()
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));

    if (!data) return

    var account = data[accountId],
        accountContacts = account['contacts'];

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

