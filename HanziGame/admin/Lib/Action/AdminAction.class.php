<?php
/**
* 
*/
class AdminAction extends BaseAction
{
	
	function admin(){
		$this->display();
	}
	public function menu($item=1){
    //在top框架点击后，传来参数item
    if($item==1){
      	$menulist=array(
      			'key' => '用户管理',
           	    'list'=>array(
                            array('name'=>'用户信息','url'=>'?m=UserAdmin&a=index'),
                            array('name'=>'好友管理','url'=>'?m=UserAdmin&a=friend')
            	        )
        );
    }
    elseif ($item==2) {
      	$menulist=array(
      			'key' => '词库管理',
          	    'list'=>array(
                            array('name'=>'词库列表','url'=>'?m=WordAdmin&a=index'),
                            array('name'=>'易错词集锦','url'=>'?m=WordAdmin&a=errorword'),
                            array('name'=>'词汇入库','url'=>'?m=WordAdmin&a=wordimport'),
                            array('name'=>'词汇导出','url'=>'?m=WordAdmin&a=wordexport'),
            	        )
        );
    }
    elseif ($item==3) {
      $menulist=array(
      			'key' => '美文管理',
            	'list'=>array(
                        	array('name'=>'美文列表','url'=>'?m=ArticleAdmin&a=index'),
                        	array('name'=>'美文入库','url'=>'?m=ArticleAdmin&a=articleimport'),
                            array('name'=>'美文导出','url'=>'?m=ArticleAdmin&a=articleexport')
            			)
        );
    }
    elseif ($item==4) {
      $menulist=array('key' => '系统管理',
            	'list'=>array(
                            array('name'=>'系统设置','url'=>'?m=SystemAdmin&a=conf'),
                            array('name'=>'数据库备份','url'=>'?m=SystemAdmin&a=dbcopy'),
                            array('name'=>'系统优化','url'=>'?m=SystemAdmin&a=optimie')
            	        )
        );
    }
    $this->assign('menulist',$menulist);
    //$this->assign('item',$item);
    $this->display();
  }
}
?>