<?php
/**
* 
*/
class UserIndexAction extends BaseAction
{
	function userIndex(){
		//$uid=2;
		$uid=$_SESSION['user'][id];
		$DBuser_active=M('user_active');
		$DBuser_basic=M('user_basic');
		$user=$DBuser_basic->where("id='".$uid."'")->find();
		$userAccount['account']=$user['account'];
		$userAccount['id']=$uid;
		$data=$DBuser_active->where("uid='".$uid."'")->getField('uid,points,judge_experience,credit');
		$friends=$DBuser_active->where("uid='".$uid."'")->getField('friends');
		if($friends!=null) {
			$friend_array=explode(",", $friends);
			$friendsInfo=$this->getFriendInfo($friend_array);
			$friendsName=$this->getFriendName($friend_array);
		}
		$this->assign("userAccount",$userAccount);
		if($friendsName){$this->assign("friendsName",$friendsName);} 
		if($friendsName)$this->assign("friendsInfo",$friendsInfo);
		$this->assign("userinfo",$data[$uid]);
		$this->display();
	}
	function delFriend(){
		$friend_id=I('friend_id');
		$uid=I('id');
		$DBuser_active=M('user_active');
		$friends=$DBuser_active->where("uid='".$uid."'")->getField('friends');
		$friend_array=explode(",", $friends);
		$result=array();
		for ($i=0; $i < count($friend_array); $i++) { 
			if($friend_array[$i]!=$friend_id){
				array_push($result, $friend_array[$i]);
			}	
		}
		$friends=implode(',', $result);
		$res=$DBuser_active->where("uid='".$uid."'")->setField('friends',$friends);
		if($res){echo "删除成功！";}
		else{echo "删除失败，请重新操作！";}
	}
	function getFriendInfo($data){
		$DBuser_active=M('user_active');
		$friendsInfo=array();
		for ($i=0; $i < count($data); $i++) {
			$uid=$data[$i];
			$temp=$DBuser_active->where("uid='".$uid."'")->getField('uid,points,judge_experience,credit');
			$friendsInfo[$i]=$temp[$uid];
		}
		return($friendsInfo);
	}
	function getFriendName($data){
		$DBuser_basic=M('user_basic');
		$friendsName=array();
		for($i=0;$i<count($data);$i++){
			$id=$data[$i];
			$friendsName[$i]['id']=$DBuser_basic->where("id='".$id."'")->getField('id');
			$friendsName[$i]['account']=$DBuser_basic->where("id='".$id."'")->getField('account');
		}
		return($friendsName);
	}
	function upload(){
		if (!empty($_FILES)) {
            //如果有文件上传 上传附件
            $uid=I("id");
            $this->_upload($uid);
        }
	}
	protected function _upload($id) {
        import('ORG.Util.UploadFile');
        //导入上传类
        $upload = new UploadFile();    
        $upload->maxSize= 3292200;    //设置上传文件大小
        $upload->allowExts= explode(',', 'jpg,gif,png,jpeg');//设置上传文件类型
        $upload->savePath= '../webroot/home/Public/images/user/'; //设置附件上传目录
        $upload->thumb= true;//设置需要生成缩略图，仅对图像文件有效
        $upload->imageClassPath= 'ORG.Util.Image'; // 设置引用图片类库包路径
        //$upload->thumbPrefix= 'm_,s_';  //生产2张缩略图
        $upload->thumbPrefix= 's_'; //设置需要生成缩略图的文件后缀 
        $upload->thumbMaxWidth= '110';//设置缩略图最大宽度
        $upload->thumbMaxHeight= '110'; //设置缩略图最大高度
        $upload->saveRule='uniqid';//设置上传文件规则
        $upload->thumbRemoveOrigin = true; //删除原图
        if (!$upload->upload()) {
            //捕获上传异常
            $this->error($upload->getErrorMsg());
        }else{
        	$uploadList = $upload->getUploadFileInfo();
        	//dump($uploadList);
        	$url=$uploadList[0]['savepath'].$uploadList[0]['savename'];
        	//echo $url;die();
        }
        $user_active= M('user_active');
        //保存当前数据对象
        $data['url']=$url;
        //$list   = $model->where("id='".$id."'")->update($data);
        if ($list !== false) {
            $this->success('上传图片成功！');
        } else {
            $this->error('上传图片失败!');
        }
    }
}
?>