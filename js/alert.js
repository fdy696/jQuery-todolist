~function(){
  function my_alert(opts){
    return new Promise((resolve,reject)=>{
      var config = {},
         $body = $('body'),
         $box,
         $mask,
         $confirm = $(".confirm"),
         $cancel,
         isConfirmed = "";
 ;
 var defd = $.Deferred;
    // 处理参数
    if(!opts) console.error("opts is required");
    if(typeof opts ==="string"){
      config.title = opts;
      config.confirm = "确定";
      config.cancel = "取消"
    }else {
      $.extend(config,opts)
    }
    // 创建弹出页
    // 内部提示
    $box = $(`<div class="alert">
    <div class="alert-title">${config.title}</div><div class="choose"><button class="confirm">${config.confirm}</button><button class="cancel">${config.cancel}</button></div></div>`)
    $box.css({  
      width: 300,
      height: 85,
      background: "#fff",
      "text-align": "center",
      color: "#444",
      position: "fixed",
       left: 0,
       top: -100,
       bottom: 0,
       right: 0,
       margin: "auto",
      "border-radius": 3,
     " box-shadow": "1px 2px 2px #ccc"})
     $box.find(".alert-title").css({
      "padding-bottom": 12,
      "font-weight": "bold",
      "font-size": 18,
       padding: 12,
       
     })
     $box.find(".choose button").css({
      width: 75,
      height: 30,
      background:"#FF3366",//"#46b1e4"(蓝),
      border: "none",
      "margin-right": 10,
     })

    //  遮罩层
    $mask = $("<div class='mask'></div>")
    $mask.css({
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: "rgba(0,0,0,.5)"
    });
    $body.append($mask);
    $body.append($box);
    

    timer = setInterval(function(){
      if(isConfirmed){
        resolve(isConfirmed);
        clearInterval(timer);
      }
    },50)
    
    $(".confirm").on("click",function(e){
      e.preventDefault();
      isConfirmed = true;
      removeAlert();
    })

    $(".cancel").on("click",function(e){
      e.preventDefault();
      isConfirmed = false;
      removeAlert();

    })

    $mask.on("click",function(e){
      e.preventDefault();
      removeAlert();

    })

    function removeAlert(){
      $box.remove();
      $mask.remove();
    }
    })
    
  }
  window.my_alert = my_alert;

}()