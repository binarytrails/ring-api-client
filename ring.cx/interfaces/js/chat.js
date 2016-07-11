
function randomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function moqChatHistory()
{
    chatHistory = document.getElementById("chatHistory");
    for (var i = 0; i < 10; i++)
    {
        var chatHistoryItem = document.createElement("div"),
            chatHistoryItemImage = document.createElement("div"),
            chatHistoryItemText = document.createElement("div");

        chatHistoryItem.className = "chatHistoryItem";
        chatHistoryItemImage.className = "chatHistoryItemImage";
        chatHistoryItemText.className = "chatHistoryItemText";

        chatHistoryItemImage.innerHTML =
           '<i class="fa fa-user fa-3x" aria-hidden="true"></i>';

        // Conversation
        text = "<p>Bla ";
        for (var j = 0; j < randomInt(10, 500); j++)
        {
            text += "bla ";
        }
        chatHistoryItemText.innerHTML = (text += "</p>");

        // Alter who talks
        var cssFloat = "right";
        if (i % 2 == 1) cssFloat = "left";
        chatHistoryItemImage.style.cssFloat = cssFloat;
        chatHistoryItemText.style.cssFloat = cssFloat;

        chatHistoryItem.appendChild(chatHistoryItemImage);
        chatHistoryItem.appendChild(chatHistoryItemText);

        chatHistory.appendChild(chatHistoryItem);
    }
}

function moqContacts()
{
    contacts = document.getElementById("contacts");
    for (var i = 0; i < 10; i++)
    {
        var contactsItem = document.createElement("div"),
            contactsItemImage = document.createElement("div"),
            contactsItemText = document.createElement("div");
            contactsItemOptions = document.createElement("div");

        contactsItem.className = "contactsItem";
        contactsItemImage.className = "contactsItemImage";
        contactsItemText.className = "contactsItemText";
        contactsItemOptions.className = "contactsItemOptions";

        contactsItemImage.innerHTML =
           '<i class="fa fa-user fa-3x" aria-hidden="true"></i>';

        contactsItemText.innerHTML = "<p>Contact #" + i + "</p>";

        contactsItemOptions.innerHTML =
            '<i class="fa fa-ellipsis-v fa-2x" aria-hidden="true"></i>';

        contactsItem.appendChild(contactsItemImage);
        contactsItem.appendChild(contactsItemText);
        contactsItem.appendChild(contactsItemOptions);

        contacts.appendChild(contactsItem);
    }
}

// Acts like onload if the <script> has an async attribute

moqChatHistory();
moqContacts();

