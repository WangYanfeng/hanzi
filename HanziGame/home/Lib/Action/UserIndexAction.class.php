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
}
?>