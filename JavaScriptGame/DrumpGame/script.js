$(document).ready(function() {
    $(document).keydown(function(event) {
        var key = $('.key[data-key="' + event.which + '"]');
        var audio = $('audio[data-key="' + event.which + '"]')[0];
        key.addClass('playing');
        if (!audio) return;
        audio.play();
        audio.currentTime = 0;
    });

    $(document).keyup(function(event) {
        var key = $('.key[data-key="' + event.which + '"]');
        key.removeClass('playing');
    });
});
