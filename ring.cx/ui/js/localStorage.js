
function saveContact(accountId, contact)
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

