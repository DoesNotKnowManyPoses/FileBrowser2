function showResult(element,data){
var files=data.file;
var dirs=data.dir;
var info="<ul>";
for(let i = 0 ; i < dirs.length; i++){
    info+=`<li onclick="goDeep(this)"  "deep"="${parentDiretory+dirs[i]}" style="background-color:yellow;">Dir:${dirs[i]}</li>`;
	}
for(let i = 0 ; i < files.length; i ++){
   info+=`<li style="background-color:grey;"><a href="${parentDiretory+files[i]}" target="_blank" >File: ${files[i]}</a></li>`;
}

 info+="</ul>";
 element.innerHTML=info;
}