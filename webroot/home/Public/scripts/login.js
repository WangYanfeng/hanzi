// 登录系统
function do_login() {
    account = $("#account").val();
    pwd = $("#pwd").val();
    if (account=="" || pwd=="") {
        alert("不能为空");
        return;
    };
    prefix = "/thinksocket/index.php/";
    $.get(prefix + "Login/do_login", {'account': account, 'pwd' : pwd},
    function (rslt) {
        if (rslt.data == 'err') {
            alert('登录失败');
        }else{
            location.href = prefix + rslt.data;
        }
    });
}