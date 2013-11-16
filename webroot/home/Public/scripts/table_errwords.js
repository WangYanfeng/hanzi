// 记录用户错词列表
// 或者裁判查看异议用户

var errorwords = {
    // 错词列表的元素格式为[vid, word, explain]
    words: new Array(),

    // 如果已经添加，则直接返回
    add: function (word) {
        var i = 0;
        for (i = 0; i < errorwords.words.length; i++) {
            if (errorwords.words[i].vid == word.vid) return;
        }
        errorwords.words.push(word);
        // 将最新的错词放到最前面
        errorwords.words = errorwords.words.reverse();
    },
    del: function (vid) {
        var i = 0;
        for (i = 0; i < errorwords.words.length; i++) {
            if (errorwords.words.vid == vid) break;
        }
        delete errorwords.words[i];
    },
    get: function () {
        var list = new Array();
        for (var i = 0; i < errorwords.words.length; i++) {
            list.push(errorwords.words.vid);
        }
    },

    // 界面操作
    update: function () {
        var obj = $("#errorWords").empty();
        for (var i = 0; i < errorwords.words.length; i++) {
            obj.append("<div style='text-overflow:ellipsis; overflow:hidden; margin-bottom:1px;'>" +
             errorwords.words[i].word + "：" +
             errorwords.words[i].explain + "</div>");
        }
    }
}