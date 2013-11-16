/* 页面出现异常的处理方案 */
$(window).bind('beforeunload', function () {
    var info = "a=index_exception&";
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += "ming=" + table.user_name + "&";

    // 区分选手和裁判
    if (table.role == "")
        info += "role=user&";
    else
        info += "role=" + table.role + "&";

    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            warningmsg("exit error: " + textStatus, "error");
        }
    });
});