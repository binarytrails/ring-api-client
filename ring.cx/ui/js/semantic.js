
var ringSemantic = {}

ringSemantic.accountContactsSearchFormat = function()
{
    var searchArray = new Array(),
        accountContacts = ringLocalStorage.accountContacts(accountId);
    
    for (var contactId in accountContacts)
    {
        var profile = accountContacts[contactId].profile;
        if (profile)
        {
            searchArray.push({
                'title': profile.name + ' ' + profile.lastname,
                'description': contactId,
                'ringId': contactId,
                'name': profile.name,
                'lastname': profile.lastname
            });
        }
    }
    return searchArray;
}
