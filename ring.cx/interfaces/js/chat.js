
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


        // Profile Image
        chatHistoryItemImage.className = "chatHistoryItemImage";

        // Placeholder FontAwesome user icon
        icon = '<i class="fa fa-user fa-3x" aria-hidden="true"></i>'
        chatHistoryItemImage.innerHTML = icon;


        // Text
        chatHistoryItemText.className = "chatHistoryItemText";

        // Conversation
        text = "<p>Bla ";
        for (var j = 0; j < randomInt(10, 500); j++)
        {
            text += "bla ";
        }
        chatHistoryItemText.innerHTML = (text += "</p>");

        // With an imaginary friend
        var cssFloat = "right";
        if (i % 2 == 1) cssFloat = "left";
        chatHistoryItemImage.style.cssFloat = cssFloat;
        chatHistoryItemText.style.cssFloat = cssFloat;


        chatHistoryItem.appendChild(chatHistoryItemImage);
        chatHistoryItem.appendChild(chatHistoryItemText);

        chatHistory.appendChild(chatHistoryItem);
    }
}

// Acts like onload if the <script> has an async attribute
moqChatHistory();

