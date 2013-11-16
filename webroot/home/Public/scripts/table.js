// 获取浏览器的sessionStorage对象
var sstorage = null;
if (window.sessionStorage){
    sstorage=window.sessionStorage;
} else {
    alert("浏览暂不支持sessionStorage");
}
    
// 代表整个当前比赛界面
var table = {
    /* 桌子基本信息 */
    groupname: new Array("", "A", "B", "C", "D"),
    rid: -1,
    tid: -1,
    groups: 0,
    upg: 0,

    /* 用户基本信息 */
    time: new Date(),
    user_name: "",
    // 当前用户的组与组内位置
    gid: -1,
    pos: -1,
    // 当前用户的组和组内位置（数组形式）
    groupinfo: null,
    // 标志当前用户是裁判还是普通用户，为空表示为普通用户；裁判的值为judge
    role: "",

    /* 用户比赛信息 */
    // 每位选手提出异议的次数，最多只有3次机会
    objection: 3,
    // 表明当前是否有异议，用于控制裁判进行下一题
    is_objection: 0,
    // 记录已显示异议消息的选手
    // 每出一道新题时重置为空
    objct_array: new Array(),

    /* 比赛控制信息 */
    // 游戏是否开始的标志位
    gamestart: 0,
    // 标志是否轮到该用户答题
    myturn: 0,
    // 标志当前回答问题的选手ID
    cuser_id: "",
    // 标志用户是否已经提交答案
    issubmit_answer: 0,
    // 裁判是否发送评判结果
    isjudge: 0,
    // 标志当前用户是否还能继续进行比赛
    // 为0表示用户已退出或者挂掉，不能继续比赛，只能看
    gamestate: 1,

    /* 答题时间进度条 */
    // 控制答题时间进度条的时间对象
    intervalObj: null,
    // 每道题的做题时间
    interval: 30000,
    // 总共需要执行多少次进度条宽度变化事件
    intervalTime: 0,
    // 每个多少毫秒进度条宽度变化一次
    peradd: 100,
    // 当前宽度百分比，还用于标记是否还可以继续答题
    percent: 100,

    /* 时间戳 */
    _timestamp_: 0,
    _url_: "/HanziGame/index.php?m=GameHall&",


    // 保存页面状态
    save_page_state: function () {
        item = {
            "user_name": table.user_name,
            "rid": table.rid,
            "tid": table.tid,
            "groups": table.groups,
            "upg": table.upg,
            "groupinfo": table.groupinfo,
            "gid": table.gid,
            "pos": table.pos,
            "gamestart": table.gamestart
        };
        // 存储session
        sstorage.table = JSON.stringify(item);
    },
    // 恢复页面
    renew: function () {
        var item = JSON.parse(sstorage.table);
        table.user_name = item["user_name"];
        table.rid = item["rid"];
        table.tid = item["tid"];
        table.groups = item["groups"];
        table.upg = item["upg"];
        table.groupinfo = item["groupinfo"];
        table.gid = item["gid"];
        table.pos = item["pos"];
        table.gamestart = item["gamestart"];
    },
    // 初始化页面
    init: function (rid, tid, groups, upg, username) {
        table.rid = rid;
        table.tid = tid;
        table.groups = groups;
        table.upg = upg;
        table.user_name = username; //table.time.getTime().toString().substr(7);

        // 初始时间戳设置为0能获取房间所有信息，而不必加入房间
        table._timestamp_ = 0;
    },
    // 建立连接
    init_socket: function () {
        // 设置当前用户
        $("#suserName").text(table.user_name);

        // 参数设置
        //
        var info = "a=get_table_info&";
        info += "timestamp=" + table._timestamp_ + "&";
        info += "ming=" + table.user_name + "&";
        info += "groups=" + table.groups + "&";
        info += "upg=" + table.upg + "&";
        info += "rid=" + table.rid + "&";
        info += "tid=" + table.tid;

        // 获取信息
        $.ajax({
            type: "GET",
            url: table._url_ + info,
            success: function (response) {
                response = JSON.parse(response);
                // 有更新才更新
                if (typeof (response["timestamp"]) != "undefined") {
                    table._timestamp_ = parseFloat(response["timestamp"]);
                    // 更新消息
                    table.update(response);
                }
                setTimeout(table.init_socket, 1000);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                warningmsg("webmain error: " + textStatus, "error");
            }
        });
    },

    // 注意区分
    // 是桌子信息更新
    // 还是聊天信息更新
    update: function (data) {
        /* 聊天消息 */
        if (typeof (data.chat) != "undefined") {
            response_msg(data.chat);
        }
        /* 桌子信息 */
        if (typeof (data.table) != "undefined") {
            var tb = data.table;

            /* 旁观者 */
            set_spectator(tb["cusers"], tb["judge"]);

            /* 选手 */
            updategroup(tb["cusers"]);

            /* 选手异常离开 */
            // 比赛过程中若有人员变动：如比赛中离开，则更新game_control中的groups
            if (table.gamestart) game_control.undate(tb["cusers"]);

            /* 裁判 */
            judgegroup(tb["judge"], data["timestamp"]);

            /* 比赛已开始，且用户还未提交答案 */
            // 即每个选手每道题目只有一次答题机会
            if (typeof (tb["question"]) != "undefined" && typeof (tb["over"]) == "undefined") {
                if (tb["question"]["isjudge"] >= 0) {
                    // 发送评判结果
                    handle_judge_answer(tb["judge"], tb["question"]);
                } else if (tb["question"]["imgurl"] != "") {
                    // 公布当前选手答案
                    answer_canvas(tb["judge"], tb["question"]["imgurl"], tb["question"]["uid"]);
                } else {
                    // 公布下一题
                    start_response(tb["question"]);
                }

                // 服务器对选手异议的回复
                objection_response(tb["cusers"], tb["question"]["objection"]);
            }

            /* 比赛结束 */
            if (typeof (tb["over"]) != "undefined") {
                // 隐藏我有异议按钮
                $("#btnObjection").css("display", "none");

                // 如果还没有计算好得分榜，则开始计算
                if ($("#tb_score").children().children().length == 1)
                    compute_scores(tb["over"].groups, tb["over"].jscore);
            }
        }
    }
}