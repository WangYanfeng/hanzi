$(function () {
    $("#logo_pic").click(function () {
        $("#text").slideUp("slow");
    });
    $("#logo_pic").mouseover(function () {
        $(this).addClass("imgover");
    });
    $("#logo_pic").mouseout(function () {
        $(this).removeClass("imgover");
    });
});