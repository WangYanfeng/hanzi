$(function () {
    $("#logo_pic").mouseover(function () {
        $(this).addClass("imgover");
    });
    $("#logo_pic").mouseout(function () {
        $(this).removeClass("imgover");
    });
});