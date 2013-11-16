// 裁判宣布比赛结果

/* 比赛结束，计算积分
   积分规则：胜利组每人5分；失败组每人2分；中途退出者0分；裁判3分
*/
function compute_scores(groups, jscore) {
    // 由于后天memcache存储的时候序列化了，导致出现问题
    // 转换后才能使用JSON还原
    var temp = "";
    for (var i = 0; i < groups.length; i++) { if (groups[i] != "\\") temp += groups[i]; }
    var data = JSON.parse(temp);

    // 需要用到两次.children()才能获取tr
    var tb = $("#tb_score").children();
    var gname = new Array("甲组", "乙组", "丙组");

    // 添加裁判积分
    tb.append("<tr><td>裁判</td><td>裁判</td><td>" + jscore + "</td></tr>");

    // 添加选手积分
    for (var i = 0; i < data.length; i++) {
        var users = data[i]['users'];
        // 组号只显示一次
        tb.append("<tr><td>" + gname[i] + "</td><td>" + users[0]['uid'] + "</td><td>" + data[i]['scores'] + "</td></tr>");
        for (var j = 1; j < users.length; j++) {
            tb.append("<tr><td></td><td>" + users[j]['uid'] + "</td><td>" + data[i]['scores'] + "</td></tr>");
        }
    }

    // 显示查看积分按钮
    $("#btnscores").css("display", "block");
    // 显示得分榜
    //$('#scoreModal').modal('show');
    $("#scoreModal").dialog("open");
}