var fs = require('fs');
var xchange_filename = 'xchange.json';
module.exports = {
    file : function(filename){
        xchange_filename = filename;
    },
    read : function(cb, clean){
        var callback = cb || (function (){});
        var clean = clean || false;

        var file = xchange_filename;
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('Error: ' + err);
                return;
            }
            if(clean){
                fs.writeFile(file, '', function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }

            cb(JSON.parse(data));
        });
    },
    write : function(data, cb){
        var callback = cb || (function (){});
        var file = xchange_filename;
        fs.writeFile(file, JSON.stringify(data, null, '\t'), function(err) {
            if(err) {
                console.log(err);
            } else {
                callback();
            }
        });
    }
};