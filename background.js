
var options = {
  type: "basic",
  title: "FB notice",
  message: "",
  iconUrl: "icon.png"
}

var nid = 0;
var count = 0;
var jsCode = 'document.getElementById("notificationsCountValue").innerText';


function checkCount() {
	chrome.tabs.query({url:'*://www.facebook.com/*'}, function (tabs) {
		if (!tabs || tabs.length == 0) return;
		
		chrome.tabs.executeScript(tabs[0].id, {code:jsCode}, function (ret) {
			var newCount = Number(ret[0]);
			if (newCount > count) {
				notify(newCount);
			}
			count = newCount;
		});
		
	});
}

function notify(c) {
	options.message = 'You have ' + c + ' unread ' + (c > 1 ? 'messages' : 'message');
	chrome.notifications.create("n"+(nid++), options, function () {});
}

setInterval(checkCount, 5000);
