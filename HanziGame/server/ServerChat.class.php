<?php

import("Memo");


// 聊天消息
// 在Memo中存放桌子的聊天信息，只保存最近50条信息
class ServerChat{
	public static $max_msg_count = 50;

	// 辅助工具
	static function init(){
		$memo = new memo();
		$memo->delData("chart_info");
	}
	static function get(){
		$memo = new memo();
		return $memo->getData("chart_info");
	}


	// 添加桌子聊天对象到memo中
	static function add_chart_info($key, $timestamp){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$chart_info = $memo->getData("chart_info");

		// 有缓存信息
		if($chart_info != false){
			// 先检测是否已经存储
			// 若已存在，不需再添加
			if (ServerChat::get_index($key, $chart_info) >= 0) return 0;

			// 追加到最后
			$chart_info[] = array(
				"key"=>$key,
				"msg"=>array(),
				"timestamp"=>$timestamp
			);
			$memo->setData("chart_info", $chart_info);
		}else{
			// 如果之前没有chart_info信息，现在以数组形式添加
			$temp = array(
				"key"=>$key,
				"msg"=>array(),
				"timestamp"=>$timestamp
			);
			$memo->setData("chart_info", array($temp));
		}
		return 1;
	}
	// 当删除桌子信息时，也应该删除其对应索引信息
	// 该函数应该由ServerAssistant在桌子信息删除时统一调用
	// $key为桌子号
	static function del_chart_info($pos){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$chart_info = $memo->getData("chart_info");

		unset($chart_info[$pos]);
		$memo->setData("chart_info", $chart_info);
		return 1;
	}
	// 获取桌子聊天对象信息，用于判断是否存在该对象
	// 如果存在则直接返回；否则添加后返回
	static function get_chart_info($key){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$chart_info = $memo->getData("chart_info");

		$pos = ServerChat::get_index($key, $chart_info);
		return $pos >=0 ? $chart_info[$pos] : null;
	}
	// 返回指定桌子聊天对象在chart_info中的索引位置
	static function get_index($key, $chart_info){
		foreach($chart_info as $k=>$v){
			if ($key == $v["key"]) return $k;
		}
		return -1;
	}


	// 添加消息，同时更新聊天对象时间
	// 消息格式为：[发送者ID，内容，时间戳]
	// 消息长度限制为50个字符(包括汉字)
	static function add_msg($key, $msg){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$chart_info = $memo->getData("chart_info");
		
		// 得到$key桌子对应的聊天信息
		$pos = ServerChat::get_index($key, $chart_info);
		$info = $chart_info[$pos]["msg"];
		
		if(count($info) > 0){
			// 只保存最新的50条消息
			if(count($info) + 1 == self::$max_msg_count){
				$info = array_slice($info, 1);
			}
			$info[] = $msg;
			$chart_info[$pos]["msg"] = $info;
			$memo->setData("chart_info", $chart_info);

			// 更新时间戳
			ServerChat::update_timestamp($pos, $msg["timestamp"]);
			return 1;
		}else{
			// 直接添加$msg
			$chart_info[$pos]["msg"][] = $msg;
			$memo->setData("chart_info", $chart_info);
			
			// 更新时间戳
			ServerChat::update_timestamp($pos, $msg["timestamp"]);
			return 1;
		}
		return 0;
	}
	// 获取时间戳在timestamp之前的消息
	static function get_msg($key, $timestamp){
		// 从缓存中获取桌子列表信息
		$memo = new memo();
		$chart_info = $memo->getData("chart_info");

		$pos = ServerChat::get_index($key, $chart_info);
		$info = $chart_info[$pos]["msg"];

		foreach ($info as $k => $v) {
			if($v["timestamp"] > $timestamp){
				// 当info中的序号不连续时，返回的消息正确性需要验证！！！
				return array_slice($info, $k);
			}
		}
		// 没有更新数据直接返回
		return null;
	}

	// 更新时间戳
	static function update_timestamp($k, $timestamp){
		// 从缓存中获取信息
		$memo = new memo();
		$chart_info = $memo->getData("chart_info");

		$chart_info[$k]["timestamp"] = $timestamp;
		$memo->setData("chart_info", $chart_info);
	}
	// 获取时间戳
	static function get_timestamp($k){
		// 从缓存中获取信息
		$memo = new memo();
		$chart_info = $memo->getData("chart_info");
		return $chart_info[$k]["timestamp"];
	}
}