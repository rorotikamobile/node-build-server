var spawn = require('child_process').spawn,
    tmp = require("tmp"),
    _ = require("underscore"),
    fs = require("fs"),
    async = require("async"),
    express = require('express'),
    app = express();



var run_process = function (cmd,args,opts,callback) {
    if (_.isFunction(opts)) {
        callback = opts;
    }
    console.log("running: " + cmd);
    var process  = spawn(cmd, args,opts||{}),
        process_stdout = "",
        process_stderr = "",
        replied = false;

    process.on("error", function (err) {
        replied = true;
        callback("Error: " +  err, process_stdout, process_stderr);
    });

    var finished_handler = function (code, signal) {
        if (replied) { return true; }
        if (signal) {
            callback("Killed by signal: " + signal, process_stdout, process_stderr);
        } else {
            console.log("Got: " + code);
            if (code === 0) {
                callback(null,process_stdout,process_stderr);
            } else {
                callback("Error: Process exited with : " + code,process_stdout,process_stderr);
            }
            
        }
    }
    process.on("close", finished_handler);

    process.stdout.on("data", function (data) {
        process_stdout += data;
    });
    process.stderr.on("data", function (data) {
        process_stderr += data;
    });
}

app.get('/build/:app', function(req, res){
    
    var app = req.params.app,
        url = "git@git.rorotika:" + app;

    tmp.dir(function (err, tmp_dir) {
        tmp.tmpName(function (err,tar) {
            async.series([
                run_process.bind(null,"git",["clone",url,tmp_dir]),
                run_process.bind(null,"npm",["install"],{cwd:tmp_dir}),
                run_process.bind(null,"/bin/bash",["-c","tar czf " + tar + " *"],{cwd:tmp_dir})
            ], function (err, outs) {
                if (err) {
                    res.writeHead(500,{"Content-type":"text/html"});
                    res.end("Error: " + err + ":\n" + _.pluck(outs,"1").join("\n"));
                } else {
                    res.writeHead(200,{"Content-type":"application/gzip"});
                    fs.createReadStream(tar).pipe(res);
                }
            });
        });
    });
    
});

app.listen(5067);
