
var http = require('http');

var server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/') { //check the URL of the current request
        
        // TODO: SIMPLE PAGE EXPLAINING DBA AUTOMATION

        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        // set response content    
        res.write('<html><body><p>This is home Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == "/clusters") {
        // TODO: CHECK PERMISSIONS
        // TODO: PAGE THAT SHOWS ALL THE CLUSTERS AND  -> SENDING REQUEST TO THE INVENTORY TO GET THE HOSTS AND CLUSTERS 
        // AND SHOW THEM
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is clusters Page.</p></body></html>');
        runTemplate("51.145.179.67", 8052, "dbaorg", "Ping", "admin", "password", "myn_tst_mdb", "", "")
        res.end();
    
    }
    else
        res.end('Invalid Request!');

});

server.listen(8080); //6 - listen for any incoming requests

console.log('Node.js web server at port 8080 is running..')
// http://51.145.179.67:8052/api/v2/job_templates/Ping++dbaorg/launch/

function runTemplate(tower_address, port, orgenization, templateName, username, password, limit, extra_vars_json, tags) {
    // TODO: AUTH - MAKE SURE WHO IS 
    
    var post_data = JSON.stringify({
        'limit': limit,
        'extra_vars': extra_vars_json,
        'job_tags': tags
    });

    var options = {
        host: tower_address,
        path: `/api/v2/job_templates/${templateName}++${orgenization}/launch/`,
        auth: `${username}:${password}`,
        port: port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
          }
      };

    // Set up the request
    var post_req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });

        res.on('end', function() {
            console.log("done");
        })
    });

    post_req.write(post_data);
    post_req.end();
    // TODO: check the response, is the job successful?
}




