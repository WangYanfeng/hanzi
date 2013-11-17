<?php
/**
* 
*/
class UserAdminAction extends BaseAction
{
	public $DBuser_basic;
	function index(){
		$DBuser_basic=M('user_basic');
		$user_array=$DBuser_basic->select();
		$this->assign('user_array',$user_array);
		$this->display();
	}
	function friend(){
		echo "好友操作";
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