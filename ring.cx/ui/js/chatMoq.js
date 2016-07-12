
function randomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function moqChatHistory()
{
    var chatHistory = document.getElementById("chatHistory");

    for (var i = 0; i < 5; i++)
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
    var contacts = document.getElementById("contacts"),
        addContact = document.getElementById("addContact");

    for (var i = 0; i < 5; i++)
    {
        contactsItem = buildHtmlContactsItem('id-' + i, 'Contact ' + i);
        contacts.insertBefore(contactsItem, addContact);
    }
}

// Acts like onload if the <script> has an async attribute

moqChatHistory();
moqContacts();

