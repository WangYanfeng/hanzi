var WebApp = {
	//成员属性
  	_timestamp_ 	: 0,
	//_url_		  	: "/index.php?m=Comet",
	_url_		  	: "/thinkcomet/index.php/Comet",
  	_ajax_	  	: true,

	setURL : function(prefix){
  		WebApp._url_ = prefix;
  	},
	WebMain : function(){
		$.ajax({
		    type: "GET",
		    //url: WebApp._url_ + "&a=get&timestamp="+ WebApp._timestamp_,
		    url: WebApp._url_ + "/get/timestamp/"+ WebApp._timestamp_,
		    success: function(response){
		    	response = JSON.parse(response);

		    	lastmodif = WebApp._timestamp_;
				currentmodif = parseFloat(response['timestamp']);
				if (currentmodif > lastmodif) {
				//}else{
					// 停止继续发起连接
					//clearTimeout(WebApp._ajax_);

					WebApp._timestamp_ = parseFloat(response['timestamp']);
					WebApp.handleResponse(response);

					// 重新发起连接
					//WebApp._ajax_ = setTimeout(WebApp.WebMain, 10);
				}
				WebApp._ajax_ = setTimeout(WebApp.WebMain, 100);
		    },
		    complete: function (XMLHttpRequest, textStatus){
		    	
		    },
		    error: function (XMLHttpRequest, textStatus, errorThrown) {
		    	WebApp.handleResponse('webmain error: ' + errorThrown);
		    }
		});
	},
  	doRequest : function(request){
  		// 当前时间戳
		var timestamp = Date.parse(new Date());
  		$.ajax({
		    type: "GET",
		    url: WebApp._url_ + "&a=add&msg=" + request + "&timestamp=" + timestamp,
		    error: function (XMLHttpRequest, textStatus, errorThrown) {
		    	WebApp.handleResponse('add error: ' + errorThrown);
		    }
		});
  	},
  	handleResponse : function(response){
    	$('#content')[0].innerHTML += '<div>' + response['msg'] + ' - ' + response['timestamp'] + '</div>';
  	}
}