<?php
// 本类由系统自动生成，仅供测试用途
class IndexAction extends Action {
	public function index(){
		$this->display('login');
	}
	public function dologin(){		
		$user=I('userName');
		$pwd= I('password');
		$DBuser=D('user_basic');
		$res=$DBuser->where("account='" . $user . "' AND pwd='" . $pwd. "'")->find();
		$id=$res['id'];
		if ($res) {
			session('user', array(
				'id'=> $res['id'],
				'account'=> $res['account']
		));
		//echo $_SESSION['user']['name'];die();
		$this->redirect('__APP__/GameHall/hall/');
		}else{
			$this->display('login');
		}
	}
    function doregist(){
            $data['account']=I('userName');
            $data['pwd']=I('userPassword');
            $re_userPassword=I('re_userPassword');
            if($data['pwd']!=$re_userPassword){die();}
            $data['email']=I('userEmail');
            $data['in_time']=date('y-m-d H:i:s',time());
            $res=filter_var($data['email'],FILTER_VALIDATE_EMAIL);
            if($res==false){die();}
            else{
                $DBuser=D('user_basic');
                $res=$DBuser->where("account='".$data['account']."'")->find();
                if($res){
                    die();
                }else{
                    $res=$DBuser->add($data);
                    if($res){
                        $DBuser_active=D('user_active');
                        $id=$DBuser->where("account='".$data['account']."'")->getField('id');
                        $act_data['uid']=$id;
                        $act_data['time']=date('y-m-d H:i:s',time());
                        $DBuser_active->add($act_data);
                        $this->redirect('__APP__/Index/login/');
                    }
                }
            }
    }
    public function logout(){
        session(null);
        $this->redirect('__APP__/Index/login');
    }    
}