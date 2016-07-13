
var ringLocalStorage = {};

ringLocalStorage.accountContacts = function(accountId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
    return data[accountId]['contacts'];
}

ringLocalStorage.saveAccountContact = function(accountId, contact)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    accountContacts[contact.ringId] = {
        'details': {
            'name': contact.name,
            'lastname': contact.lastname
        }
    };
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
}

ringLocalStorage.updateAccountContact = function(accountId, contact)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    delete accountContacts[contact.ringId];

    accountContacts[contact.ringId] = {
        'details': {
            'name': contact.name,
            'lastname': contact.lastname
        }
    };
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
}


ringLocalStorage.deleteAccountContact = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    delete accountContacts[contactId];
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
}

