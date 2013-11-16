<?php  

class memo{
    private $client;

    function __construct() {
        $this->client = new Memcache();
        // 这句代码是在本机上使用memcache的，下面一句是在ace上使用memcache；要注意应用场合
        $this->client->connect("127.0.0.1", 11211);
        //$this->client->init();
    }
    function __destruct() {
        $this->client->close();
    }

    function add(){
        $this->client->set('gid', 12345);
        $this->client->set('time', time());
    }

    // 根据小组号获取其存储的内容
    function getData($group_id){
        return $this->client->get($group_id);
    }

    function setData($group_id, $data){
        if($this->getData($id) == false){
            $this->client->set($group_id, $data);
        }else{
            $this->client->replace($group_id, $data);
        }
    }
    
    function delData($group_id){
        $this->client->delete($group_id);
    }
}