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
            $DBadmin=D('admin');
            $res=$DBadmin->where("account='".$user."' AND pwd='".$pwd."'")->find();
            if($res){
            	session('admin', array(
                            'id' =>1,
                            'account' => $user
                ));
            	//$this->redirect('__APP__/Admin/admin');
                    // 成功后跳转页面
                header('Location:admin.php?m=Admin&a=admin');
            }
            else{
                $result='密码错误';
                $this->assign('result',$result);
                $this->display();
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