var mode = 0;
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
                    var len,op;
                    if (mode == 0){
                        len = history.length;
                        op = "/";
                    } else {
                        len = data.global;
                        op = ":";
                    }
                    console.log(len);
                    $('#history').text(len + " " + op + " " + data.count);
                    $('#history').css('padding-right',(data.count-len)+"px");
                    $('#history').css('padding-left', len+"px");
                    $('#history').css('border-left','1px dotted #555');
                    $('#history').css('border-right','1px dotted #555');
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
                $("#warning").html(data.warning);
            } else {
                $("#warning").html();
            }
        });
    });
}
