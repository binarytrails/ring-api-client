
function ringIconClick()
{
    chrome.tabs.create({
        "url": chrome.extension.getURL("ui/chat.html")
    });
}

chrome.browserAction.onClicked.addListener(ringIconClick);
 
