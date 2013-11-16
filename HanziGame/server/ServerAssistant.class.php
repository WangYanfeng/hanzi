<?php

import("Memo");
import("Server");
import("ServerChat");

// 在Memo中建立新一级的索引缓存
// 主要存放有关Memo中桌子的信息，提供访问速度
class ServerAssistant{
	// 辅助工具
	static function init(){
		$memo = new memo();
		$memo->delData("table_index");
	}
	static function get(){
		$memo = new memo();
		return $memo->getData("table_index");
	}


	// 获取桌子索引，用于判断是否存在该索引
	// 如果存在则直接返回；
	// 否则依次添加桌子、聊天对象和桌子索引后返回
	static function get_table_index($g){
		// 用户房间和桌子类别编码格式
		$key = Server::room_index($g["rid"],$g["tid"]);

		// 从缓存中获取桌子索引信息
		$memo = new memo();
		$table_index = $memo->getData("table_index");
		
		// 默认不存在索引信息
		// 如果table_index不为空，则检测是否已经存在索引信息
		// 若存在，直接返回；否则，重新添加
		$pos = -1;
		if ($table_index != false) {
			$pos = ServerAssistant::get_index($key, $table_index);
		}

		// 如果存在直接返回
		if($pos >= 0){
			return $table_index[$pos];
		}else{
			// 依次添加桌子、聊天对象和桌子索引
			//
			// 桌子
			Server::add_table_info(array(
				"key"=>$key,
				"groups"=>$g["groups"], // 组数
				"upg"=>$g["upg"], 		// 每组的用户人数
				"degree"=>1,			// 比赛所需词库的难易度
				"cusers"=>array(),
				"judge"=>"",
				"startgame"=>0,
				"timestamp"=>$g["timestamp"]
			));
			
			//
			// 聊天对象
			ServerChat::add_chart_info($key, $g["timestamp"]);

			//
			// 桌子索引
			$chart_info = $memo->getData("chart_info");
			$room_table_info = $memo->getData("room_table_info");
			// 最新待添加的索引内容
			$temp = array(
				// 桌子ID
				"key"=>$key,	
				// 桌子索引
				"tbpos"=>Server::get_index($key, $room_table_info),
				// 聊天对象索引
				"cpos"=>ServerChat::get_index($key, $chart_info),
				// 时间戳
				"timestamp"=>$g["timestamp"]
			);

			// 如果table_index不为空，直接追加到最后
			// 否则直接添加$temp
			if($table_index != false){
				$table_index[] = $temp;
				$memo->setData("table_index", $table_index);
			}else{
				$memo->setData("table_index", array($temp));
			}
			
			return $temp;
		}
	}
	// 当删除桌子信息时，也应该删除其对应索引信息
	// 用户异常退出：如关闭浏览器，比赛结束后退出
	// 在本函数中同时调用Server和SeverChat中的删除桌子和聊天对象函数！！未做
	static function index_exception($g){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$table_index = $memo->getData("table_index");

		$key = Server::room_index($g["rid"], $g["tid"]);
		$pos = ServerAssistant::get_index($key, $table_index);

		if ($pos >= 0) {
			// 通过桌子对象异常判断是否真的需要删除桌子、索引和聊天对象
			// 如果需要，则user_exception自动删除桌子，并返回1
			if(Server::user_exception(
				$key, 
				$table_index[$pos]["tbpos"], 
				$g["ming"], 
				$g["role"])){
				// 删除聊天对象
				ServerChat::del_chart_info($table_index[$pos]["cpos"]);
				// 删除索引
				unset($table_index[$pos]);
				$memo->setData("table_index", $table_index);
				return 1;
			}else{
				// 发生异常事件，如果还没有删除桌子信息，则更新时间戳
				Server::update_timestamp($key, $g["timestamp"]);
				
				// 更新索引对象时间戳
        		ServerAssistant::update_timestamp($key, $_REQUEST["timestamp"]);
			}
		}
		return 0;
	}
	// 返回指定桌子在table_index中的索引位置
	static function get_index($key, $table_index){
		foreach($table_index as $k=>$v){
			if ($key == $v["key"]) return $k;
		}
		return -1;
	}


	// 当桌子信息发生变化时，通过该总控函数调用Server中函数
	static function update_tb_answer($key, $imgurl){
        // 更新当前用户答案
        return Server::update_answer($key, $imgurl);
	}
	// 设置桌子信息
	static function set_table_info($g){
		// 执行操作
		Server::set_table_info($g);
	}
	// 更新聊天对象信息
	function set_chat_info($key, $g){
		$msg = array(
			"uid"=>$g["ming"],
			"msg"=>$g["msg"],
			"timestamp"=>$g["timestamp"]
		);
		ServerChat::add_msg($key, $msg);
	}
	// 获取当前桌子和聊天对象的时间戳
	// 并通过比较选择返回的数据内容
	// 规则：
	// response默认为空
	// 如果桌子有更新response中加上table；
	// 如果聊天对象有更新，加上chat；
	static function get_table_info($g){
		$response = array();
		
		// 请求的时间戳
		$timestamp = $g["timestamp"];
		// 桌子ID
		$key = Server::room_index($g["rid"], $g["tid"]);
		// 索引对象中的时间戳
		$index = ServerAssistant::get_table_index($g);
		
		if($index["timestamp"] > $timestamp){
			// 桌子
			if(Server::get_timestamp($index["tbpos"]) > $timestamp)
				$response["table"] = Server::get_table_info($key);
			// 聊天对象
			if(ServerChat::get_timestamp($index["cpos"]) > $timestamp)
				$response["chat"] = ServerChat::get_msg($key, $timestamp);
			// 时间戳
			$response["timestamp"] = $index["timestamp"];
		}

		return $response;
	}


	// 当桌子信息变化或者有新的聊天信息时
	// 更新当前桌子索引时间戳
	static function update_timestamp($key, $timestamp){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$table_index = $memo->getData("table_index");

		// 找到桌子索引信息
		$pos = ServerAssistant::get_index($key, $table_index);
		$table_index[$pos]["timestamp"] = $timestamp;

		// 保存索引信息
		$memo->setData("table_index", $table_index);

		return 1;
	}
	// 获取当前桌子索引的时间戳：包括桌子和聊天对象
	static function get_timestamp($key){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$table_index = $memo->getData("table_index");

		$pos = ServerAssistant::get_index($key, $table_index);
		return $table_index[$pos];
	}
}