// ==UserScript==
// @name         CI360 Events Inspector v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Inspect CI360 events
// @author       Mathias Bouten
// @include      http*://www.sascompanystore.com/*
// @include      http*://www.sas.com/*

// @exclude      *inqChat*
// @exclude      *demdex*

// @grant        none
// ==/UserScript==



// CI360 Tag... CI360 Inspector
(function() {

    /* Configuration Here */
    //var inspectorUrl = "http://localhost//CI360Inspector2/";
    var inspectorUrl = "http://dachgpci01.emea.sas.com//CI360Inspector2/";

    // PLEASE UPDATE WITH TENANT EXTERNAL ID
    var tenantId = '0455ccd59f000130996b2723';
    var overrideExistingTag = false;
    var keepTryingToGetDataHubId = true;
    var keepTryingToGetDataHubIdIterations = 10;

    /* Do not touch below this line! */

    // check if CI360 is already on the page
    if((document.getElementById('ob-script') != undefined || document.getElementById('ob-script-async') != undefined) && !overrideExistingTag) {
        console.log("CI360 Tag already on website. Will not insert Tag...");
    } else {
        var ot = document.createElement('script');
        ot.type = 'text/javascript'; ot.id = 'ob-script-async'; ot.async = true;
        ot.src = 'https://execution-euea.ci360.sas.com:443/t/s/s/' + tenantId;

        var a = document.createAttribute('a');
        a.nodeValue = tenantId; 
        ot.attributes.setNamedItem(a);

        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ot, s);
        console.log("CI360 Tag inserted successfully");
    }

    console.log("CI360 Events Inspector loaded...");

    var eventsPopup = window.open(inspectorUrl,"ci_360_inspector","width=540,height=750,scrollbars=yes");
    eventsPopup.postMessage({type:"heartbeat", payload:""}, inspectorUrl);
    console.log("CI360 Event Inspector: Sending heartbeat to popup window...");


    XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(dataString) {
        if(dataString != undefined && dataString.length > 0) {
            eventMessage = {};
            eventMessage.type = "tracking";
            datahubid = findDataHubId();
            eventMessage.payload = dataString + "&" + datahubid;
            console.log("CI360 Event Inspector: Sending event data... "
                       //,eventMessage.payload
                       );
            eventsPopup.postMessage(eventMessage, inspectorUrl);
            console.log("CI360 Event Inspector: Send successfully");

        } else {
            console.log("CI360 Event Inspector: No data for this event...");
        }

        this.realSend.apply(this, arguments);
    };

    console.log("CI360 Event Inspector: Listener added successfully.");

    function findDataHubId() {
        keepTryingToGetDataHubIdIterations--;
        payload = "";
        try {
            if(typeof com_sas_ci_acs !== 'undefined' && typeof com_sas_ci_acs.ob_configure !== 'undefined' && typeof com_sas_ci_acs.ob_configure.getDatahubId !== 'undefined') {
                console.log("CI360 Event Inspector: Sending DataHubId...");
                payload = "identity=" + com_sas_ci_acs.ob_configure.getDatahubId();
                console.log("CI360 Event Inspector: DataHubId found.");
                keepTryingToGetDataHubId = false;
            } else {
                console.log("CI360 Event Inspector: ERROR! Could not get DataHubId... Will try again in 2sec. Iterations left: " + keepTryingToGetDataHubIdIterations);
            }
        }
        catch(err) {
            keepTryingToGetDataHubId = false;
            console.log("CI360 Event Inspector: ERROR! Could not get DataHubId... Will stop trying.... " + err.message);
        }

        if(keepTryingToGetDataHubId && keepTryingToGetDataHubIdIterations > 0) {
            setTimeout(findDataHubId, 2000);
        } else {
            return payload;
        }
    }
})();