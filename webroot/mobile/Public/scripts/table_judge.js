// 裁判功能js

/* 申请成功后向桌子内所有小组发送消息 */
function judgegroup(jname) {
    // 无裁判
    if (jname == "") { judge_exit_group(); return; }
    // 有裁判
    if (jname == table.user_name) {
        /* 裁判界面 */
        // 修改用户角色为裁判
        table.role = 'judge';

        /* mobile显示裁判操作按钮 */
        $("#user_operation").css("display", "none");
        $("#judge_operation").css("display", "block");

        // 比赛开始按钮
        if (!table.gamestart) {
            $('#btnStart').css({ 'display': 'block' });
            $("#btnJudgeExit").css("display", "block");
        } else {
            // 退出按钮
            $("#btnJudgeExit").css("display", "none");
        }
    } else {
        /* 比赛选手界面 */
        $("#btnJudgeExit").css("display", "none");
    }

    // 裁判申请、退出成功后显示图标
    set_judge_account();

    // 发送裁判提示消息
    // 条件：裁判加入时再发送
    if (jname != "" && $('.judge').text() == "无裁判") {
        response_msg(new Array({ "uid": "裁判", "msg": "<font color='white'>我是裁判，若在比赛中对裁决有不同意见，可向我提出异议。\n谢谢！</font>" }));
    }

    // 通知所有人有裁判
    $('.judge').text('有裁判').addClass("judge-online");
}
/* mobile */
// 裁判申请、退出成功后显示图标
function set_judge_account() {
    var item = $("#m_judge");
    if (item.children(".userinfo").text() == "") {
        // 添加账户
        item.children(".userinfo").text("我是裁判");

        // 添加用户图标，下面这两句话顺序不能反
        item.children(".judgeicon_init").addClass("judgeicon");
        item.children(".judgeicon_init").removeClass("judgeicon_init");
    }
}
// 退出成功后向桌子内所有小组发送消息
function judge_exit_group() {
    // 裁判离开后向其他选手通知，并设置用户比赛标志位
    // 游戏是否开始的标志位
    table.gamestart = 0;
    // 标志是否轮到该用户答题
    table.myturn = 0;
    // 标志用户是否已经提交答案
    table.issubmit_answer = 0;

    $("#btnJudgeExit").css("display", "none");
    $('.judge').text('无裁判').removeClass("judge-online");

    /* mobile隐藏裁判操作按钮 */
    $("#user_operation").css("display", "block");
    $("#judge_operation").css("display", "none");

    // 移除裁判账户
    var item = $("#m_judge");
    item.children(".userinfo").text("");
    // 移除裁判图标，下面这两句话顺序不能反
    item.children(".judgeicon").addClass("judgeicon_init");
    item.children(".judgeicon").removeClass("judgeicon");

    if (table.role != "") {
        // 隐藏比赛开始按钮
        $('#btnStart').css({ 'display': 'none' });

        /* mobile显示裁判操作按钮 */
        $("#user_operation").css("display", "none");
        $("#judge_operation").css("display", "block");

        // 修改当前用户角色为比赛选手
        table.role = "";
    }
}

/* 公布下一题 */
function start_response(da) {
    // 设置比赛开始标志
    table.gamestart = 1;

    // 新的题目发送成功后，默认所有人还没有提交答案
    event_mamage.submit_answer = 0;

    // 首先应重置选手界面正确答案，评判结果等内容
    // 然后再添加新的内容
    $("#sResult").text("");
    $("#correctAnswer").text("");

    // 发送给选手
    $("#txtExplain").text(da.explain);
    set_pinyin("#myTab_user", da.pinyin);

    // 发送给裁判
    if (table.role == "judge") $("#correctAnswer").text(da.answer);

    // 修改被选择用户的样式，同时移除上次选择用户的样式
    game_control.additemcss(da.uid);

    // 控制哪个选手可以答题，同时重置已经提交答案标志
    if (da.uid == table.user_name) {
        table.myturn = 1;
        table.issubmit_answer = 0;
    } else {
        table.myturn = 0;
    }

    /* 裁判 */
    // 如果比赛已经开始，则裁判不能中途退出比赛
    $("#btnJudgeExit").css("display", "none");
    // 不能选择开始比赛按钮
    $("#btnStart").css({ "display": "none" });
    // 显示裁判方的下一题按钮
    if (table.role == "judge") $("#btnNextGroup").css({ "display": "block" });

    /* 选手 */
    // 如果比赛已经开始，则选手不能中途退出比赛
    $("#exitTable").css({ "display": "none" });
    // 显示提出异议按钮，使比赛的所有人都能提出异议
    if (table.role != "judge") $("#btnObjection").css("display", "block");

    // 提示比赛开始信息
    if (da.operation == 'start') jnotifymsg("比赛已开始", "info");
    else jnotifymsg("继续下一题", "info");

    // 首先关闭旧的答题进度条
    init_progressbar();
    // 再启动新的答题进度条
    table.interval = da.interval;
    progressbar(da.uid);
    // 设置选手还没有提交答案
    game_control.issubmit_answer = 0;
}
// 设置题目拼音
function set_pinyin(id, data) {
    var pinyin = $(id).children("li").children("a[href]");
    pinyin.text("");
    for (var i = 0; i < data.length; i++) $(pinyin[i]).text(data[i]);
}

/* 处理裁判评判结果 */
function handle_judge_answer(jname, da) {
    var rslt = da.isjudge == 1 ? "正确" : "错误";
    $("#sResult").text(rslt);
    $("#correctAnswer").text(da.answer);

    // 更新裁判中回答问题用户当前状态
    if (jname == table.user_name) {
        // 设置标志位
        table.isjudge = 1;
        // 改变裁判持有的比赛选手状态
        game_control.changestate(da.isjudge);

        // 提交评价结果成功
        jnotifymsg("评判结果已发送", "success");
    }

    // 错词列表维护
    if (table.myturn) {
        // 移除
        if (parseInt(da.isjudge)) errorwords.del(da.answer);
        // 添加
        else errorwords.add({ "vid": parseInt(100 * Math.random()), "word": da.answer, "explain": da.explain });

        // 更新错词列表
        errorwords.update();
    }
}


// 申请或者取消成为裁判
function judge_application(param) {
    // 只有申请裁判时才做一下验证
    if (param) {
        if (!game_control.judge_enabled()) { warningmsg("该房间暂时没有人加入比赛，请稍等"); return; }
        // 已经有人了
        if ($("#m_judge").children(".userinfo").text() != "") { warningmsg("已经有人了"); return; }
        // 如果裁判或用户已经选择过角色，则不能再选
        if (table.groupinfo != null || table.role == "judge") { warningmsg("您已选择过了"); return; }
        // 比赛开始后，即使有人退出也不能新加入人
        if (table.gamestart) { warningmsg("比赛已开始，不能加入"); return; }
        // 在请求返回之前，不能重复发送请求
        if (event_mamage.sel_group) { warningmsg("请求已发送，请稍等"); return; } 
    }


    // 表明用户已选择过组，
    // 在请求返回之前，不能重复发送请求 
    event_mamage.sel_group = 1;

    var info = "a=set_table_info&";
    if (param) {
        info += 'type=judge_apply&';
    } else {
        info += 'type=judge_exit&';
    }
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += "ming=" + table.user_name + "&";
    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
            // 重置用户已选择过组，此时已经不起作用
            event_mamage.sel_group = 0;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            warningmsg("judge_application error: " + textStatus, "error");
        }
    });
}


// 裁判宣布开始答题
function start_game() {
    if (table.gamestart) { jnotifymsg("比赛已经开始"); return; }
    if (!game_control.gamestart()) { jnotifymsg("人数尚未到齐"); return; }

    // 比赛开始后，
    // 针对每到题目，裁判设置一做题时间；
    // 时间到后停止做题，并由裁判评判；
    // 如果选手没有异议，则继续下道题目，并设置新的做题时间（由系统自动设置）
    // 如果有异议，则进行异议审核（聊天方式），然后继续下道题目。
    game_control.init();
    var uid = game_control.next();

    var info = "a=set_table_info&";
    info += 'type=start&';
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += 'uid=' + uid + '&';
    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            warningmsg("start_game error: " + textStatus, "error");
        }
    });
}
// 选择下一组的某个选手答题
function next_group() {
    // 选手还没有提交答案
    if (!game_control.issubmit_answer) { jnotifymsg('选手还未提交答案'); return; }
    // 没有发送评判结果
    if (!table.isjudge) { jnotifymsg('请发送评判结果'); return; }
    // 选手有异议
    if (table.is_objection) { jnotifymsg('选手对裁决有异议，请解决'); return; }

    var uid = game_control.next();
    // 宣布比赛结束，并显示得分界面
    if (!uid) {
        var info = "a=set_table_info&";
        info += 'type=gameover&';
        info += "timestamp=" + Date.parse(new Date()) + "&";
        info += 'groups=' + JSON.stringify(game_control.groups) + '&';
        info += 'jscore=' + game_control.judge_scores + '&';
        info += "rid=" + table.rid + "&";
        info += "tid=" + table.tid;
        $.ajax({
            type: "GET",
            url: table._url_ + info,
            success: function (response) {
                // 比赛结束，隐藏下一题按钮
                $("#btnNextGroup").css("display", "none");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                warningmsg("next_group error: " + textStatus, "error");
            }
        });
        return;
    }

    var info = "a=set_table_info&";
    info += 'type=next_question&';
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += 'uid=' + uid + '&';
    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
            // 发题成功，默认裁判尚未评判
            table.isjudge = 0;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            jnotifymsg("next_group error: " + textStatus, "error");
        }
    });

    // 判断比赛是否可以结束
    if (game_control.gameover() != -1) $("#btnNextGroup").text("结束比赛");
}


// 发送裁判评判结果
// 当选手和裁判争议之后发送最终评判结果时，将第二个参数设置为1
function judge_answer(param, final) {
    if (!table.gamestart) { jnotifymsg("比赛尚未开始"); return; }
    // 选手还没有提交答案
    if (!game_control.issubmit_answer) { jnotifymsg('选手还未提交答案'); return; }

    var info = "a=set_table_info&";
    info += 'type=judge&';
    info += "timestamp=" + Date.parse(new Date()) + "&";
    info += 'state=' + param + '&';
    info += 'uid=' + game_control.cuid + '&';
    info += "rid=" + table.rid + "&";
    info += "tid=" + table.tid;
    $.ajax({
        type: "GET",
        url: table._url_ + info,
        success: function (response) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            jnotifymsg("judge_answer error: " + textStatus, "error");
        }
    });
}