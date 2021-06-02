import React, { Component } from "react";
import "./App.css";
import TaskForm from 'D:/ReacJSYoutube/lesson10-project2/src/component/TaskForm'
import Control from 'D:/ReacJSYoutube/lesson10-project2/src/component/Control'
import TaskList from 'D:/ReacJSYoutube/lesson10-project2/src/component/TaskList'
// import _ from 'lodash' import cả thư viện
import {findIndex} from 'lodash' //import thành phần trong lodash cho đỡ nặng
class App extends Component {
  //LocalStorage
 constructor(props){
   super(props)
   this.state={
     tasks:[], //id :uinque,name,status
     isDisplayForm:false,
     taskEditing:null,
     keyword:'',
     filter:{
       name:'',
       status:-1
     },
     sortBy:'name',
     sortValue:1
   }
   
 }
componentWillMount(){
  if(localStorage && localStorage.getItem('tasks')){
    var tasks=JSON.parse(localStorage.getItem('tasks'))
    this.setState({
      tasks:tasks
    })
  }
}
//Tạo ID ngẫu nhiên
s4(){
  return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1)
}
generateID(){
  return this.s4() + '-' + this.s4()+ '-' + this.s4()+ '-' + this.s4()+ '-' + this.s4()+ '-' + this.s4()+ '-' + this.s4()+ '-' + this.s4()
}
//Hết tạo ID
//Đóng mở form
onToggeForm=()=>{//thêm task
  if(this.state.isDisplayForm&&this.state.taskEditing!==null){
    this.setState({
      isDisplayForm:true,
      taskEditing:null
    })
  }else{
    this.setState({
      isDisplayForm:!this.state.isDisplayForm,
      taskEditing:null
    })
  }
 
}
//Đóng dấu X
onCloseForm=()=>{
  this.setState({
    isDisplayForm:false
  })
}
//Nhận lại giá trị từ props của taskForm
onSubmit=(data)=>{
  var {tasks}=this.state
  if(data.id===''){
    data.id=this.generateID() //Là 1 task
    tasks.push(data)
  }else{
    //Edit
    var index =this.findIndex(data.id)
    tasks[index]=data
  }
 
  this.setState({
    tasks:tasks,
    taskEditing:null
  })
  localStorage.setItem('tasks',JSON.stringify(tasks))
console.log(data);
}
//Update Status
onUpdateStatus=(id)=>{
  var {tasks}=this.state
  // var index =this.findIndex(id)
  //Ví dụ thirh-party  "Lodash"
  var index =findIndex(tasks,(task)=>{
    return task.id === id
  })
  console.log(index);
if(index!==-1){
  tasks[index].status =!tasks[index].status
  this.setState({
    tasks:tasks
  })
}
localStorage.setItem('tasks',JSON.stringify(tasks))
}
findIndex=(id)=>{
var {tasks}=this.state
var result = -1
tasks.forEach((task,index)=>{
  if(task.id===id){
    result=index
  }
})
return result
}
//Chức năng xóa
onDelete=(id)=>{
  var {tasks}=this.state
  var index =this.findIndex(id)
  console.log(index);
if(index!==-1){
  tasks.splice(index,1)
  this.setState({
    tasks:tasks
  })
  this.onCloseForm()
}
localStorage.setItem('tasks',JSON.stringify(tasks))
}
//Show form edit
onShowForm=()=>{
  this.setState({
    isDisplayForm:true
  })
}
//Sửa
onUpdate=(id)=>{
  var {tasks}=this.state
  var index =this.findIndex(id)
  var taskEditing=tasks[index]
  this.setState({
    taskEditing:taskEditing
  })
  this.onShowForm()
}
//Lọc dữ liệu 
onFilter=(filterName,filterStatus)=>{
  console.log(filterName,filterStatus);
  filterStatus = parseInt(filterStatus,10)
  this.setState({
    filter:{
      name:filterName,
      status:filterStatus
    }
  })
}
onSort=(sortBy,sortValue)=>{
this.setState({
  sortBy:sortBy,
  sortValue:sortValue
})
console.log(this.state);
}
//Tìm kiếm
onSearch=(keyword)=>{
 this.setState({
   keyword:keyword
 })
}
  render() {
    var { tasks,isDisplayForm,taskEditing,keyword,filter,sortBy,sortValue} =this.state //var tasks = this.state.task
   
   //Third Party  ví dụ filter
   tasks =tasks.filter((task)=>{
     return task.name.toLowerCase().indexOf(keyword.toLowerCase()) !==-1
   })
   //Lọc dữ liệu table
    if(filter){
      if(filter.name){
        tasks=tasks.filter((task)=>{
          return tasks=task.name.toLowerCase().indexOf(filter.name)!==-1
          })
        }
        tasks=tasks.filter((task)=>{
          if(filter.status===-1){
            return task
          }else{
            return task.status===(filter.status===1?true:false)
          }
        })
      
    }
    var elmTaskForm = isDisplayForm ? 
     <TaskForm 
      onCloseForm={this.onCloseForm}
      onSubmit={this.onSubmit}
      task={taskEditing} /> : ''
  //Sắp xếp
  if(sortBy ==='name'){
     tasks.sort((a,b)=>{
       if(a.name>b.name) return sortValue
       else if (a.name<b.name) return -sortValue
       else return 0
     })
    }else{
      tasks.sort((a,b)=>{
        if(a.status>b.status) return -sortValue
        else if (a.status<b.status) return sortValue
        else return 0
      })
    }
    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row">
          <div className={isDisplayForm===true?"col-xs-4 col-sm-4 col-md-4 col-lg-4":''}>
          {/*Form*/}
          {elmTaskForm}
          </div>
          <div className={isDisplayForm===true ?"col-xs-8 col-sm-8 col-md-8 col-lg-8":
          "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
            <button type="button" 
            className="btn btn-primary"
            onClick={this.onToggeForm}>
              <span className="fa fa-plus-circle mr-5"></span>Thêm Công Việc
            </button>
            {/* Search */}            
             <Control 
               onSearch={this.onSearch}
               onSort={this.onSort}
               sortBy={sortBy}
               sortValue={sortValue}
             />           
            <div className="row mt-15">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                 <TaskList 
                 onFilter={this.onFilter}
                 tasks={tasks} 
                 onUpdateStatus={this.onUpdateStatus}
                 onDelete={this.onDelete}
                 onUpdate={this.onUpdate}
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
