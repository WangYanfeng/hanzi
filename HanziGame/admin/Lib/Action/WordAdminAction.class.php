<?php
/**
* 
*/
class WordAdminAction extends BaseAction
{
	public $DBwords_basic;
	function index(){
		$DBwords_basic=M('words_basic');
		$word_array=$DBwords_basic->select();
		//dump($word_array);die();
		$this->assign('word_array',$word_array);
		$this->display();
	}
	function wordimport(){
		$this->display();
	}
	function wordexport(){
		echo "导出";
	}
}
?>