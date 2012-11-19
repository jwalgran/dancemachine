var itunes = require('playback');
exports.index = function(req, res){
    itunes.currentTrack(function(currentTrack){
        res.render('index', {
            title: 'dancemachine',
            currentTrack: currentTrack
        });
    });
};