var mode = 0, warning;
$(document).ready(function(){
    $('#favbox').bind("input",getFavs);
    $('#history').click(function(){
        if(mode==1){
            mode=0;
            $('#history').css("background-color","red !important");
        }else{
            mode=1;
            $('#history').css("color","#ddd !important");
        };
        getFavs();
    });
    $('#warning').click(function(){$(this).fadeOut();});
    $('.disclaimer').click(function(){
        $('.disclaimer').fadeOut(function(){
            $('body').css("overflow","auto");
            $('.overview').fadeIn();
            $('#numincomplete').text("(" + $('.false').length + ")");
            $('#numcomplete').text("(" + $('.true').length + ")");
            $('#percentage').text(Math.floor(($('.true').length/($('.true').length+$('.false').length))*100));
        });
    });
    $('#hideComplete').click(function(){$('.true').slideToggle();});
    $('#hideIncomplete').click(function(){$('.false').slideToggle();});
});

var history = [];
function getFavs(){
    var query = $('#favbox').val().toLowerCase();
    $('#response').fadeOut('50',function(){
        $.get("/api/favourites/"+query, function(json){
            var data = JSON.parse(json);
            if(data.entry){
                $('#favspace').text(" "+data.entry);
                $('#response').fadeIn('50');
                if($.inArray(data.headword,history)==-1){
                    history.push(data.headword);
                }
                    $('#history').text(history.length + " / " + data.count);
                    $('#history').css({
                        'padding-right':(data.count-history.length)+"px",
                        'padding-left': history.length+"px",
                    });
                    $('.bar').css({
                        'border-left':'1px dotted #555',
                        'border-right':'1px dotted #555'
                    });
                    $('#globalhistory').text(data.global + " / " + data.count);
                    $('#globalhistory').css({
                        'padding-right':(data.count-data.global)+"px",
                        'padding-left': data.global+"px",
                    });

                    $('#verbosehistory').html('<a class="hist" href="#">'+history.join('</a><a class="hist" href="#">')+'</a>');
                    $("body").append("<audio autoplay><source src=\"sfx/"+data.headword+".wav\" type=\"audio/wav\"></audio>");

                    if(data.newentry){
                        $('#favspace').css("color","#87ceeb");
                    } else {
                        $('#favspace').css("color","white");
                    } 
                    $(".hist").on("click", function (e) {
                        var txt = $(this).text();
                        $('#favbox').val(txt);
                        getFavs();
                    });
                document.getElementById("favbox").select();
            } else {
                // sit tight
            }
            if(data.warning){
                if (data.warning != warning){
                    warning = data.warning;
                    $("#warning").html(data.warning + '<span id="warnclose">click to dismiss</span>').fadeIn();
                }
            } else {
                $("#warning").html();
            }
        });
    });
}
