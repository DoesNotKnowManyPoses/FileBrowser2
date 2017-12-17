var express=require("express");
var app=express();
var path=require("path");
var fs=require("fs");
var url=require("url");
var currentPath=__dirname;
app.use(express.static(require('path').join(__dirname, 'public')));
app.set('views',__dirname);
app.set('view engine','html');
app.engine('.html',require('ejs').__express);
app.get("/",function(req,res){
	res.render("Index");
});
app.get("/list",function(req,res){
	console.log("received some request");
    getFileStructure(__dirname,res);
});
app.get("/index",function(req,res){
	res.render("Index");
});
app.get("/list/*",function(req,res){
	var urlstring=url.parse(req.url,true);
	console.log(urlstring.pathname);
	filePath=decodeURI(path.join(__dirname,urlstring.pathname.substring(5)));
	console.log("receive path is "+filePath+" path after decode"+decodeURI(filePath));
	var stat=fs.statSync(filePath);
	if(stat.isFile()){
		console.log(filePath+" is a file");
		fs.readFile(filePath,function(err,data){
			if(err){
				console.log(err);
			}
			else{
				console.log("have sent the file");
				res.write(data.toString());
				res.end();//without end this will not show in target page.
			}
		});
	}
	else{
		
		getFileStructure(filePath,res);
	}
});
app.post("/hehe",function(req,res){
	var imgsays = [];
var num = 0;
var isStart = false;
var ws;
var filename;
var filePath;
req.on('data' , function(chunk){
    var start = 0;
    var end = chunk.length;
    var rems = [];

    for(var i=0;i<chunk.length;i++){
        if(chunk[i]==13 && chunk[i+1]==10){ //ascii code. 13 means/ enter 10 means new line.
            num++;
            rems.push(i);                   //store all the \r\n

            if(num==4){                    //the first 4 lines are the header, storing the file name and format.
                start = i+2;               //start from the character after \n
                        //has got file name, can write.

                var str = (new Buffer(imgsays)).toString();
				console.log("chunk is "+chunk.toString());
                filename = str.match(/filename=".*"/g)[0].split('"')[1];  //get file name.
				if(filename!="") {isStart = true; console.log("hehe file name is"+filename+"blank");}
                else {return;}; //no filename, return;				
				
                filePath = path.join(currentPath,filename);
				console.log("target file is "+filePath);
                ws = fs.createWriteStream(filePath);

            }else if(i==chunk.length-2){    //
                end = rems[rems.length-2];
                break;
            }
        }

        if(num<4){
            imgsays.push(chunk[i])
        }
    }

    if(isStart){
        ws.write(chunk.slice(start , end));
    }
});

req.on("end",function(){
    if(ws) ws.end();
	console.log("start? "+isStart);
	if(isStart){
	res.write("upload succeeded");
	}
	else{
		res.write("Upload failed");
	}
	  res.end();
});
});
app.listen(8084);    

function getFileStructure(filePath, res){
			var result={};
			var checkedDirs=[];
			var checkedFiles=[];
		console.log("path is "+filePath);
		currentPath=filePath;
	fs.readdir(filePath,function(err,files){
		if(err){
			console.log("no such directory "+err);
		}
		else{
		    files.forEach(function(file){
				console.log("file name "+path.join(filePath,file));
				var stat=fs.statSync(path.join(filePath,file)); // no path information.
				
				if(stat.isFile()){
					checkedFiles.push(file);
				}
				else{
					checkedDirs.push(file);
				}
			});
			result.dir=checkedDirs;
			result.file=checkedFiles;
			result=JSON.stringify(result);
			console.log(result);
			res.send(result);
			res.end();
		}
	});
}



