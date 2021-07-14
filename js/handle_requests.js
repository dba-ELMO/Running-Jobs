
let http = require('http');

module.exports = {
    handle_job_run: async function(tower_address, port, orgenization, templateName, username, password, limit, extra_vars_json, tags) {
        run_output = await run_template(tower_address, port, orgenization, templateName, username, password, limit, extra_vars_json, tags);
        let job_url = run_output.url;
        while (["running", "pending"].indexOf(run_output.status) > -1) {
            run_output = await get_job_info(tower_address, port, username, password, job_url);
        }
        // TODO: check why failed and save it to database
        // TODO: make an ability for client to check status using database
        if (run_output.status != "successful") {
            console.log("job failed");
        }
        else {
            console.log("job done");
        }
    }
}

// http://51.145.179.67:8052/api/v2/job_templates/Ping++dbaorg/launch/
    

function run_template(tower_address, port, orgenization, templateName, username, password, limit, extra_vars_json, tags) {
    // TODO: AUTH - MAKE SURE WHO IS 
    return new Promise(function(resolve, reject) {
        let post_data = JSON.stringify({
            'limit': limit,
            'extra_vars': extra_vars_json,
            'job_tags': tags,
            'ask_variables_on_launch': 'true'
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
