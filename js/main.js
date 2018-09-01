~function(){
  var $body = $("body"),
       $delete_all = $(".delete-all"),
       $add_task = $(".add-task"),
       $add_task_val = $(".add-task-val"),
       $task_list = $(".task-list"),
       $completed,
       $delete,
       $detial,
       $task_detial = $(".task-detial"),
       $task_title = $(".task-detial-tasktitle"),
       $change_title = $(".task-detial-changetitle"),
       $detial_desc = $(".task-detial textarea"),
       $remain_time= $("#remain-time"),
       $music = $("audio")[0],
       isDetial = false,
       add_index = 0,
       task_list = [],
       detial_item
       ;
       $("document").ready(function(){
         console.log($("#remain-time"));
        $("#remain-time").datetimepicker();
        $body.on("click",function(e){
          if(e.target.className.toLowerCase()=="task-detial" || e.target.parentNode.className.toLowerCase()=="task-detial") {
            e.stopPropagation();
            return;
          }else{
            if(isDetial){
              $task_detial.css({
                width:0,
                opacity:0
              })
              set_detial(detial_item);
            }
          }
        })
      })



  render_task()
  $delete_all.on("click",function(){
    store.clear();
    add_index = 0,
    render_task()
  })
  $add_task.on("submit",function(e){
    e.preventDefault();
    e.stopPropagation;
    var val = $add_task_val.val();
    $add_task_val.val("");
    if(val.trim().length>0){    
      add_task(val,add_index);
    }    
  })

  
  function listen_completed(){
    $completed = $("input[name='task-completed']");
    $completed.on("click",function(){
      $this = $(this);    
      var isCompleted = $this.is(":checked");
      var index = get_index($this);
      if(isCompleted){
        change_data(index,true,"before")
      }else{
        change_data(index,false,"after")
      }
    })
    
  }

  function listen_delete() {
    $delete = $(".task-item-delete");
    $delete.on("click",function(){
      $this = $(this);
      my_alert("您确定要取消嘛").then(isConfirmed=>{
        if(isConfirmed) {
          var index = $this.parent().attr("data-index");
          delete_task($this,index);
        }

      })
    })
  }
  // 监听详情
  function listen_detial(){
    $detial = $(".task-item-detial");
    listen_title();
    $detial.on("click",function(e){
      e.stopPropagation();
      $this = $(this);
      if(!isDetial) {
        detial_item = $this.parent();
        get_detial(detial_item);
        isDetial = !isDetial;
        $task_detial.css({
          width: 200,
          opacity: .8
        })
      }else {
        isDetial = !isDetial;
        $task_detial.css({
          width: 0,
          opacity: 0
        })
        set_detial(detial_item);
       
      }
      
    })
  }

  function listen_title(){
    $task_title.on("click",function(e){
      e.stopPropagation();
      $(this).hide();
      $change_title.show();
    })
  }
 
remain_time()
function remain_time(){
  var timer = setInterval(function(){
    for(let i=0;i<task_list.length;i++) {
      if(!task_list[i] && !task_list[i].remain){
        continue;
    }
    remain_time = task_list[i].remain;
    var cur_timestamp = (new Date().getTime());
    var target_timestamp = (new Date(remain_time).getTime());
    span_time = cur_timestamp - target_timestamp;
    if(span_time>=0 && !task_list[i].completed ){
      $music.play();
      var content = task_list[i].content;
      remain_show(content,i);
      task_list[i].completed = true;
      
    }
  }
  },500)
}

  // 功能区
  // 1.初始化，用于从loaclStorage中获取数据
  function init() {
      task_list = store.get("task_list") || [];
  }
// 2.添加单条数据
  function add_task(val,index) {
    var temp = `<li class="task-item bg" data-index=${index}><input type="checkbox" name="task-completed" id=""><span class="task-content">${val}</span><span class="task-item-detial">详情</span><span class="task-item-delete">删除</span></li>`;
  $temp = $(temp);
  $task_list.prepend($temp);
  add_index++;
  // new_task需要新建，要不然指向同一个地址，修改一个会修改所有；
  var new_task = {};
  new_task.content = val;
  // 向列表及数据库中添加
  task_list.push(new_task);
  new_new_task = null;
  store.set("task_list",task_list);
  listen_delete();
  listen_detial();
  listen_completed()
  }

  
  // 3.删除某条数据

  function delete_task(item,index){
    item.parent().remove();
    task_list.splice(index,1);
    store.set("task_list",task_list);
    render_task();
  }

  //4. 刷新页面后渲染所有数据
  function render_task() {
    $task_list.html(" ");
    init();
    var temp = "";
    for(var i=task_list.length-1;i>=0;i--){
      var item =  task_list[i],index = i;
      if(item &&　item.content) {
        if(item.completed){
          temp += `<li class="task-item bg completed" data-index=${index}><input type="checkbox" name="task-completed" checked><span class="task-content">${item.content}</span><span class="task-item-detial">详情</span><span class="task-item-delete">删除</span></li>`;
        }else{
          temp += `<li class="task-item bg" data-index=${index}><input type="checkbox" name="task-completed" id=""><span class="task-content">${item.content}</span><span class="task-item-detial">详情</span><span class="task-item-delete">删除</span></li>`;
        }     
      }else{
        task_list.splice(index,1);
      }
    }

    $task_list.html(temp);
    
    listen_delete();
    listen_detial();
    listen_completed()
   }
  //  5.change_detial

  function get_detial($this){
   var index = $this.attr("data-index")
   var  cur = task_list[index],
    title = cur.content,
    desc = cur.desc,
    time = cur.remain;

    $task_title.html(title);
    $change_title.val(title);
    $detial_desc.val(desc);
    $remain_time.val(time)

  }

  function set_detial($this) {
   if(isDetial) {
    var index = $this.attr("data-index")
    var  cur = task_list[index];
    if(cur && $change_title.val()) {
      cur.content = $change_title.val();
      var val = $change_title.val();
      $this.find(".task-content").html(val)
    };
          
 
    cur.desc= $detial_desc.val();
    cur.remain = $remain_time.val();
    store.set("task_list",task_list);
    isDetial  = false;

   }

  }

  // getCur 获取当前元素在list_style中的对应
  function get_index($this){
    return  $this.parent().attr("data-index");
  }

  function change_data(index,isCompleted,pos) {
    if(task_list[index]){
      task_list[index].completed = isCompleted;
    }

    var temp = task_list.slice(index,index+1);
    task_list.splice(index,1);
    if(pos=="after"){
      task_list.push(temp[0]);
    }else if(pos=="before") {
      task_list.unshift(temp[0])
    }   
   store.set("task_list",task_list);
   render_task();
  }

  function remain_show(content,index){
    my_alert(content).then(isConfirmed=>{
      if(isConfirmed) {
        change_data(index,true,"before")
       }
    })
  }


  
}()

