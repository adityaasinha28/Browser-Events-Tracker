var edAppTab;
//chrome.runtime.sendMessage({ contentReady: true });

const serverOptions = {
    protocol:'http:',
    hostname: '10.0.31.5',
    port: 8080,
    path: '/v1/caliper/event',
    method: 'POST',
    headers: {
        Authorization: 'Basic Y2FsaXBlcmV2ZW50c3RvcmU6Y2FsaXBlcmV2ZW50c3RvcmU='
    }
};

function postEvent(sensor, event) {
    var requestor = Caliper.Request.HttpRequestor;
    requestor.initialize(serverOptions);
    requestor.createEnvelope(sensor, event);
    requestor.send(sensor, event);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.message === "start_recording") {
            var uiEvents = [{type: 'mouseover'}, {type: 'scroll'}];
            var videoEvents = [{type: 'playing'}, {type: 'pause'}];
            //step - prepare event model
            if (!request.edAppContext.opened) {
                return;
            }

            //create sensor
            var sensor = Caliper.Sensor;
            sensor.id = request.edAppContext.url.concat('/' + request.edAppContext.id);
            sensor.options = serverOptions;

            //create actor
            var actor = new Caliper.Entities.Person();
            actor.setId(request.user.id);
            actor.setName(request.user.name);

            //create web page object
            var object = new Caliper.Entities.Reading();
            object.setId(request.tabsContext.url);
           // object.setName(request.tabsContext.title);
            object.setIsPartOf(new Caliper.Entities.Reading().setId(request.edAppContext.url));

            var navigationEvent = new Caliper.Events.NavigationEvent();
            // navigationEvent.setId(request.tabsContext.url.concat('/' + request.tabsContext.id));
            navigationEvent.setActor(actor);
            navigationEvent.setAction(Caliper.Actions.NavigationActions.NAVIGATED_TO);
            navigationEvent.setObject(object);
            navigationEvent.setTarget(object);
            navigationEvent.setEventTime(new Date().toISOString());
            console.log('new navigationEvent:'+ JSON.stringify(navigationEvent));
            postEvent(sensor, navigationEvent);


            

            for (i in uiEvents) {
                document.addEventListener(uiEvents[i].type, function (e) {

                    if (uiEvents[i].triggered) return;
                    uiEvents[i].triggered = true;
                    var viewEvent = new Caliper.Events.ViewEvent();
                    //viewEvent.setId(request.tabsContext.url.concat('/' + request.tabsContext.id));
                    viewEvent.setActor(actor);
                    viewEvent.setAction(Caliper.Actions.ReadingActions.VIEWED);
                    viewEvent.setObject(object);
                    viewEvent.setEventTime(new Date().toISOString());
                    console.log('new viewEvent:'+JSON.stringify(viewEvent));
                    postEvent(sensor, viewEvent);
                    
                });
            }

            //step - check for a video and track it
            function watchVideo() {
                var video = document.getElementsByTagName("video")[0];
                //alert(video);
                if (video) {
                    for (i in videoEvents) {
                        if (videoEvents[i].triggered) return;
                        videoEvents[i].triggered = true;
                        video.addEventListener(videoEvents[i].type, function (e) {
                            var mediaEvent = new Caliper.Events.MediaEvent();
                            mediaEvent.setActor(actor);
                            var videoObject = new Caliper.Entities.VideoObject();
                            videoObject.setId(e.target.src);
                            videoObject.setDuration(e.target.duration);

                            if (e.type === 'playing') {
                                mediaEvent.setAction(Caliper.Actions.MediaActions.STARTED);
                            } else if (e.type === 'pause') {
                                mediaEvent.setAction(Caliper.Actions.MediaActions.PAUSED);
                            }

                            videoObject.setIsPartOf(object);
                            mediaEvent.setObject(videoObject);

                            var target = new Caliper.Entities.MediaLocation();
                            target.setId(e.target.src);
                            target.setCurrentTime(new Date().getTime());

                            mediaEvent.setTarget(target);
                            mediaEvent.setEventTime(new Date().toISOString());

                            console.log('new mediaEvent:'+ JSON.stringify(mediaEvent,1));
                            postEvent(sensor, mediaEvent);
                        });
                    }
                }
                clearTimeout(interval);
            }

            var interval = setTimeout(watchVideo, 2000);


        }

        if (request.message === 'stop_recording') {
            //send closed event
            if (!request.edAppContext.opened) {
                return;
            }
            //alert('tab closed');
            //chrome.runtime.sendMessage(null,{"message":"event_created","event":event});
            //return true;
        }
    }
);
