/*
    This is a demo file to demonstrate that Sweet Alert doens't work with
    WebExtension Chromes local storage. It generates Dead Objects.
*/

// Useful elements of the page

var chatHistory = document.getElementById('chatHistory'),
    contacts = document.getElementById('contacts'),
    contactsItem = document.getElementsByClassName('contactsItem'),
    addContact = document.getElementById('addContact');

// Extra objects

var storage = chrome.storage.local;

// test to make modal attached to main
var sweetAlert = swal;

// Callbacks for chrome storage get()

function populateContacts(item)
{
    console.log(item);
    
    // apply to all contacts
    //for (var i = 0; i < contactsItem.length; i++)
    //{
    //    contactsItem[i].addEventListener('click', contactsItemClick, false);
    // }

}

function showContact(item)
{
    var ringId = Objects.keys(item)[0];
    
    a = ringId;
    b = item;

    if (chrome.runtime.lastError)
    {
        sweetAlert({
            title: 'Not Found.',
            text: "The contact doesn't exist in the local storage.",
            type: 'error'
        });
        console.log(chrome.runtime.lastError);
    }
    else if (item)
    {
        var ringId = Object.keys(item)[0],
            name = item[ringId].name,
            lastname = item[ringId].lastname;
        
        html = "<div class='dynamicHtml'>" +
            "<p>" + ringId + "<input type='text'></p>" +
            "<p>" + name + "<input type='text'></p>" +
            "<p>" + lastname + "<input type='text'></p></div>";
        
        sweetAlert({
            title: 'Found',
            html: html
        });

        // TODO update

        console.log(item);
    }
}

// User Events listeners

// Contacts

function contactsItemClick()
{
    ringId = this.id;
    storage.get(ringId, showContact);
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

        var contactsItem = document.getElementById(ringId);
        if (contactsItem)
        {
            sweetAlert(
                'Contact exists!',
                name + ' ' + lastname + ' is not a new contact.',
                'error'
            )
            return
        }

        storage.set({ringId: {
            'name': name,
            'lastname': lastname
        }});

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

// Populate form

function loadContacts()
{
    // with no `keys` argument, retrieve everything
    storage.get(populateContacts)
}

loadContacts();

