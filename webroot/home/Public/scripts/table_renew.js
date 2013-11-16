// 恢复网页内容js

// 如果页面不是第一次加载，则不需要再建立连接等其他操作
// 防止刷新出问题
$(function () {
    //sstorage.addgroup = data + "|" + jname + "|" + name;
    if (sstorage.addgroup) {
        data = sstorage.addgroup.split('|');
        addgroup(JSON.parse(data[0]), data[1], data[2]);
    }

    //sstorage.registergroup = data + "|" + jname + "|" + name;
    if (sstorage.registergroup) {
        data = sstorage.registergroup.split('|');
        registergroup(JSON.parse(data[0]), data[1], data[2]);
    }

    //sstorage.exitgroup = gid + "|" + pos + "|" + name + "|" + data;
    if (sstorage.exitgroup) {
        data = sstorage.exitgroup.split('|');
        exitgroup(data[0], data[1], data[2], JSON.parse(data[3]));
    }

    //sstorage.judgegroup = username + "|" + rslt;
    if (sstorage.judgegroup) {
        data = sstorage.judgegroup.split('|');
        exitgroup(data[0], data[1]);
    }

    //sstorage.judge_exit_group = username + "|" + rslt;
    if (sstorage.judge_exit_group) {
        data = sstorage.judge_exit_group.split('|');
        exitgroup(data[0], data[1]);
    }

    //sstorage.answer_canvas = jname + "|" + imgurl;
    if (sstorage.answer_canvas) {
        data = sstorage.answer_canvas.split('|');
        exitgroup(data[0], data[1]);
    }
});