<?php
/**
* 
*/
class ArticleAdminAction extends BaseAction
{
	
	function index(){
		$DBarticle=M('article');
		$article_array=$DBarticle->select();
		$this->assign('article_array',$article_array);
		$this->display();
	}
	function editArticle(){
		if ($this->isPost()) {
			$author=$_POST['author'];
			$content=$_POST['content'];
			echo $author.'-->'.$content;
		}else{
			$aid=I('id');
			$DBarticle=M('article');
			$article=$DBarticle->where("id='".$aid."'")->find();
			$this->assign('article',$article);
			$this->display();
		}
	}
	function articleimport(){
		echo "导入";
	}
	function articleexport(){
		echo "dd";
	}
}
?>