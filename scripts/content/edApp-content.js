

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "start_recording_edApp") {
            edAppTab = request.context;
            var edAppLinks = document.querySelectorAll('#page a[href*="http"]');
            edAppLinks.forEach(function(link) {
                (function(href) {
                    href.addEventListener('click', function() {
                    	chrome.runtime.sendMessage(null,{"message":"link_clicked","href":href.getAttribute('href')});
                        //sendResponse(href.getAttribute('href'));
                        //return true;
                    });
                })(link);
            });
        }

        if(request.message === "log_credentials"){
            document.querySelector('#login #loginbtn').addEventListener('click',function(){
                var username = document.querySelector('#login #username').value.trim();
                var password = document.querySelector('#login #password').value.trim();
                if(username && password){
                    //alert('clicked');
                    chrome.runtime.sendMessage({"message":"edAppcontent_Ready", edAppcontentReady: true , username : username});
                }
            });
        }

        if (request.message === "stop_recording_edApp") {}
    }
);
