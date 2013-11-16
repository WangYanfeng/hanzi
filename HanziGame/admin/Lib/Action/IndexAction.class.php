<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends Action {
	public function index(){
    	$this->display('login');
    }
    function login(){
    	if($this->isPost()){
    		$user = $_POST['userName'];
            $pwd = $_POST['password'];
            $DBuser_basic=D('user_basic');
            if($user=='admin'&&$pwd=='admin'){
            	session('user', array(
                            'id' =>1,
                            'account' => $user
                ));
            	$this->redirect('__APP__/Admin/admin');
            }
    	}else{
    		$this->display();
    	}
    }
    public function logout(){
        session(null);
        $this->success('退出成功，返回首页','__APP__');
    }
}