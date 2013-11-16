<?php
// 本类由系统自动生成，仅供测试用途
class WordsManage {
    // 每次比赛的最大轮数
    public static $ROUNDS=10;

	// 根据难易度、比赛用户数目，返回指定数目的词
    static function get_words($degree, $user_num){
		$db = M("words_basic");
        $res = $db->where("difficulty=". $degree)->order('in_time desc')->select(); 
        
        $ar = array();
        $index = 0;
        $total_num = $user_num * self::$ROUNDS;
        foreach ($res as $k => $v) {
            $ar[]=array(
                "vid"=>$v["id"],
                "topic"=>$v["topic"],
                "pinyin"=>$v["pinyin"],
                "explain"=>$v["explanation"]
            );
            $index++;
            if($index == $total_num) break;
        }

	    return $ar;
	    
    }

    // 用户登录
    // 登录成功返回用户在表中的唯一ID，失败返回-1
    static function login_user($data){
        $DBuser_basic = M("user_basic");
        $res = $DBuser_basic->where("account='". $data['account']."'")->find();
        if ($data['pwd'] == $res['pwd']) {
            return $res['id'];
        }
        return -1;
    }

    // 注册新用户
    // 字段验证应在前台完成
    static function register_user($data){
       	$DBuser_basic = M("user_basic");
    	$DBuser_basic->create();

        // 注意$data['account']的用法，如果使用$data->account会出现错误
    	$DBuser_basic->account = $data['account'];
    	$DBuser_basic->pwd = $data['pwd'];
    	$DBuser_basic->coment = $data['coment'];
    	$DBuser_basic->in_time = $data['in_time'];
    	
    	return $DBuser_basic->add() > 0 ? true : false;
    }

	// 修改用户信息
    // 字段验证应在前台完成
    static function modify_user($data){
    	$DBuser_basic = M("user_basic");

        return $DBuser_basic->save($data) > 0 ? true : false;
    }    

 	// 注销用户信息
    // 字段验证应在前台完成
    static function delete_user($id){
    	$DBuser_basic = M("user_basic");
    	$res = $DBuser_basic->where("id=". $id)->delete();

        return $res > 0 ? true : false;
    }
}