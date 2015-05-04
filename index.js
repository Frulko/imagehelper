var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    spawn = require('child_process').spawn,
    exchange = require('./xchangeData');

var platform = os.platform();
var go = platform == 'win32' || platform == 'win64' ? 'ImageHelper.exe' : 'ImageHelper';
go = 'bin' + path.sep + platform + path.sep + go;

go = path.join(__dirname, go);

//console.log(platform.indexOf('win'));

var xchange_filename = path.join(__dirname, 'exchange.json');
exchange.file(xchange_filename);

module.exports = {
    getImagesFromFolder : function(dir, cb){
        var callback = cb || (function (){});

        getFilesFromDirectory(dir, function(files){
            var t = {
                'assets' : files
            };

            var bin = {
                exe : go,
                args : ['infos', xchange_filename]
            };

            execBinary(bin, t, function(data){
                handleImagesInformations(data, callback)
            });
        });
    },
    generateSprite : function(sprite_object, cb){
        var callback = cb || (function (){});

        //var folder = path.join(process.cwd(), );

        var bin = {
            exe : go,
            args : ['generate', xchange_filename]
        };
        execBinary(bin, sprite_object, function(out){
            var res = (out.result) ? out : '';
            var err = !(out.result) ? out : false;
            callback(res, err);
        });
    },

    getImage : function (image, cb){
        var callback = cb || (function (){});
        image = path.join(process.cwd(), image);

        var bin = {
            exe : go,
            args : ['infos', xchange_filename]
        };

        execBinary(bin, {assets : [image]}, function(){
            exchange.read(function(data){
                callback(data);
            }, true);
        });

    }
};



function execBinary (binObject, data, cb){
    var callback = cb || (function (){});
    var bin = binObject || {exe : '', args : []};

    //console.log(bin, data);
    //console.log('binary called "%s %s" for platform "%s"', go, bin.args.join(' '), platform);
    exchange.write(data, function(){

        var process = spawn(bin.exe, bin.args);
        //console.log(bin);
        process.stdout.on('data', function (data) {
            var out = data.toString('utf-8');

            out = JSON.parse(out);
            callback(out);
        });
    });
}

function getFilesFromDirectory (dir, cb){
    var callback = cb || (function (){});
    var files_ = files_ || [];
    fs.readdir(dir, function(err, files){

        if(err){
            console.log(err);
            return;
        }

        files_ = files.filter(function(file){
            if(file != '.DS_Store' && file != '.' && file != '..'){
                var filepath = path.join(dir, file);
                var stats = fs.statSync(filepath);
                if(stats.isFile()){
                    return filepath;
                }
            }
        }).map(function(file){
            var filepath = path.join(dir, file);
            return filepath;
        });

        callback(files_);
    });
}


function handleImagesInformations (images_data, cb){
    var callback = cb || (function (){});
    if(images_data.result){
        exchange.read(function(res){
            cpt = res.length;
            res = res.filter(function(item){
                return item.validate;
            });
            callback(res);
        });
    }else{
        console.log('Error', images_data);
    }
}