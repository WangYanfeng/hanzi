<?php
/**
* 
*/
class GameTableAction extends BaseAction
{
	
	function table(){
		$table_id=I('id');
		$DBgametable=M('gametable');
		$table=$DBgametable->where("id='".$table_id."'")->find();
		$this->assign('room_id',$table['house_id']);
		$this->assign('table_id',$table_id);
		$this->display();
	}
}
?>