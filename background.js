var options = {
    type: "basic",
    title: "FB notice",
    message: "",
    iconUrl: "icon.png"
};

var nid = 0;
var count = 0;
var jsCode = 'Number(document.getElementById("notificationsCountValue").innerText)' + '+Number(document.getElementById("requestsCountValue").innerText)' + '+Number(document.getElementById("mercurymessagesCountValue").innerText)';
var tabId;


function checkCount() {
    chrome.tabs.query({
        url: '*://www.facebook.com/*'
    }, function(tabs) {
        if (!tabs || tabs.length === 0) return;
        tabId = tabs[0].id;
        chrome.tabs.executeScript(tabId, {
            code: jsCode
        }, function(ret) {
            var newCount = Number(ret[0]);
            /*
            //generate notifications for testing
            newCount = Math.floor(Math.random() * (25 - 0) + 0);
            */
            if (newCount > count) {
                notify(newCount, tabId);
            }
            count = newCount;
        });

    });
}

function notify(c, tabId) {
    options.message = 'You have ' + c + ' unread ' + (c > 1 ? 'messages' : 'message');
    chrome.notifications.create("n" + (nid++), options, function(notifId, tabId) {
        chrome.notifications.onClicked.addListener(notif_clickListener);
    });
}

function notif_clickListener(notifId) {
    if (tabId) {
        chrome.windows.getCurrent({}, function(window) {
            chrome.windows.update(window.id, {
                focused: true
            });
        });
        chrome.tabs.update(tabId, {
            active: true
        });
    }
}

setInterval(checkCount, 5000);