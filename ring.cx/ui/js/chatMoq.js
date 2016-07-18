
function randomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function moqChatHistory()
{
    var chatHistory = document.getElementById("chatHistory");

    for (var i = 0; i < 5; i++)
    {
        // Conversation
        text = "<p>Bla ";
        for (var j = 0; j < randomInt(10, 500); j++)
        {
            text += "bla ";
        }
        text += "</p>";

        // Alter who talks
        var cssFloat = "right";
        if (i % 2 == 1) cssFloat = "left";

        var chatHistoryItem = htmlBuilder.chatHistoryItem(
            text, cssFloat);

        chatHistory.appendChild(chatHistoryItem);
    }
}

function moqContacts()
{
    var contacts = document.getElementById("contacts"),
        addContact = document.getElementById("addContact");

    for (var i = 0; i < 5; i++)
    {
        var contactsItem = htmlBuilder.contactsItem('id-' + i, 'Contact ' + i);
        contacts.insertBefore(contactsItem, addContact);
    }
}

// Acts like onload if the <script> has an async attribute

moqChatHistory();
moqContacts();

