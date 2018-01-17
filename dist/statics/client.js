(function ($) {
    var socket = io.connect('http://localhost');
    var _userId = getCookie('userId');

    socket.on('chatReceive', function (data) {
        //data : userId:userId, message: mess
        console.log(data);
        receivedMess(data.userId, data.message);
    });

    var sendMess = function (userId, mess) {
        socket.emit('chatSend', { userId:userId, message: mess});
    }

    var receivedMess = function (userId, mess, flag=1) {
        var htmlMess = `<span>${userId}</span>: ${mess}`;
        var classBlock = 'block-me';
        if (flag) {
            classBlock = 'block-guest';
        }
        var html = `<div class="block-mess ${classBlock}">${htmlMess}</div>`;
        $('#view-mess').prepend(html);

    }


    $(document).ready(function () {
        $('#mess').keyup(function (e) {
            if (e.keyCode == 13) {
                var mess = $(this).val();
                $(this).val('');
                sendMess(_userId, mess);
                receivedMess(_userId, mess, 0);
            }
        });

        $(document).keyup(function (e) {
            var keycode = e.keyCode;
            if (e.altKey) {
                console.log(keycode);
                switch (keycode) {
                    case 76:
                        $('#view-mess').html('');
                }
            }
        })
    });

})(jQuery);

//... function
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}