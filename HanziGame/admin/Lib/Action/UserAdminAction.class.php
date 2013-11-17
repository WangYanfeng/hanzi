<?php
/**
* 
*/
class UserAdminAction extends BaseAction
{
	function index(){
		$DBuser_basic=M('user_basic');
		$user_array=$DBuser_basic->select();
		$this->assign('user_array',$user_array);
		$this->display();
	}
	function userinfo(){
		$model=new Model('hangame');
    	$userinfo_array=$model->table('tb_user_basic b,tb_user_active a')->where('a.uid=b.id')
              ->field('a.* ,b.account')
              ->select();
        for ($i=0; $i < count($userinfo_array); $i++) { 
        	$userinfo_array[$i]["friends"]=$this->getFW(M('user_basic'),$userinfo_array[$i]["friends"],'account');
        	$userinfo_array[$i]["error_words"]=$this->getFW(M('words_basic'),$userinfo_array[$i]["error_words"],'topic');
        }
        $this->assign('userinfo_array',$userinfo_array);
		$this->display();
	}
	function getFW($db,$list,$str){
		//好友，错词的id数组转为名称
		$array=explode(',', $list);
		for ($i=0; $i < count($array); $i++) { 
			$result.=$db->where("id='".$array[$i]."'")->getField($str).',';
		}
		return $result;
	}
	function deluser(){
		$uid=I("id");
		$DBuser_basic=M('user_basic');
		$res=$DBuser_basic->where("id='".$uid."'")->delete();
		if ($res) {
			$this->success('删除成功！');
		}
		else{
			$this->error('删除失败，请重试！');
		}
	}
}
?>