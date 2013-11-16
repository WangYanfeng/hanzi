// 当前数据保存和恢复

// 添加用户
function addgroup(data, jname, name) {
    // 设置当前用户
    $("#suserName").text(table.user_name);

    // 控制有无裁判
    if (jname != "") {
        $("#judge").css({ "display": "none" });
        $(".judge").text("有裁判").addClass("judge-online");
    } else {
        $("#judge").text("我来当裁判").css({ "display": "block" });
        $(".judge").text("无裁判").removeClass("judge-online");
    }

    // 更新组信息
    updategroup(data, name);

    // 存储session
    sstorage.addgroup = JSON.stringify(data) + "|" + jname + "|" + name;
}