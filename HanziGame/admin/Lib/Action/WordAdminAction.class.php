<?php
/**
* 
*/
class WordAdminAction extends Action
{
	
	function index(){
		$DBwords_basic=M('words_basic');
		$word_array=$DBwords_basic->select();
		//dump($word_array);die();
		$this->assign('word_array',$word_array);
		$this->display();
	}
  function errorword(){
    echo "错词集锦";
  }
  function getWords(){
    import('ORG.Util.Page');// 导入分页类
    $DBwords_basic=M('words_basic');
    $list=$DBwords_basic->select();
    $param = array(
            'result'=>$list,            //分页用的数组或sql
            'listvar'=>'item',            //分页循环变量
            'listRows'=>20,         //每页记录数
            'parameter'=>"",//url分页后继续带的参数
            'target'=>'showWords',  //ajax更新内容的容器id，不带#
            'pagesId'=>'page',        //分页后页的容器id不带# target和pagesId同时定义才Ajax分页
            'template'=>'Main:sensorDataTable',//ajax更新模板
        );
        $this->page($param);
        $this->display();
  }
	function wordimport(){
		$this->display();
	}
	function word_add(){
		import('ORG.Util.ExcelToArray');
		$tmp_file = $_FILES ['file_words'] ['tmp_name'];  
        $file_types = explode ( ".", $_FILES ['file_words'] ['name'] );  
        $file_type = $file_types [count ( $file_types ) - 1];/*判别是不是.xls文件，判别是不是excel文件*/  
        if (strtolower ( $file_type ) != "xlsx" && strtolower ( $file_type ) != "xls")        
         {  
              $this->error ( '不是Excel文件，重新上传' );  
         }  
         /*设置上传路径*/ 
        C('UPLOAD_DIR','../webroot/admin/Upload/') ;
        
        $savePath = C('UPLOAD_DIR'); 
         /*以时间来命名上传的文件*/  
        $str = date ( 'Ymdhis' );   
        $file_name = $str . "." . $file_type; 

         /*是否上传成功  */  
	    if (! copy ( $tmp_file, $savePath . $file_name )){  
	        echo "error";  
	    }
        $ExcelToArrary=new ExcelToArray();//实例化  
        $res=$ExcelToArrary->read(C('UPLOAD_DIR').$file_name,"UTF-8",$file_type);//传参,判断office2007还是office2003  
        foreach ( $res as $k => $v ) //循环excel表  
           {
               $k=$k-1;//addAll方法要求数组必须有0索引  
               $data[$k]['topic'] = $v [0];//创建二维数组  
               $data[$k]['difficulty'] = $v [1];  
               $data[$k]['pinyin'] = $v [2];       
               $data[$k]['explanation'] = $v [3];
               $data[$k]['article_id'] = $v [4];  
               $data[$k]['in_time'] =date ( 'Y-m-d h:i:s' );
          }  
        $DBwords_basic=M('words_basic');//M方法  
        $result=$DBwords_basic->addAll($data);  
        if(! $result)  
          {  
            $this->error('导入出错失败'); 
          }  
        else  
          {  
            $this->success('导入成功', '__URL__/wordimport');
          }  
	}
	function wordexport(){
		$this->display();
	}
  function exportExcel(){
    import('ORG.Util.ArrayToExcel');
    $xlsName  = "Words";
    $xlsCell  = array(
            array('topic','题目'),
            array('difficulty','难度'),
            array('pinyin','拼音'),
            array('article_id','关联文章id')
        );
    $DBwords_basic= M('words_basic');
    $xlsData  = $DBwords_basic->Field('topic,difficulty,pinyin,article_id')->select();
    $ArrayToExcel=new ArrayToExcel();
    //dump($xlsData);die();
    $ArrayToExcel->exportExcel($xlsName,$xlsCell,$xlsData);
  }
  public function page($param) {
        extract($param);
        import("@.ORG.Page");
        //总记录数
        $flag = is_string($result);
        $listvar = $listvar ? $listvar : 'list';
        $listRows = $listRows? $listRows : 21;
        if ($flag)
            $totalRows = M()->table($result . ' a')->count();
        else
            $totalRows = ($result) ? count($result) : 1;
        //创建分页对象
        if ($target && $pagesId)
            $p = new Page($totalRows, $listRows, $parameter, $url,$target, $pagesId);
        else
            $p = new Page($totalRows, $listRows, $parameter,$url);
        //抽取数据
        if ($flag) {
            $result .= " LIMIT {$p->firstRow},{$p->listRows}";
            $voList = M()->query($result);
        } else {
            $voList = array_slice($result, $p->firstRow, $p->listRows);
        }
        $pages = C('PAGE');//要ajax分页配置PAGE中必须theme带%ajax%，其他字符串替换统一在配置文件中设置，
        //可以使用该方法前用C临时改变配置
        foreach ($pages as $key => $value) {
            $p->setConfig($key, $value);
             // 'theme'=>'%upPage% %linkPage% %downPage% %ajax%'; 要带 %ajax%
        }
        //分页显示
        $page = $p->show();
        //模板赋值
        $this->assign("word_array", $voList);
        $this->assign("page", $page);
        if($this->isPost()){
          return $voList;
        }
        if ($this->isAjax()) {//判断ajax请求
            layout(false);
            $template = (!$template) ? 'ajaxlist' : $template;
            exit($this->fetch($template));
        }       
    }
}
?>