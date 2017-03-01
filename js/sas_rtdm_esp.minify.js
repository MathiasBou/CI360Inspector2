function sendEventToESP(a,b){if(""!=a){a+="?blocksize=1&quiesce=false",void 0==b.opcode&&(b.opcode="i");var c=[[b]],d=JSON.stringify(c);return $.ajax({type:"POST",url:a,data:d,contentType:"JSON"})}}function sendEventToESPProxy(a,b,c){if(""!=b){b+="?blocksize=1&quiesce=false",void 0==c.opcode&&(c.opcode="i");var d=[[c]],e=JSON.stringify(d),f={espRequestUrl:b,espRequestData:e};return $.post(a,f)}}function sendRequestToRTDM(a,b,c){var d="http://"+a+"/SASDecisionServices/rest/runtime/decisions/"+b,e="application/vnd.sas.decision.request+json",f=void 0!=jstz?jstz.determine().name():"America/New_York",g={version:1,clientTimeZone:f,inputs:c};return jQuery.ajax({method:"POST",contentType:e,url:d,data:JSON.stringify(g)})}function transformRtdmDatagrid(a){var b={};if(b.columns=Array(),b.values=Array(),void 0==a||2!=a.length||void 0==a[0].metadata||void 0==a[1].data)return console.log("Warning: Provided RTDM Datagrid has an invalid schema."),b;for(var c in a[0].metadata){var d=a[0].metadata[c];for(var e in d)b.columns.push({index:c,name:e,dataType:d[e]})}for(var f in a[1].data){var g={};for(var h in b.columns)g[h.name]=f[h.index];b.values.push(g)}return b}function queryRTDMEventDefinition(a,b,c){var d=a.events[b].decisionId,e="http://"+a.host+"/RTDM/rest/decisionDefinitions/"+d;return jQuery.ajax({method:"GET",url:e,contentType:"application/vnd.sas.decision.definition.summary"}).done(function(d){a.events[b].inputs=d.inputs?d.inputs:{},a.events[b].outputs=d.outputs?d.outputs:{},c(a,b)})}function queryRTDMEvents(a,b){var c="http://"+a.host+"/RTDM/rest/decisionDefinitions";return jQuery.ajax({method:"GET",url:c,contentType:"application/vnd.sas.decision.request+json",data:{limit:1e3}}).done(function(c){a.events=c.items?c.items.map(function(a){return{decisionId:a.decisionId,decisionId:a.decisionId,version:a.version,timeoutEnabled:a.timeoutEnabled,timeout:a.timeout,lastModifiedBy:a.lastModifiedBy,created:a.created,modified:a.modified}}):Array(),a.eventCount=c.count?c.count:0,a.events.sort(function(a,b){return a.decisionId.localeCompare(b.decisionId)}),b(a)})}function queryESPModel(a,b,c){var d="http://"+a.host+":"+a.portHttpAdmin+"/model?schema=true";return"3.2"==b&&(d="http://"+a.host+":"+a.portHttpAdmin+"/SASESP/projects?schema=true"),jQuery.ajax({method:"GET",url:d}).done(function(d){var e=jQuery.xml2json(d);if("3.2"==b?a.projects=void 0!=e.project?e.project:Array():a.projects=void 0!=e.projects?e.projects.project:Array(),a.windows=Array(),a.projects instanceof Array)for(var f=0;f<a.projects.length;f++){var g=a.projects[f].contqueries.contquery.windows,h=a.projects[f].name,i=a.projects[f].contqueries.contquery.name;if(g.window_source instanceof Array)for(var j=0;j<g.window_source.length;j++){var k=g.window_source[j].name,l=h+"/"+i+"/"+k,m={label:k,espProject:h,espQuery:i,espWindow:k,espUrl:l,fields:g.window_source[j].schema.fields.field};a.windows.push(m)}else{var k=g.window_source.name,l=h+"/"+i+"/"+k,m={label:k,espProject:h,espQuery:i,espWindow:k,espUrl:l,fields:g.window_source.schema.fields.field};a.windows.push(m)}}else{var g=a.projects.contqueries.contquery.windows,h=a.projects.name,i=a.projects.contqueries.contquery.name;if(g.window_source instanceof Array)for(var j=0;j<g.window_source.length;j++){var k=g.window_source[j].name,l=h+"/"+i+"/"+k,m={label:k,espProject:h,espQuery:i,espWindow:k,espUrl:l,fields:g.window_source[j].schema.fields.field};a.windows.push(m)}else{var k=g.window_source.name,l=h+"/"+i+"/"+k,m={label:k,espProject:h,espQuery:i,espWindow:k,espUrl:l,fields:g.window_source.schema.fields.field};a.windows.push(m)}}c(a)})}