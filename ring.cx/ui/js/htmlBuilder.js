
var htmlBuilder = {};

htmlBuilder.chatHistoryItem = function(text, cssFloat)
{
    var chatHistoryItem = document.createElement("div"),
        chatHistoryItemImage = document.createElement("div"),
        chatHistoryItemText = document.createElement("div");

    chatHistoryItem.className = "chatHistoryItem";
    chatHistoryItemImage.className = "chatHistoryItemImage";
    chatHistoryItemText.className = "chatHistoryItemText";

    chatHistoryItemImage.innerHTML =
       '<i class="fa fa-user fa-3x" aria-hidden="true"></i>';

    chatHistoryItemText.innerHTML = text;

    chatHistoryItemImage.style.cssFloat = cssFloat;
    chatHistoryItemText.style.cssFloat = cssFloat;

    chatHistoryItem.appendChild(chatHistoryItemImage);
    chatHistoryItem.appendChild(chatHistoryItemText);

    return chatHistoryItem;
}

htmlBuilder.contactsItem = function(id, text)
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

