// 用户聊天JS

// 注册发送消息事件
$("#sendmsg").click(function () {
    msg = $.trim($("#txtmsg").val());
    if (msg == "") { chatwarningmsg("输入内容不能为空"); return; }

    sendmsg(msg);
});
// 消息输入框事件监听
$("#txtmsg").keypress(function (event) {
    msg = $.trim($(this).val());
    if (event.keyCode == 13) {
        if (msg == "") { chatwarningmsg("输入内容不能为空"); return; }
        sendmsg(msg);
    }
});
// 鼠标进入消息框时清空之前输入的内容
$("#txtmsg").mousedown(function (event) {
    $(this).val("");
});
// 向所有人发送消息
function sendmsg(msg) {
    // 如果用户没有加入桌子或成为本桌裁判，则不能向其他人发送消息
    if (table.groupinfo != null || table.role) {
        //
        var info = "a=set_chat_info&";
        info += "timestamp=" + Date.parse(new Date()) + "&";

        // 如果是裁判，则隐藏裁判的账号，显示为裁判
        if (table.role == "judge")
            info += "ming=裁判&";
        else
            info += "ming=" + table.user_name + "&";

        info += "msg=" + msg + "&";
        info += "rid=" + table.rid + "&";
        info += "tid=" + table.tid;


        $.ajax({
            type: "GET",
            url: table._url_ + info,
            success: function (response) {
                // 发送成功后清空输入框
                $("#txtmsg").val("");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                chatwarningmsg("sendmsg error: " + textStatus, "error");
            }
        });
    } else { chatwarningmsg("不能发送消息"); return; }
}
// 服务器响应用户发送的消息
function response_msg(da) {
    // 如果聊天消息内容过多，就清空之前内容
    var obj = $("#chatbox");
    if (obj.children().length > 100) obj.empty();

     for(var i in da){
        var item = da[i];
        obj.append("<div class='chatmsg'><a>" + item.uid + "</a>: " + item.msg + "</div>");
    }

    // 使得消息滚动条滚动在最底部
    obj = document.getElementById('chatbox');
    obj.scrollTop = obj.scrollHeight;
}

// 显示提示信息
function chatwarningmsg(msg, type) {
    var obj = $("#chatalertmsg");
    if (obj.children().length == 0) {
        title = "警告";
        if (type == "error") title = "错误";
        else if (type == "success") title = "成功";
        else if (type == "info") title = "提示";

        var info = "<div class='alert alert-" + type + " fade in'><button type='button' class='close' data-dismiss='alert'>&times;</button>";
        info += "<strong>" + title + "！</strong>" + msg + "</div>";
        obj.append(info);

        setTimeout(function () { obj.children("div").alert("close"); }, 2000);
    }
}