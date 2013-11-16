// 答题时间进度条

// 启动选手或者裁判的比赛进度条
function progressbar(uid) {
    // 进度条事件控制代码：使用百分比
    // 不能使用像素，否则会出现突然消失的情况
    //
    // 先重置进度条为100%
    table.percent = 100;
    $("#sprogress").css("width", table.percent + "%");
    // 然后再递减
    table.intervalObj = setInterval(function () {
        if (table.interval / table.peradd > table.intervalTime) {
            table.percent -= 100 * table.peradd / table.interval;
            $("#sprogress").css("width", table.percent + "%");
            table.intervalTime++;
        } else {
            // 用于控制选手答题时间
            table.percent = 0;
            table.intervalTime = 0;
            clearInterval(table.intervalObj);
            $("#sprogress").css("width", table.percent);

            // 答题时间已经用完
            progress_timeout(uid);
        }
    }, table.peradd);
}
// 答题时间已经用完
function progress_timeout(uid) {
    if (table.role == '') {
        // 如果时间到了之后用户还没有提交答案，则自动提交当前书写的内容
        if (uid == table.user_name && !table.issubmit_answer) {
            upload_img();
        }
    } else {
        // 裁判在解决完争议后可以继续下一道题目
    }
}
// 重启答题进度条
function init_progressbar() {
    clearInterval(table.intervalObj);
}