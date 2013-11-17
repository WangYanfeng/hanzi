<?php
/**
* 权限认证
*/
class BaseAction extends Action
{
	
	function _initialize()
	{
		$this->checklogin();
	}
	function checklogin(){
		if ((!isset($_SESSION['admin']) || !$_SESSION['admin'])) {
			$this->error("没有登录", '__APP__/Index/login');
		}
		
	}
}
?>