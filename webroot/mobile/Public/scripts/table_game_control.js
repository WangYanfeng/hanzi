// 控制当前哪组哪个人做题
// 供裁判在所有人到齐后开始比赛前调用

var game_control = {
    // 当前选手所在组号
    cgid: 0,
    // 当前选手ID
    cuid: '',
    // 所有组剩余人数总和
    remains: 0,
    // 所有组的所有人的状态
    groups: new Array(),

    // 标志当前比赛选手是否已经提交答案，用于控制裁判继续下一题；
    // 与table对象中的属性功能不一样
    issubmit_answer: 0,

    // 比赛胜利小组的ID
    win_gid: -1,
    // 裁判的最终得分
    judge_scores: 0,

    // 通过判断是否有人决定当裁判
    judge_enabled: function () {
        // 获取当前所有组的组信息和用户信息
        for (var i = 0; i < table.groups; i++) {
            for (var j = 0; j < table.upg; j++) {
                if (get_user_account(i + 1, j + 1) != "") return 1;
            }
        }
        // 不能加入比赛
        return 0;
    },

    // 通过判断人数是否到齐决定开始比赛
    gamestart: function () {
        // 获取当前所有组的组信息和用户信息
        for (var i = 0; i < table.groups; i++) {
            for (var j = 0; j < table.upg; j++) {
                if (get_user_account(i + 1, j + 1) == "") return 0;
            }
        }
        // 可以开始比赛
        return 1;
    },
    // 选择下一组中的人进行比赛
    next: function () {
        // 首先检测比赛是否可以结束
        var gamestate = game_control.gameover();
        if (gamestate !== -1) {
            // 比赛结束，记录获胜组的ID
            game_control.win_gid = gamestate;
            // 同时计算各组和裁判的得分
            game_control.compute_scores();
            return '';
        }

        // 获取下一个还有选手的组
        // 组间规则：
        // 如果剩余人数大于0的组数等于1，则该组为最终胜利组，比赛结束
        // 如果剩余人数大于0的组数大于1，则选择上次没有被选中的组
        var gid = game_control.cgid;
        for (var i = 0; i < game_control.groups.length; i++) {
            if (gid + 1 == game_control.groups.length) gid = 0; else gid++;
            if (game_control.groups[gid]['remains'] > 0 && game_control.groups[gid]['gid'] != game_control.cgid) {
                break;
            }
        }

        var groups = game_control.groups[gid];
        var pos = groups['cpos']; // 当前组中上一次参赛选手的位置
        for (var i = 0; i < groups['count']; i++) {
            if (pos + 1 == groups['count']) pos = 0; else pos++;
            if (groups['users'][pos]['gamestate']) {
                // 组内规则：
                // 当前组中只剩下一个可用的人时，直接返回该人
                // 当前组中可用人数大于1，则应选择一个上次没有被选中的人
                if ((groups['remains'] > 1 && pos != groups['cpos']) || groups['remains'] == 1) {
                    game_control.cgid = gid;
                    game_control.cuid = groups['users'][pos]['uid'];

                    // 选中某人后，在该组中设置标志位，便于下次选择时选择其后面的人
                    game_control.groups[gid]['cpos'] = pos;

                    return game_control.cuid;
                }
            }
        }
    },

    init: function () {
        game_control.groups.length = 0;

        // 获取当前所有组的组信息和用户信息
        var groups = $("div[id^=group]");
        for (var i = 0; i < groups.length; i++) {
            var group = $(groups[i]);
            // 注意此处要减去1，很重要！！！
            var gid = parseInt(group.attr('id').replace("group", "")) - 1;

            var users = new Array();
            var items = get_group_users(gid + 1);
            for (var j = 0; j < items.length; j++) {
                users.push({ 'gamestate': 1, 'uid': $(items[j]).text(), 'score': 0 });
            }
            game_control.add(gid, items.length, users);

            // 总人数计算
            game_control.remains += items.length;
        }

        // 默认情况下从第一组开始
        game_control.cgid = groups.length - 1;
    },
    // 添加一组人
    add: function (gid, count, users) {
        game_control.groups.push({ "gid": gid, "count": count, "remains": count, "cpos": count - 1, "users": users, 'scores': 0 });
    },

    // 根据组号和用户ID改变用户当前状态
    changestate: function (state) {
        state = parseInt(state);
        var gid = game_control.cgid;
        var item = null;
        for (var i = 0; i < game_control.groups.length; i++) {
            item = game_control.groups[i];
            if (item['gid'] == gid) break;
        }

        // 修改用户状态
        var users = item['users'];
        // 用户的组内位置
        var pos = item['cpos'];
        users[pos]['gamestate'] = state;

        // 更新各组剩余人数
        game_control.remains = 0;
        for (var i = 0; i < game_control.groups.length; i++) {
            var item = game_control.groups[i];
            var users = item['users'];

            game_control.groups[i]["remains"] = 0;
            for (var j = 0; j < users.length; j++) {
                game_control.groups[i]['remains'] += users[j]['gamestate'];
            }
            game_control.remains += game_control.groups[i]['remains'];
        }
    },

    // 判断比赛是否可以结束，并返回胜利组的ID；如果不能结束，返回-1
    gameover: function () {
        // 第一个可以继续比赛的小组ID
        var gid = -1;
        // 可以继续比赛的小组数目
        var count = 0;
        for (var i = 0; i < game_control.groups.length; i++) {
            if (game_control.groups[i]['remains'] > 0) {
                if (gid == -1) gid = i;
                count++;
            }
        }
        if (count > 1) return -1;
        return gid;
    },
    // 比赛结束，计算各组的积分
    // 积分规则：胜利组每人5分；失败组每人2分；中途退出者0分；裁判3分
    compute_scores: function () {
        for (var i = 0; i < game_control.groups.length; i++) {
            var score = 1;
            if (i == game_control.win_gid) score = 5;
            game_control.groups[i]['scores'] = score;
        }
        // 裁判得分
        game_control.judge_scores = 3;
    },

    // 如果有人员变动：如比赛中离开
    // 则应更新game_control中的groups
    // 未做！
    undate: function (data) {
        /*for (var i in data) {
        var item = data[i];
        // 注意类型转换
        var gid = parseInt(item.gid);
        var pos = parseInt(item.pos);
        game_control.groups[gid]["users"][pos]["gamestate"] = -1;
        game_control.groups[gid]["remains"]
        }*/
    },

    // 添加当前选择用户的样式
    // 同时移除上次选择用户的样式
    additemcss: function (uid) {
        // 移除上次选择的样式
        var last = $("div[id^=group]>.selecteditem");
        if (last.length) last.removeClass("selecteditem");

        // 新选择用户样式
        get_user_parent(uid).addClass("selecteditem");
    },
    // 用户答错题，修改其样式
    dieitemcss: function (uid, flag) {
        // 只获取用户item中的头像部分
        var uparent = get_user_parent(uid).children('.headicon');
        if (parseInt(flag)) uparent.removeClass("dieditem");    // 回答正确
        else uparent.addClass("dieditem");                      // 回答错误
    }
}