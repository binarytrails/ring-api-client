
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

        chatHistoryItem.appendChild(chatHistoryItemImage);
        chatHistoryItem.appendChild(chatHistoryItemText);
        
        chatHistory.appendChild(chatHistoryItem);
    }
}

function moqChatData()
{
    moqChatHistory();
}

