
var parentDiretory="/list/";  //store the last access point;
var prefix="/list";    //s
var currentDir=null;  //the value is shown in the "current path", indicating the current directory of the files listed.
var preDir=[];      //store the pathes that have been browsed.
var nextDir=[];       //store the pathes that have been stepped back.
var dataFile={};
window.onload=function(){  //get the files in the root directory.
console.log("heheh");
jQueryGetFileList("");
dataFile.dirList=["1","2","3","4"];
dataFile.fileList=["5","6","7","8"];
dataFile.query="";
Vue.filter("fullPath",function(value){
     return parentDiretory+value;
});
Vue.directive("deep",{
 bind:function(){

 },
 update:function(newValue,oldValue){

 },
 unbind:function(){

 }
});

var vue = new Vue({
   el:"#vueContent",
   data:dataFile,
   methods:{
     goDeep:function(path){
       console.log("hahah path is "+ path);
       path=parentDiretory.slice(5)+path;
       if(currentDir!=null){             //seems that this value will not be null.
        preDir.push(currentDir)
        activeBack(true);
        ;
       } 
       jQueryGetFileList(path);
     },
     nameFilter:function(list,key){
       return list.filter(function(curVal, indx, arr){
                return curVal.indexOf(key)!=-1;
       })
     }
   }
});
}

/*
this event handler is added to Directories.
when this <li> has been clicked, it will require further information from host and show the files list beneath this directory.
*/
function goDeep(element){  
var outHtml=element.outerHTML;            //I add an attribute "deep"=relative path in the element <li> and I need to get the value so that I know which URL I can use to ask host for information.
var outHtmlArr=outHtml.split('"');  //it is the sixth element if split by '"', so the attribute location influences the result.      
console.log("outhtml is "+outHtml);
var targetUrl=outHtmlArr[5];
 if(currentDir!=null){             //seems that this value will not be null.
 preDir.push(currentDir)
 activeBack(true);
 ;
}   //go to next directory so store the current value into a stack.
jQueryGetFileList(targetUrl.substr(5));
}
function activeBack(yes){
  var button = document.getElementById("back");
     button.disabled=!yes;
  
}
/*
back to the last directories which have been browsed.
*/
function back(){                 
var dirInPre=preDir.pop();  //if there is, then pop(last in, first out).
if(preDir.length<=0) activeBack(false);
nextDir.push(currentDir);   //used to do the "forward" .
activeForward(true);
jQueryGetFileList(dirInPre);
}

function activeForward(yes){
  var button= document.getElementById("forward");
    button.disabled=!yes;
}

function forward(){
if(nextDir.length<=0){
alert("no forward possible");
return;
}
var dirInNext=nextDir.pop();
if(nextDir.length<=0) activeForward(false);
preDir.push(currentDir);
activeBack(true);
jQueryGetFileList(dirInNext);
}

/*
get the files beneath the given path.
*/
function jQueryGetFileList(currentPath){
  console.log("jquery caught");
  var dir=prefix+currentPath;
  $.get(dir,function(data, status){
    var content = document.getElementById("content");
    var result=data;
    parentDiretory=dir+"/";
    result=JSON.parse(result);
    showResult(content,result);
    showDirectory(currentPath);
    currentDir=currentPath=="" ? "/" : currentPath;
  });
}
/*
refresh the content of the current directory, mainly after the upload.
*/
function refreshLater(){
console.log("refresh triggered");
getFileList(currentDir);
document.getElementById("uploadFrom").reset();
document.getElementById("statusFrame").src="";
}
/*
display the file list in the defined element.
*/
function showResult(element,data){
var files=data.file; dataFile.fileList=files;
var dirs=data.dir;  dataFile.dirList=dirs;
// var info="<ul class='list-unstyled'>";
// for(let i = 0 ; i < dirs.length; i++){ //use the new feature as it is easy to build the element and use "deep" to record the path of the file at server side.
//     info+=`<li onclick="goDeep(this)"  "deep"="${parentDiretory+dirs[i]}" data-deep="${parentDiretory+dirs[i]}" class="list-group-item list-group-item-success"><img class="folderPicture" src="ssfolder.jpg" />${dirs[i]}</li>`; 
// 	}
	
// for(let i = 0 ; i < files.length; i ++){  
//    info+=`<li  class="list-group-item list-group-item-info"><a href="${parentDiretory+files[i]}" target="_blank" >${files[i]}</a></li>`;
//    console.log("parent value is "+parentDiretory+" current directory is"+files[i]);
// }

//  info+="</ul>";
//  element.innerHTML=info;
}
function showDirectory(path){
  var pathArr=path.slice(1).split("/");
  var result="当前目录为:/";
  for(var i = 0 ; i < pathArr.length; i ++){
    if(pathArr[i]=="") continue;
    result=result+pathArr[i]+" > ";
  }
  var directory=document.getElementById("directory");
  directory.value=result;
}

/*
initialize the http obejct. replaced by the $.get 
*/
// function initializeHttp(){
//  if(xmlhttp!=null)
//  return xmlhttp;
// if (window.XMLHttpRequest)
//   {// code for IE7+, Firefox, Chrome, Opera, Safari
//   xmlhttp=new XMLHttpRequest();
//   }
// else
//   {// code for IE6, IE5
//   xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
//   }
//   return xmlhttp;
// }
/*
use ajax to get the files list of root directory;
replaced by jQueryGetFileList()
*/
// function fileList(){

// var xmlhttp=initializeHttp(); 
// xmlhttp.open("GET","/list",true);
// parentDiretory="/list/";
// xmlhttp.send();
// xmlhttp.onreadystatechange=function(){
// console.log("triggered ready state is "+xmlhttp.readyState+" "+xmlhttp.status);
// console.log(xmlhttp.responseText);
// if(xmlhttp.readyState==4&&xmlhttp.status==200){
// var content = document.getElementById("content");
// var result=xmlhttp.responseText;
// result=JSON.parse(result);   //parse the responseText into JSON object. 
// showResult(content,result);  //list the DIR and files in <ul> <li>..</li></ul> and add event/style to the elements.
// currentDir="/";              //set the root directory to the value shown in the HTML(the initial value has been set the element <input>), so no need to upate the value this time.
// showDirectory(currentDir);   //show the path in defined way. 
// }

// };

// }

