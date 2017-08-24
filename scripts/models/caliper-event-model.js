window.caliper = window.caliper || {};
window.caliper.createEvent = function() {
    var event = {
        "@context": "http://purl.imsglobal.org/ctx/caliper/v1/Context",
        "@type": "http://purl.imsglobal.org/caliper/v1/MediaEvent",
        "actor": {
            "@context": "http://purl.imsglobal.org/ctx/caliper/v1/Context",
            "@id": "https://example.edu/user/554433",
            "@type": "http://purl.imsglobal.org/caliper/v1/lis/Person",
            "name": null,
            "description": null,
            "extensions": {},
            "dateCreated": "2015-08-01T06:00:00.000Z",
            "dateModified": "2015-09-02T11:30:00.000Z"
        },
        "action": "http://purl.imsglobal.org/vocab/caliper/v1/action#Started",
        "object": {
            "@context": "http://purl.imsglobal.org/ctx/caliper/v1/Context",
            "@id": "https://example.com/super-media-tool/video/1225",
            "@type": "http://purl.imsglobal.org/caliper/v1/VideoObject",
            "name": "American Revolution - Key Figures Video",
            "description": null,
            "objectType": [],
            "alignedLearningObjective": [],
            "keywords": [],
            "isPartOf": null,
            "extensions": {},
            "dateCreated": "2015-08-01T06:00:00.000Z",
            "dateModified": "2015-09-02T11:30:00.000Z",
            "datePublished": null,
            "version": "1.0",
            "duration": 1420
        },
        "target":null,
        "generated": null,
        "eventTime": null,
        "edApp": null,
        "group": null,
        "membership": null,
        "federatedSession": null
    };
    return event;
};
