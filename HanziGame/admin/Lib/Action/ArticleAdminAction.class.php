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
			$aid=$_POST['id'];
			$data[author]=$_POST['author'];
			$data[content]=$_POST['content'];
			$DBarticle=M('article');
			$res=$DBarticle->where("id='".$aid."'")->save($data);
			if($res){
				$this->success('更新成功','?m=ArticleAdmin&a=index');
			}
			else{
				$this->error('编辑失败，请重试');
			}
		}else{
			$aid=I('id');
			$DBarticle=M('article');
			$article=$DBarticle->where("id='".$aid."'")->find();
			$this->assign('article',$article);
			$this->display();
		}
	}
	function delArticle(){
		$aid=I('id');
		$DBarticle=M('article');
		$res=$DBarticle->where("id='".$aid."'")->delete();
		if($res){
			$this->success('删除成功','?m=ArticleAdmin&a=index');
		}else{
			$this->error('删除失败，请重试！');
		}
	}
	function articleimport(){
		if($this->isPost()){
			$data['author']=$_POST['author'];
			$data['content']=$_POST['comment'];
			$data['in_time']=date('y-m-d H:i:s');
			//data('y-m-d H:i:s',time())
			$DBarticle=M('article');
			$res=$DBarticle->add($data);
			if ($res) {
				$this->success('添加成功','?m=ArticleAdmin&a=index');
			}else{
				$this->error('添加失败');
			}
		}else{
			$this->display();
		}
	}
	function articleexport(){
		echo "文章导出";
	}
}
?>