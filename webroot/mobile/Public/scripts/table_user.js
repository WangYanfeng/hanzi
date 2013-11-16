// 选手功能js

/* 更新当前桌子的用户信息 */
function updategroup(data) {
    // 初始化用户界面
    init_user_account();

    // 重新添加内容
    var obj = $(".notice").empty();
    // 注意data是一个object对象，不能用for遍历
    for (var i in data) {
        var item = data[i];
        var gid = parseInt(item.gid);
        var pos = parseInt(item.pos);

        // 通知消息
        obj.append("<div class='noticemsg'>" + item.name + "加入" + table.groupname[gid] + "组</div>");
        // 具体向每个小组添加人员信息
        set_user_account(gid, pos, item.name);
        // 判断用户是否已经挂掉
        game_control.dieitemcss(item.name, item.state);

        // 设置table中当前用户选择的组信息
        if (item.name == table.user_name) {
            table.gid = gid;
            table.pos = pos;
            table.groupinfo = new Array(gid, pos);
        }
    }
}
// 初始化所有的组界面
function init_user_account() {
    var groups = $("div[id^=group]");
    for (var i = 0; i < groups.length; i++) {
        var items = $("#group" + (i + 1)).children(".groupitem");
        for (var j = 0; j < items.length; j++) {
            // 移除头像
            items.children(".headicon").addClass("headicon_init");
            items.children(".headicon").removeClass("headicon");
            // 设置账号默认信息
            items.children(".userinfo").text("");
        }
    }
}

/* 旁观者 */
// 用户作为旁观者只能观看比赛，不能有任何操作
// 如果当前用户为比赛选手或裁判，直接退出函数
// 否则，隐藏功能按钮
function set_spectator(data, jname) {
    for (var i in data) {
        if (table.user_name == data[i].name) return;
    }
    if (table.user_name == jname) return;

    $("#operation_panel div").css("display", "none");
    $("#operation_panel a").css("display", "none");
}

/* 服务器对异议的回复 */
function objection_response(cusers, param) {
    // 设置选手异议标志
    table.is_objection = parseInt(param);
    // 消息控制
    for (var i = 0; i < cusers.length; i++) objectiogmsg(cusers[i]);
    // 用于记录已经显示异议消息的选手
    // 每出一道新题时重置为空
    if (!table.is_objection) table.objct_array.length = 0;
}
// 根据选手是否已经发送过异议消息，决定新的消息内容
function objectiogmsg(user) {
    for (var i = 0; i < table.objct_array.length; i++) {
        item = table.objct_array[i];
        // 该选手已经发过提出异议消息，但没有发送撤销异议消息
        if (item.uid == user.name) {
            if (!user.objection && !item.repeal) {
                response_msg(new Array({ "uid": user.name, "msg": "<font color='yellow'>撤销了异议！</font>" }));
                table.objct_array[i]["repeal"] = 1;
            }
            return;
        }
    }
    // 如果选手还没有发送过提出异议消息，则发送
    if (user.objection) {
        response_msg(new Array({ "uid": user.name, "msg": "<font color='yellow'>对裁决结果有异议！</font>" }));
        table.objct_array.push({ "uid": user.name, "raise": 1, "repeal": 0 });
    }
}


// 选择组加入比赛
function managegroup(obj, pos) {
    // 比赛开始后，即使有人退出也不能新加入人
    if (table.gamestart) { warningmsg("比赛已开始，不能加入"); return; }
    // 在请求返回之前，不能重复发送请求 
    if (event_mamage.sel_group) { warningmsg("请求已发送，请稍等"); return; }
    // 如果裁判或者用户已经选择过角色，则不能再选
    if (table.groupinfo != null || table.role == "judge") { warningmsg("您已选择过了"); return; }

    // 选择组
    var item = $(obj);
    if (item.children(".userinfo").text() != "") { warningmsg("已经有人了"); return; }
    // 注册用户信息
    register(parseInt($(obj).parent().attr("type")), pos);
}
// 注册本桌子上的用户，并向其他用户发送通知消息
function register(gid, pos) {
    // 表明用户已选择过组，
    // 在请求返回之前，不能重复发送请求 
    event_mamage.sel_group = 1;

    // 用户加入标志位
    table.groupinfo = new Array(gid, pos);
    
    var info = "a=set_table_info&";
    info += "type=register&";
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += "ming=" + table.user_name + "&";
    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid + "&";
    info += "gid=" + gid + "&";
    info += "pos=" + pos;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
            registergroup();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            warningmsg("register error: " + textStatus, "error");
        }
    });
}
// 注册成功后控制操作
function registergroup() {
    // 控制退出当前组按钮
    $("#exitTable").css({ "display": "block" });
    $("#btnJudgeExit").css("display", "none");

    // 重置用户已选择过组，此时已经不起作用
    event_mamage.sel_group = 0;
}


// 退出组
function exit() {
    if (table.gamestart) { warningmsg("比赛已经开始，不能退出"); return; }

    var info = "a=set_table_info&";
    info += "type=exit&";
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += "ming=" + table.user_name + "&";
    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
            exitgroup();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            warningmsg("exit error: " + textStatus, "error");
        }
    });
}
// 退出组成功后的控制操作
function exitgroup() {
    del_user_account(table.gid, table.pos);

    // 重新初始化用户
    table.gid = -1;
    table.pos = -1;
    table.groupinfo = null;

    // 控制退出当前组按钮
    $("#exitTable").css({ "display": "none" });
    // 显示我来当裁判按钮
    $("#btnJudgeExit").css("display", "none");
}


// 回答问题
function answer() {
    if (!table.gamestart) { jnotifymsg("比赛尚未开始"); return; }
    if (!table.myturn) { jnotifymsg("暂未轮到你答题"); return; }
    if (event_mamage.submit_answer) { jnotifymsg("答案已提交，请稍等"); return; }
    if (!table.percent) { jnotifymsg("时间已用完"); return; }
    if (!table.gamestate) { jnotifymsg("你已不能继续比赛"); return; }
    // 上传回答的内容
    upload_img();
}
// 上传当前书写的内容
// 当时间用完后有进度条程序自动调用，提交答案
function upload_img() {
    // 获取所有手写字符
    var imgs = $("canvas[id^='txtAnswer']");
    $.post("/HanziGame/mobile.php?m=GameHall&a=upload", {
        "img1": imgs[0].toDataURL("image/png"),
        "img2": imgs[1].toDataURL("image/png"),
        "img3": imgs[2].toDataURL("image/png"),
        "img4": imgs[3].toDataURL("image/png"),
        "timestamp": Date.parse(new Date()),
        "rid": table.rid,
        "tid": table.tid
    }, function (data) {
        // 已提交答案，不能重复提交
        // 等待下一道题目发送之后，由裁判置为0
        event_mamage.submit_answer = 1;
    });
}
// 公布选手答案
function answer_canvas(jname, imgurl, cuser_id) {
    // 向当前用户提示发送答案成功消息
    if (cuser_id == table.user_name) {
        // 提交完答案后设置标志位
        table.issubmit_answer = 1;
        // 提示消息
        jnotifymsg("答案已经提交", "success");
    }

    /* 手机端的好像不需要区分选手和裁判的canvas */
    var imgs = $("canvas[id^='txtAnswer']");

    // 先清空所有的画图
    init_canvas();
    // 再逐个绘制
    for (var i = 0; i < 4; i++) load_per_img(imgurl[i], imgs[i]);

    // 更新当前回答问题的用户ID
    table.cuser_id = cuser_id;

    // 向裁判通知选手已经提交答案
    game_control.issubmit_answer = 1;
}
function load_per_img(url, canvas) {
    var imageObj = new Image();
    imageObj.onload = function () {
        var cxt = canvas.getContext("2d");
        cxt.drawImage(this, 0, 0);
    };
    imageObj.src = url;
}


// 选手对裁判的裁决提出异议
// 条件：裁判已经裁决
function raise_objection() {
    if ($("#sResult").text() == "") warningmsg("暂时不能提出异议");
    else {
        if (table.objection <= 0) { warningmsg("您还有" + table.objection + "次提出异议的机会"); return; }

        // 按钮控制
        var obj = $("#btnObjection");
        // -1表示撤销异议，1表示有异议
        var param = -1;
        if (obj.text() == "我有异议") {
            param = 1;
            obj.text("撤销异议");

            // 减少本选手提出异议次数
            if (table.myturn) table.objection--;

            // 如果选手一直不撤销异议，则默认在3分钟后自动撤销
            // 每道题只能提出一次异议
            setTimeout(function () {
                objection_action("objection", -1);
                obj.text("我有异议");
                $("#btnObjection").css("display", "none");
            }, 3 * 60 * 1000);
        } else {
            // 每道题只能提出一次异议
            obj.text("我有异议");
            $("#btnObjection").css("display", "none");
        }

        // 发送异议操作：提出或撤销
        objection_action("objection", param);
    }
}
// 向服务器发送异议动作
function objection_action(optype, param) {
    var info = "a=set_table_info&";
    info += "type=" + optype + "&";
    info += "param=" + param + "&";
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += "ming=" + table.user_name + "&";
    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            warningmsg("objection_action error: " + textStatus, "error");
        }
    });
}


// 删除指定用户
function del_user_account(gid, pos) {
    var item = $($("#group" + gid).children(".groupitem")[pos - 1]);
    
    // 设置账号默认信息
    item.children(".userinfo").text("");
    // 移除头像
    item.children(".headicon").addClass("headicon_init");
    item.children(".headicon").removeClass("headicon");
}
// 设置用户账号
// 注意id号是从1开始的
function set_user_account(gid, pos, account) {
    var item = $($("#group" + gid).children(".groupitem")[pos - 1]);

    // 添加账户
    item.children(".userinfo").text(account);

    // 添加用户图标，下面这两句话顺序不能反
    item.children(".headicon_init").addClass("headicon");
    item.children(".headicon_init").removeClass("headicon_init");
}
// 获取用户账号
function get_user_account(gid, pos) {
    return $("#group" + gid + " div:nth-child(" + pos + ")").children(".userinfo").text();
}
// 获取第i组所有人员信息
function get_group_users(gid) {
    return $("#group" + gid).children(".groupitem").children(".userinfo");
}
// 获取uid所在组中的元素
function get_user_parent(uid) {
    for (var i = 0; i < table.groups; i++) {
        for (var j = 0; j < table.upg; j++) {
            if (get_user_account(i + 1, j + 1) == uid)
                return $($("#group" + (i + 1)).children(".groupitem")[j]);
        }
    }
}

// 显示提示信息
// 左侧panel使用
function warningmsg(msg, type) {
    var obj = $("#alertmsg");
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
// 显示提示信息
// 使用jquery框架
function jnotifymsg(msg, type) {
    title = "警告";
    if (type == "error") title = "错误";
    else if (type == "success") title = "成功";
    else if (type == "info") title = "提示";

    var info = "<strong>" + title + "！</strong>" + msg;

    if (type == "error") jError(info);
    else if (type == "success") jSuccess(info);
    else if (type == "info") jNotify(info);
    else jNotify(info);
}