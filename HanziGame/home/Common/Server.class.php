<?php

import("Common.Memo", APP_PATH);
import("Common.WordsManage", APP_PATH);

class Server{
	// 辅助工具
	static function init(){
		$memo = new memo();
		$memo->delData("room_table_info");
		$memo->delData("word_warehouse");
	}
	static function get(){
		$memo = new memo();
		return $memo->getData("room_table_info");
	}
	static function get_words($key){
		// 从缓存中获取词库信息
		$memo = new memo();
		$words = $memo->getData("word_warehouse");
		
		foreach($words as $k=>$v){
			if ($key == $v["key"]) 
				return $words;
		}

		return "";
	}

	// 桌子信息总控函数
	static function set_table_info($g){
		try{
			// 用户房间和桌子类别编码格式
			$key = Server::room_index($g["rid"], $g["tid"]);

			// 操作类型
			switch ($g["type"]) {
				case "register":
					// 添加新用户及其组信息
					$add = Server::user_index($g["gid"], $g["pos"], $g["ming"]);
					Server::add_user($key, $add);
					break;
				case "exit":
					Server::del_user($key, $g["ming"]);
					break;
				case "judge_apply":
					Server::add_judge($key, $g["ming"]);
					break;
				case "judge_exit":
					// 退出操作
					Server::del_judge($key, $g["ming"]);
					break;
				case "start":
					// 设置比赛开始标志
					Server::set_gamestart($key);
					// 出题
					Server::update_question($key,$g["uid"],"start");
					break;
				case "next_question":
					// 出题
					Server::update_question($key,$g["uid"]);
					break;
				case "judge":
					// 裁判评定答案正误
					Server::update_user_state($key, $g["uid"], $g["state"]);
					break;
				case "objection":
					// 选手异议
					Server::raise_objection($key, $g["ming"], $g["param"]);
					break;
				case "gameover":
					// 比赛结束
					Server::gameover($key, $g["groups"], $g["jscore"]);
					break;
			}

			// 更新桌子时间戳
			Server::update_timestamp($key, $g["timestamp"]);
		} catch (Exception $e) {
		}
	}


	// 添加桌子信息
	static function add_table_info($temp){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

		// 更新缓存
		if($room_table_info != false){
			// 先检测是否已经存储
			// 若已存在，不需再添加
			if (Server::get_index($key, $room_table_info) >= 0) return 0;

			// 追加到最后
			$room_table_info[] = $temp;
			$memo->setData("room_table_info", $room_table_info);
		}else{
			// 如果之前没有room_table_info信息，现在添加
			// 注意是数组形式
			$memo->setData("room_table_info", array($temp));
		}
		return 1;
	}
	// 当最后一个人离开后，删除桌子信息
	// $k为桌子在列表中的序号
	static function del_table_info($k){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		unset($room_table_info[$k]);
		$memo->setData("room_table_info", $room_table_info);
	}
	// 获取桌子信息，用于判断是否存在该桌子
	// 如果存在则直接返回；否则添加后返回
	static function get_table_info($key){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		$pos = Server::get_index($key, $room_table_info);
	 	
	 	return $room_table_info[$pos];
	}
	// 获取key在桌子缓存中的位置
	static function get_index($key, $room_table_info){
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) return $k;
		}
	}
	// 判断桌子中的位置是否已有用户，以免添加冲突
	// $add为待添加用户的信息
	// $cusers为当前桌子中所有用户的信息
	static function is_postion_empty($cusers, $add){
		foreach($cusers as $k=>$v){
			if ($add["gid"] == $v["gid"] && $add["pos"] == $v["pos"]) {
				return 1;
			}
		}
		return 0;
    }
	// 桌子号ID的格式
	static function room_index($rid, $tid){
		return "r".$rid."t".$tid;
	}


	// 更新房间桌子列表的最新信息
	// 将所有列表信息存放到memocache中
	// $current_users为数组形式，每条记录存放一个人；其现阶段的实现为拼接字符串
	static function add_user($key, $add){
		// 获取当前的current_users信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		$current_users = Server::get_all_user($key, $room_table_info);
		if($current_users == null) $urrent_users = array();
		
		// 更新缓存
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				if(!Server::is_postion_empty($current_users, $add)){
					$current_users[] = $add;
					$room_table_info[$k]["cusers"] = $current_users;
					$memo->setData("room_table_info", $room_table_info);
					return 1;
				}else{
					return 0;
				}
			}
		}

		return 0;
	}
	static function del_user($key, $search){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

		// 删除用户$search
		$current_users = Server::get_all_user($key, $room_table_info);
		foreach($current_users as $k=>$v){
			if($v["name"] == $search){
				unset($current_users[$k]);
				break;
			}
		}

		// 保存修改后的结果
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				$room_table_info[$k]["cusers"] = $current_users;
				$memo->setData("room_table_info", $room_table_info);
				return 1;
			}
		}
		// 操作失败
		return 0;
	}
	// 设置当前用户比赛状态
	static function update_user_state($key, $uid, $state){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

		// 查找用户
		$current_users = null;
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				$current_users = $room_table_info[$k]["cusers"];
				break;
			}
		}
		// 更新缓存
		foreach($current_users as $j=>$v){
			if ($uid == $v["name"]) {
				$current_users[$j]["state"] = $state;
				$room_table_info[$k]["cusers"] = $current_users;
				// 表明裁判已经裁决过
				$room_table_info[$k]["question"]["isjudge"] = $state;
				$memo->setData("room_table_info", $room_table_info);
				return 1;
			}
		}

		// 操作失败
		return 0;
	}
	// 用户离开页面，如果当前桌子没有一个人（包括裁判），则删除桌子
	// 返回值为1表示删除桌子；
	// 同时通知ServerAssistant删除对应的索引和聊天对象
	static function user_exception($key, $k, $search, $role){
		// 删除当前用户：裁判或者选手
		if ($role == "user") {
			Server::del_user($key, $search);
		} else {
			Server::del_judge($key, $search);
		}

		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		$current_users = $room_table_info[$k]["cusers"];
		if(count($current_users) == 0 && $room_table_info[$k]["judge"] == ""){
			// 删除房间对应的词库
			Server::del_words($key);

			// 删除房间信息
			unset($room_table_info[$k]);
			$memo->setData("room_table_info", $room_table_info);
			return 1;
		}

		return 0;
	}
	// 获取桌子中所有的用户信息
	static function get_all_user($key, $room_table_info){
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				return $v["cusers"];
			}
		}
		return null;
    }
    // 用户在桌子中的ID
    static function user_index($gid, $pos, $user_name){
    	return array(
    		"gid"=>$gid,
    		"pos"=>$pos,
    		"name"=>$user_name,
    		"state"=>1,
    		"objection"=>0
    		);
    }


	// 向本桌子添加裁判
	// 成功返回1，失败返回0
	static function add_judge($key, $username){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				if(array_key_exists("judge", $v) && $v["judge"] != ""){
					return 0; // 添加失败
				}else{
					$room_table_info[$k]["judge"] = $username;
					$memo->setData("room_table_info", $room_table_info);
					return 1; // 添加成功
				}
			}
		}
		return 0;
	}
	// 删除本桌子裁判
	// 成功返回1，失败返回0
	static function del_judge($key, $username){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				if(array_key_exists("judge", $v) && $v["judge"] = $username){
					$room_table_info[$k]["judge"] = "";
					$memo->setData("room_table_info", $room_table_info);
					return 1; // 删除成功
				}
			}
		}
		return 0;
	}
	// 返回当前桌子裁判的账号
	static function get_judge_account($key){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				if (array_key_exists("judge", $v)) {
					return $v["judge"];
				}else{
					return "";
				}
			}
		}
		return "";
	}


	// 设置开始比赛标志
    static function set_gamestart($key){
    	// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

    	foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				$room_table_info[$k]["startgame"] = 1;

				// 加载词库列表到memo中
				Server::set_words($key, $v["degree"], $v["groups"] * $v["upg"]);

				$memo->setData("room_table_info", $room_table_info);
				return 1;
			}
    	}

    	return 0;
    }
    // 获取开始比赛标志
    static function get_gamestate($key){
    	// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

    	foreach($room_table_info as $k=>$v){
    		if ($key == $v["key"]) {
				return $v["startgame"];
			}
    	}
    	// 操作失败，默认比赛没有开始
    	return 0;
    }
	// 更新桌子中的当前题目和做题选手
	static function update_question($key, $uid, $flag="next"){	
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		// 更新缓存
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				$id = 0;
				if(array_key_exists('question', $room_table_info[$k]))
					$id = $room_table_info[$k]["question"]["id"] + 1;

				// 出下一道题
				$ar=array();
				$temp = Server::get_next_word($key, $id);
				// 词在当前词库列表中的位置，从0开始
				$ar["id"] = $id;
				// 词在数据库中的ID号
				$ar["vid"] = $temp["vid"];
				// 拼音
				$ar["pinyin"] = explode(" ", $temp["pinyin"]);
				// 词的字数
				$ar["num"] = count($ar["pinyin"]);
				// 答题时间
				$ar["interval"] = 10000 * $ar["num"];
				// 释义
				$ar["explain"] = $temp["explain"];
				// 答案
				$ar["answer"] = $temp["topic"];

				// 需要做题的用户ID
				$ar["uid"] = $uid;
				// 表明是比赛开始，还是下一道题
				$ar["operation"] = $flag;
				// 选手答案
				$ar["imgurl"] = "";
				// 裁判已经评判标志，值为0、1表示错误、正确
				$ar["isjudge"] = -1;
				// 选手异议标志，值为0、1表示无、有
				$ar["objection"] = 0;

				$room_table_info[$k]["question"] = $ar;
				$memo->setData("room_table_info", $room_table_info);
				return 1;
			}
		}

		return 0;
	}
	// 更新桌子中当前选手的答案
	static function update_answer($key, $imgurl){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		// 更新缓存
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				$ar = $room_table_info[$k]["question"];
				$ar["imgurl"] = $imgurl;
				$room_table_info[$k]["question"] = $ar;
				$memo->setData("room_table_info", $room_table_info);
				return 1;
			}
		}

		return 0;
	}
	// 选手提出、撤销异议
	// 规则：
	// 1、各组的所有人都有权提出异议，提出时objection的值加1；
	// 2、各组的所有人都有权撤销异议，撤销时objection的值减1；
	// 3、当objection的值为0时才能进行下一组比赛
	// 4、异常情况下，有人都提出异议而不撤销，则在3分钟内，自动撤销该人提出的异议
	// $param=1表示提出异议；-1为撤销异议
	static function raise_objection($key, $uid, $param){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		$pos = Server::get_index($key, $room_table_info);
		$current_users = $room_table_info[$pos]["cusers"];
		
		// 若是提出异议，则设置异议者标志位
		foreach ($current_users as $k => $v) {
			if ($v["name"] == $uid) {
				$current_users[$k]["objection"] += $param;
				break;
			}
		}

		// 更新缓存
		$room_table_info[$pos]["cusers"] = $current_users;
		$room_table_info[$pos]["question"]["objection"] += $param;
		$memo->setData("room_table_info", $room_table_info);
		return 1;
	}
	// 宣布比赛结束
	static function gameover($key, $groups, $jscore){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		// 更新缓存
		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				$room_table_info[$k]["over"]["groups"] = $groups;
				$room_table_info[$k]["over"]["jscore"] = $jscore;
				$memo->setData("room_table_info", $room_table_info);
				return 1;
			}
		}

		return 0;
	}


	// 获取词库中的下一个词
	// 当词库用完时返回空，表示比赛应该终止
	// $id为下一个词在词库中的位置
	static function get_next_word($key, $id){
		// 从缓存中获取词库信息
		$memo = new memo();
		$words = $memo->getData("word_warehouse");
		
		foreach($words as $k=>$v){
			if ($key == $v["key"]) 
			if($id + 1 < count($v["val"])) return $v["val"][$id];
		}

		return "";
	}
	// 添加词库
	// 当桌子销毁时，自动删除词库，不存在更新词库的问题
	static function set_words($key, $degree, $user_num){
		// 从缓存中获取词库信息
		$memo = new memo();
		$words = $memo->getData("word_warehouse");
		
		// 加载词库列表
		$temp = array(
			"key"=>$key, 
			"val"=>WordsManage::get_words($degree, $user_num)
		);

		// 如果words不为空，直接追加到最后
		// 否则直接添加$temp
		if($words != false){
			$words[] = $temp;
			$memo->setData("word_warehouse", $words);
		}else{
			$memo->setData("word_warehouse", array($temp));
		}
	}
	// 删除词库
	// 当桌子销毁时，自动删除词库，不存在更新词库的问题
	static function del_words($key){
		// 从缓存中获取词库信息
		$memo = new memo();
		$words = $memo->getData("word_warehouse");
		
		foreach($words as $k=>$v){
			if ($key == $v["key"]) {
				unset($words[$k]);
				$memo->setData("word_warehouse", $words);
				return 1;
			}
		}

		return 0;
	}


	// 更新当前桌子信息的时间戳
	static function update_timestamp($key, $timestamp){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");

		foreach($room_table_info as $k=>$v){
			if ($key == $v["key"]) {
				$room_table_info[$k]["timestamp"] = $timestamp;
				$memo->setData("room_table_info", $room_table_info);
			}
		}
	}
	// 获取当前桌子信息的时间戳
	static function get_timestamp($k){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$room_table_info = $memo->getData("room_table_info");
		return $room_table_info[$k]["timestamp"];
	}


	/*
	Utf-8、gb2312都支持的汉字截取函数
	cut_str(字符串, 截取长度, 开始长度, 编码);
	编码默认为 utf-8
	开始长度默认为 0
	*/
	static function cut_str($string, $sublen, $start = 0){
	    $pa = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/";
	    preg_match_all($pa, $string, $t_string);

	    return join('', array_slice($t_string[0], $start, $sublen));
	}
}