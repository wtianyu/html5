		var Alert = {
   		new: function(title, info) {
        var alert = {};
        var init = ()=>{ 
        	alert.body = document.createElement("div"); //容器
		    alert.title = document.createElement("div"); //标题
		    alert.info = document.createElement("div"); //内容
		    alert.bottom = document.createElement("div"); //底部按钮容器
		    alert.button = document.createElement("button"); //底部按钮

		    alert.body.className = "alertBody";
		    alert.title.className = "alertTitle";
		    alert.info.className = "alertInfo";
		    alert.bottom.className = "alertBottom";
		    alert.button.className = "alertButton";
		    alert.body.appendChild(alert.title);
		    alert.body.appendChild(alert.info);
		    alert.body.appendChild(alert.bottom);
		    alert.bottom.appendChild(alert.button);

		    alert.title.innerText = title;
		    alert.info.innerText = info;
		    alert.button.innerText = "确定";
		    alert.button.onclick = alert.close;
        };//初始化
        alert.show = function() { 
        	  init(); 
			  window.onload = function(){
  				 document.body.appendChild(alert.body);
			  }
         };//显示弹框
        alert.close = function() { 
        	  document.body.removeChild(alert.body);
    		  alert=undefined;
         };//关闭弹框
         return alert;
    },

	new: function(info) {
		var title = "信息提示";
        var alert = {};
        var init = ()=>{ 
        	alert.body = document.createElement("div"); //容器
		    alert.title = document.createElement("div"); //标题
		    alert.info = document.createElement("div"); //内容
		    alert.bottom = document.createElement("div"); //底部按钮容器
		    alert.button = document.createElement("button"); //底部按钮

		    alert.body.className = "alertBody";
		    alert.title.className = "alertTitle";
		    alert.info.className = "alertInfo";
		    alert.bottom.className = "alertBottom";
		    alert.button.className = "alertButton";
		    alert.body.appendChild(alert.title);
		    alert.body.appendChild(alert.info);
		    alert.body.appendChild(alert.bottom);
		    alert.bottom.appendChild(alert.button);

		    alert.title.innerText = title;
		    alert.info.innerText = info;
		    alert.button.innerText = "确定";
		    alert.button.onclick = alert.close;
        };//初始化
        alert.show = function() { 
        	  init(); 
			  window.onload = function(){
  				 document.body.appendChild(alert.body);
			  }
         };//显示弹框
        alert.close = function() { 
        	  document.body.removeChild(alert.body);
    		  alert=undefined;
         };//关闭弹框
         return alert;
    }
};