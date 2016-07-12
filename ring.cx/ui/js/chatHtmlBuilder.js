
function buildHtmlContactsItem(id, text)
{
    var contactsItem = document.createElement('div'),
        contactsItemImage = document.createElement('div'),
        contactsItemText = document.createElement('div');
        contactsItemOptions = document.createElement('div');

    contactsItem.id = id;

    contactsItem.className = 'contactsItem';
    contactsItemImage.className = 'contactsItemImage';
    contactsItemText.className = 'contactsItemText';
    contactsItemOptions.className = 'contactsItemOptions';

    contactsItemImage.innerHTML =
       '<i class="fa fa-user fa-3x" aria-hidden="true"></i>';

    contactsItemText.innerHTML = '<p>' + text + '</p>';

    contactsItemOptions.innerHTML =
        '<i class="fa fa-ellipsis-v fa-2x" aria-hidden="true"></i>';

    contactsItem.appendChild(contactsItemImage);
    contactsItem.appendChild(contactsItemText);
    contactsItem.appendChild(contactsItemOptions);

    return contactsItem;
}

