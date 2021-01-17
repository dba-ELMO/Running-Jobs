let http = require('http');
let tower_host = "51.145.179.67"
let tower_port = 8052
let org = "dbaorg"
let tower_user = "admin"
let tower_password = "password"

let server = http.createServer(function (req, res) {   //create web server
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
        handle_job_run(tower_host, tower_port, org, "Ping", tower_user, tower_password, "myn_tst_mdb", "", "")
        res.end();
    
    }
    else
        res.end('Invalid Request!');

});

async function handle_job_run(tower_address, port, orgenization, templateName, username, password, limit, extra_vars_json, tags) {
    run_output = await run_template(tower_address, port, orgenization, templateName, username, password, limit, extra_vars_json, tags);
    let job_url = run_output.url;
    while (["running", "pending"].indexOf(run_output.status) > -1) {
        run_output = await get_job_info(tower_address, port, username, password, job_url);
    }
    if (run_output.status != "successful") {
        console.log("job failed");
    } 
    else {
        console.log("job done");
    }
}

server.listen(8080); //6 - listen for any incoming requests

console.log('Node.js web server at port 8080 is running..')
// http://51.145.179.67:8052/api/v2/job_templates/Ping++dbaorg/launch/
    

function run_template(tower_address, port, orgenization, templateName, username, password, limit, extra_vars_json, tags) {
    // TODO: AUTH - MAKE SURE WHO IS 
    return new Promise(function(resolve, reject) {
        let post_data = JSON.stringify({
            'limit': limit,
            'extra_vars': extra_vars_json,
            'job_tags': tags
        });
    
        let options = {
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
        let post_req = http.request(options, function(res) {

            res.setEncoding('utf8');
            let body = "";

            res.on('data', function(chunk) {
                body += chunk;
            });
        
            res.on('end', function() {
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            })
        });

        // reject on request error
        post_req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        post_req.write(post_data)
        post_req.end();
            
    });
}



function get_job_info(tower_address, port, username, password, url) {
    return new Promise(function(resolve, reject) {  
        let options = {
            host: tower_address,
            path: url,
            auth: `${username}:${password}`,
            port: port,
            method: 'GET'
        };
        // Set up the request
        let req = http.request(options, function(res) {

            res.setEncoding('utf8');
            let body = "";

            res.on('data', function(chunk) {
                body += chunk;
            });
        
            res.on('end', function() {
                try {
                    body = JSON.parse(body);
                } catch(e) {
                    console.log("here");
                    console.log(body);
                    reject(e);
                }
                resolve(body);
            })
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        req.end();
    });
}



