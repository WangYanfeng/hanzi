// 大厅界面js

// 初始化
sel_room_index = 0;
select_room($(".qu")[sel_room_index], sel_room_index);


// 切换房间
function select_room(obj, index) {
    previous = $(".qu")[sel_room_index];
    $(previous).css({ 'background': 'rgb(102,102,102)', 'color': '#fff' });
    obj = $(obj);
    obj.css({ 'background': '#cc6633', 'color': '#000' });
    sel_room_index = index;

    $.post("/thinksocket/index.php/MainHall/show_table/", { 'rid': index },
    function (rslt) { // 成功后的回调函数
        obj = $("#rooms");
        obj.empty();

        num = rslt.data.num;
        cols = 3; // 桌子默认一行显示3个
        colindex = 0;
        for (i = 0; i < num; i++) {
            if (colindex == 0) {
                obj.append("<div class='row'>");
            }
            obj.append("<div class='rm'><a href='" + select_table(i) + "'>桌子" + (i + 1) + "</a></div>");
            if (colindex + 1 == cols)
                colindex = 0;
            else
                colindex++;
        }
        obj.append("<div class='clear'></div>");
    });
}
function select_table(tid) {
    return "/thinksocket/index.php/GameHall/enter_table/rid/" + sel_room_index + "/tid/" + tid + "/groups/2/upg/2";
}