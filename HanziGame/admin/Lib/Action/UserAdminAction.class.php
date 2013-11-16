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
}
?>