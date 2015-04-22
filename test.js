

var imageHelper = require('./index');


var sprite = {
    canvas : {
        name: 's.png',
        width: 1000,
        height : 1000
    },
    assets : [
        {filename: "/Users/guillaume/Dropbox/go-canvas/images/button.png"},
        {filename: "/Users/guillaume/Dropbox/go-canvas/images/search.png"},
        {filename: "/Users/guillaume/Dropbox/go-canvas/images/twitter.png"},
        {filename: "/Users/guillaume/Dropbox/go-canvas/images/slider.png"}
    ]
};






imageHelper.generateSprite(sprite, function(res, err){
    if(err){
        console.log(err);
        return false;
    }
    console.log(res);

});


imageHelper.getImagesFromFolder('images', function(files){
    console.log(files);
});
