function showResult(element,data){
var files=data.file;
var dirs=data.dir;
var info="<ul>";
for(let i = 0 ; i < dirs.length; i++){
    info+=`<li onclick="goDeep(this)"  "deep"="${parentDiretory+dirs[i]}" class="wholeDir"><span class="dir">Dir:</span>${dirs[i]}</li>`;
	}
for(let i = 0 ; i < files.length; i ++){
   info+=`<li style="background-color:grey;" class="wholeFile"><a href="${parentDiretory+files[i]}" target="_blank" ><span class="file">File: </span>${files[i]}</a></li>`;
   console.log("parent value is "+parentDiretory+" current directory is"+files[i]);
}

 info+="</ul>";
 element.innerHTML=info;
}