// 进入游戏进度条，等全部数据加载完毕后关闭进度条


// 页面加载进度条
function enter_progressbar() {
    // 进度条事件控制代码：使用百分比
    // 不能使用像素，否则会出现突然消失的情况
    //
    // 显示进度条
    $("#enter_progress").parent().css("display", "block");

    // 先重置进度条为0
    table.enterpercent = 0;
    $("#enter_progress").css("width", table.enterpercent);
    // 然后再递增
    table.enterintervalObj = setInterval(function () {
        if (table.enterpercent + 1 <= 100) {
            table.enterpercent += 1;
            $("#enter_progress").css("width", table.enterpercent + "%");
        } else {
            // 循环进度条
            table.enterpercent = 0;
            $("#enter_progress").css("width", table.enterpercent);
        }
        if (table.entercompleted) {
            enter_progress_timeout();
        }
    }, 1);
}
// 页面加载完毕
function enter_progress_timeout() {
    clearInterval(table.enterintervalObj);
    $("#enter_progress").parent().css("display", "none");

    // 重置页面加载完毕标志
    table.entercompleted = 0;
}