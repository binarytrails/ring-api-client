
var ringLocalStorage = {};

// Contacts

ringLocalStorage.accountContacts = function(accountId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
    return data[accountId]['contacts'];
}

ringLocalStorage.accountContact = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
    return data[accountId]['contacts'][contactId];
}

ringLocalStorage.saveAccountContact = function(accountId, contact)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    accountContacts[contact.ringId] = {
        'profile': {
            'name': contact.name,
            'lastname': contact.lastname
        }
    };
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

ringLocalStorage.updateAccountContact = function(accountId, contact)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    delete accountContacts[contact.ringId];

    accountContacts[contact.ringId] = {
        'profile': {
            'name': contact.name,
            'lastname': contact.lastname
        }
    };
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

ringLocalStorage.deleteAccountContact = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx'));
        accountContacts = data[accountId]['contacts'];

    delete accountContacts[contactId];
    data[accountId]['contacts'] = accountContacts;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

// Chat History

ringLocalStorage.accountContactHistory = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx')),
        contact = data[accountId]['contacts'][contactId];

    if (!contact)
    {
        throw new Error("Contact with id '" + contactId + "' doesn't exists");
    }
    else if (contact['history'])
    {
        return contact['history'];
    }
}

ringLocalStorage.addAccountContactHistory = function(
    accountId, contactId, messageStatus, message)
{
    if (!message)
    {
        throw new Error('No messageStatus provided');
    }

    if (!(messageStatus == 'sent' || messageStatus == 'received'))
    {
        throw new Error("The messageStatus is not in the list " +
            "('sent', 'received')");
    }

    var data = JSON.parse(localStorage.getItem('ring.cx')),
        contact = data[accountId]['contacts'][contactId],
        history = contact['history'];

    if (!history)
    {
        history = {}
    }

    history[Date()] = {
        message: message,
        messageStatus: messageStatus
    }

    data[accountId]['contacts'][contactId]['history'] = history;

    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true;
}

ringLocalStorage.deleteContactHistory = function(accountId, contactId)
{
    var data = JSON.parse(localStorage.getItem('ring.cx')),
        contact = data[accountId]['contacts'][contactId];

    if (!contact)
    {
        throw new Error("Contact with id '" + contactId + "' doesn't exists");
    }
    else if (!contact['history'])
    {
        throw new Error("Contact with id '" + contactId + "' has no history");
    }

    delete data[accountId]['contacts'][contactId]['history'];
    localStorage.setItem('ring.cx', JSON.stringify(data));
    return true
}

