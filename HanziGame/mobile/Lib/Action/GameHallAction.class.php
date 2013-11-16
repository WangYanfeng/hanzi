<?php
/**
* 游戏大厅
*/

import("server.Server", THINK_PATH);
import("server.ServerChat", THINK_PATH);
import("server.ServerAssistant", THINK_PATH);

class GameHallAction extends BaseAction
{
	function hall(){
		$id=$_SESSION['user'][id];
		$DBhall=M('gamehall');
		$house_array=$DBhall->select();
		$this->assign('id',$id);
		$this->assign('num',count($house_array));
		$this->assign('house_array',$house_array);
		$this->display();
	}
	function room(){
		$house_id=I('rid');
        $_SESSION['rid'] = $house_id;

		$DBtable=M('gametable');
		$table_array=$DBtable->where("house_id='".$house_id."'")->select();
		$this->assign('num',count($table_array));
		$this->assign('table_array',$table_array);
		$this->display();
	}

	
	/* 2013-11-13 */
	function enter_table(){
        // 当前桌子基本信息
        $this->assign('rid', $_SESSION['rid']);
        $this->assign('tid', $_REQUEST['tid']);
        $this->assign('groups', 2);
        $this->assign('upg', 1);
        
        // 用户信息
        // 注意账号要转换为字符串，要不前台会出问题
        $this->assign('user_name', "'".$_SESSION['user'][account]."'");

        $this->display();
    }

    // 将用户手写上传的数字保存为png图片
    // 每次都保存所有的张图片
    function upload(){
        // 直接保存图片数据到桌子信息中
        // 而不是文件存储
        $imgurl = array(
            $_REQUEST['img1'],
            $_REQUEST['img2'],
            $_REQUEST['img3'],
            $_REQUEST['img4']
        );

        $key = Server::room_index($_REQUEST["rid"], $_REQUEST["tid"]);
        // 保存图片
        if(ServerAssistant::update_tb_answer($key, $imgurl)){
            // 更新桌子时间戳
            Server::update_timestamp($key, $_REQUEST["timestamp"]);
            // 更新索引时间戳
            echo ServerAssistant::update_timestamp($key, $_REQUEST["timestamp"]);
        }
        // 操作失败
        echo 0;
    }

    // 获取当前桌子的最新信息，包括桌子信息和聊天信息
    // 通过时间戳比较，返回指定内容的信息，避免每次传输过多的数据
    function get_table_info(){
        $response = ServerAssistant::get_table_info($_REQUEST);
        echo json_encode($response);
        ob_flush();
        flush();
    }
    // 更新当前桌子的信息
    function set_table_info(){
        ServerAssistant::set_table_info($_REQUEST);

        // 更新时间戳
        $key = Server::room_index($_REQUEST["rid"], $_REQUEST["tid"]);
        echo ServerAssistant::update_timestamp($key, $_REQUEST["timestamp"]);
        ob_flush();
        flush();
    }
    // 更新当前聊天对象的信息
    function set_chat_info(){
        // 更新时间戳
        $key = Server::room_index($_REQUEST["rid"], $_REQUEST["tid"]);
        ServerAssistant::set_chat_info($key, $_REQUEST);

        echo ServerAssistant::update_timestamp($key, $_REQUEST["timestamp"]);
        ob_flush();
        flush();
    }

    // 用户异常退出：如关闭浏览器，比赛结束后退出
    function index_exception(){
        ServerAssistant::index_exception($_REQUEST);       
    }

    // ServerAssistant辅助操作
    function del(){
        ServerAssistant::init();
        ServerChat::init();
        Server::init();
    }
    function get(){
        echo "控制对象<br>";
        $response = ServerAssistant::get();
        echo json_encode($response);
        echo "<br><br><br>";

        echo "桌子信息<br>";
        $response = Server::get();
        echo json_encode($response);
        echo "<br><br><br>";

        echo "聊天对象<br>";
        $response = ServerChat::get();
        echo json_encode($response);
        echo "<br><br><br>";

        echo "词库<br>";
        $response = Server::get_words();
        echo json_encode($response);
        echo "<br><br><br>";
        
        echo "词库A<br>";
        $temp = Server::get_next_word("r1t1", 0);
        echo json_encode($temp);
    }

    function ddd(){
        // 删除当前用户：裁判或者选手
        if ($g["role"] == "user") {
            Server::del_user($g["key"], $g["ming"]);
            echo 123;
            echo "<br>";
        } else {
            Server::del_judge($g["key"], $g["ming"]);
        }

        $memo = new memo();
        $room_table_info = $memo->getData("room_table_info");
        $current_users = $room_table_info[0]["cusers"];
        echo json_encode($current_users);
        echo "<br>";
        echo count($current_users);
        echo "<br>";
        echo $room_table_info[0]["judge"];
        if(count($current_users) == 0 && $room_table_info[0]["judge"] == ""){
            unset($room_table_info[0]);
            $memo->setData("room_table_info", $room_table_info);
            //Server::del_table_info($k);
            return 1;
        }
    }
}
?>