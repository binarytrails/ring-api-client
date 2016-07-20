
var htmlBuilder = {};

htmlBuilder.chatHistoryItem = function(text, cssFloat, hideImage=false)
{
    var chatHistoryItem = document.createElement("div"),
        chatHistoryItemImage = document.createElement("div"),
        chatHistoryItemText = document.createElement("div");

    chatHistoryItem.className = "chatHistoryItem";
    chatHistoryItemImage.className = "chatHistoryItemImage";
    chatHistoryItemText.className = "chatHistoryItemText";

    if (!hideImage)
    {
        chatHistoryItemImage.innerHTML = '<i class="huge spy icon"></i>';
    }
    chatHistoryItemText.innerHTML = text;

    chatHistoryItemImage.style.cssFloat = cssFloat;
    chatHistoryItemText.style.cssFloat = cssFloat;

    chatHistoryItem.appendChild(chatHistoryItemImage);
    chatHistoryItem.appendChild(chatHistoryItemText);

    return chatHistoryItem;
}

htmlBuilder.contact = function(id, firstLastNames, imageSrc=null)
{
    var contacts = document.createElement('div'),
        image = null;
        text = document.createElement('i');
        notifications = document.createElement('i');
        options = document.createElement('i');

    contacts.id = id;

    contacts.className = 'ui label contact';
    text.className = 'text';
    notifications.className = 'notifications';
    options.className = 'large ellipsis vertical icon options';

    if (imageSrc)
    {
        image = document.createElement('img');
        image.className = 'ui right spaced avatar image';
        image.src = imageSrc;
    }
    else
    {
        image = document.createElement('i');
        image.className = 'big user icon';
    }
    text.innerHTML = firstLastNames;

    contacts.appendChild(image);
    contacts.appendChild(text);
    contacts.appendChild(options);
    contacts.appendChild(notifications);

    return contacts;
}

