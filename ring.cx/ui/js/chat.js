
/* TODO:
 *  export sweetAlert and/or HTML
 */

// Useful elements of the page

var chatHistory = document.getElementById('chatHistory'),
    contacts = document.getElementById('contacts'),
    contactsItem = document.getElementsByClassName('contactsItem'),
    addContact = document.getElementById('addContact');

// Extra objects

var accountId  = '1', // TODO load from cookies after account wizard coded
    contactId = null;

function setInterlocutorContact(ringId)
{
    if (contactId)
    {
        document.getElementById(contactId).style.background = '#d7f5f0';
    }
    contactId = ringId;
    document.getElementById(ringId).style.background = '#cbf2eb';
}

// Sweet alert templates

function showContact()
{
    var contact = ringLocalStorage.accountContact(accountId, contactId);
    if (!contact.profile)
    {
        sweetAlert('Error', 'Contact has no profile', 'error');
    }
    profile = contact.profile;
    profile['ringId'] = contactId;

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
                ringLocalStorage.deleteAccountContact(accountId, profile.ringId);
            }
            document.getElementById(ringId).childNodes[1].innerHTML =
                '<p>' + profile.name + ' ' + profile.lastname + '</p>';

            profile.ringId = ringId;
            ringLocalStorage.saveAccountContact(accountId, profile);

            sweetAlert(
                'Updated',
                profile.name + ' ' + profile.lastname + ' has been updated.',
                'success'
            );
        },
        function(dismiss){
            if (dismiss == 'cancel') // delete
            {
                ringLocalStorage.deleteAccountContact(accountId, profile.ringId);
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

// Contacts

function contactsItemClick()
{
    var ringId = this.id;
    setInterlocutorContact(ringId);
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
            var profile = accountContacts[ringId]['profile'];
            if (profile)
            {
                contactsItem = buildHtmlContactsItem(ringId,
                    profile.name + ' ' + profile.lastname);
                contactsItem.addEventListener('click', contactsItemClick, false);

                contactsItemOptions = contactsItem.childNodes[2];
                contactsItemOptions.addEventListener(
                    'click', contactsItemOptionsClick, false);

                contacts.insertBefore(contactsItem, addContact);
            }
        }
        // set first contact as 'talk to'
        setInterlocutorContact(Object.keys(accountContacts)[0]);
    }
}

function initChatHistory()
{
    //var chatHistory = ringLocalStorage.accountChatHistory(
    //    accountId, contactId);
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

