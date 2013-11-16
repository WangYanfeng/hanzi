<?php

class IndexAction extends Action {
    public function index(){
    	$this->display('login');
    }
    function login(){
    	if($this->isPost()){
    		$user = $_POST['userName'];
            $pwd = $_POST['password'];
            $DBuser_basic=D('user_basic');
            $res=$DBuser_basic->where("account='" . $user . "' AND pwd='" . $pwd. "'")->find();
            $id=$res['id'];
            if ($res) {
                session('user', array(
                            'id' => $res['id'],
                            'account' => $res['account']
                ));
                //echo $_SESSION['user']['name'];die();
                $this->redirect('__APP__/GameHall/hall');
            }else{
                $result='密码错误';
                $this->assign('result',$result);
                $this->display();
            }
    	}else{
    		$this->display();
    	}
    }
    function regist(){
        if($this->isPost()){
            $data['account']=I('userName');
            $data['pwd']=I('userPassword');
            $data['email']=I('userEmail');
            $data['in_time']=date('y-m-d H:i:s',time());
            $res=filter_var($data['email'],FILTER_VALIDATE_EMAIL);
            if($res==false){
                echo "邮箱格式错误！";
            }else{
                $DBuser=D('user_basic');
                $res=$DBuser->where("account='".$data['account']."'")->find();
                if($res){
                    echo "用户名已存在！";
                }else{
                    $res=$DBuser->add($data);
                    if($res){
                        $DBuser_active=D('user_active');
                        $id=$DBuser->where("account='".$data['account']."'")->getField('id');
                        $act_data['uid']=$id;
                        $act_data['time']=date('y-m-d H:i:s',time());
                        $DBuser_active->add($act_data);
                        echo "success";
                    }
                }
            }
        }else{
            $this->display();
        }
    }
    public function logout(){
        session(null);
        $this->success('退出成功，返回首页','__APP__');
    }  
    public function mainpage(){
        $id=$_SESSION['user'][id];
        if($id==null) {$this->display('login');}
        else{
            $DBwords_active=M('words_active');
            $errorword=$DBwords_active->order('err_times desc')->limit(4)->select();
            $articleArray=$this->getArticle();
            $wordArray=$this->getWords($errorword);
            $topuser=$this->getTopUser();
            $this->assign('topuser',$topuser);
            $this->assign('errorwords',$wordArray);
            $this->assign('articles',$articleArray);
            $this->display();
        }
    } 
    public function getTopUser(){
        $DBuser_active=M('user_active');
        $DBuser_basic=M('user_basic');
        $array=$DBuser_active->order('points desc')->limit(4)->select();
        for ($i=0; $i < count($array); $i++) { 
            $id=$array[$i]['uid'];
            $res=$DBuser_basic->where("id='".$id."'")->find();
            $name=$res['account'];
            $array[$i]['account']=$name;
        }
        return $array;
    }
    public function getArticle(){
        $DBarticle=M('article');
        $array=$DBarticle->getField('id,author,comment');
        return($array);
    } 
    public function getArticleContent(){
        $DBarticle=M('article');
        $id=I('article_id');
        $article=$DBarticle->where("id='".$id."'")->getField('content');
        echo $article;
    }
    public function getWords($array){
        $DBwords=M('words_basic');
        for ($i=0; $i < count($array); $i++) { 
            $array[$i]=$DBwords->where("id='".$array[$i]['aid']."'")->find();
        }
        return($array);
    }
}