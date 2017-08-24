var matchUrl = 'http://10.0.31.5:9030';
var loginUrl = matchUrl+'/login';
var edAppContext, edAppcontent = false,
    user, edAppTabId;


chrome.runtime.onMessage.addListener(function(request) {
   // edAppcontent = false;
    if (request && request.message==="edAppcontent_Ready") {
        user = {
            id: (Math.floor(Math.random())+1)*10,
            name: request.username
        };
        if (user){
            edAppcontent = request.edAppcontentReady;
        }
        alert('start.js - edApp content ready');
        if (edAppTabId) {
            chrome.tabs.get(edAppTabId, function(tab) {
                startRecordingEdApp(tab);
            });
        }
    }

    if (request.message === "link_clicked") {
        edAppContext.visitedTabs.push({ tabId: null, url: request.href });
        //edAppcontent = true;
    }


});

function startRecordingEdApp(tab) {
    if (edAppcontent && tab.url.startsWith(matchUrl)) {
        //alert('edApp');
        edAppContext = {
            id: tab.id,
            url: tab.url,
            title: tab.title,
            opened: true,
            visitedTabs: []
        };

        chrome.tabs.sendMessage(tab.id, { message: 'start_recording_edApp', context: edAppContext }, function(response) {

        });
    }else if(tab.url.startsWith(loginUrl)){
        //alert('login');
        chrome.tabs.sendMessage(tab.id, { message: 'log_credentials' });
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, info) {
    edAppTabId = tabId;

    if (info.status === 'complete') {
        chrome.tabs.get(tabId, function(tab) {
            //alert(edAppcontent);
            startRecordingEdApp(tab);
        });
    }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    if (edAppcontent && tabId === edAppContext.id) {
        edAppTabId = null;
        edAppContext = {};
        chrome.tabs.sendMessage(tabId, { message: 'stop_recording_edApp', context: edAppContext }, function(response) {

        });
    }
});
