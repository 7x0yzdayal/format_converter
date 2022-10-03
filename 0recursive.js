var fs=require('fs');
var json = [];
function isEmpty(object) {
    for (const property in object) {
      return false;
    }
    return true;
  }
  function check(obj,ch){
    if(isEmpty(obj)){
        let writer = fs.createWriteStream(`${ch}.txt`, {
            flags:'a',
            encoding:'utf-8',
        });
        writer.write(""+'\n');
         writer.end();
         return;
    }
    for(var key in obj){
        if(typeof obj[key]==="object"){
            if(ch=="")
            var p=ch+`${key}`;
            else
            var p=ch+"."+`${key}`;
            check(obj[key],p);
        }
        else{
            if(ch=="")
            var p=ch+`${key}`;
            else
            var p=ch+"."+`${key}`;
            let writer = fs.createWriteStream(`${p}.txt`, {
                flags:'a',
                encoding:'utf-8',
            });
            writer.write(obj[key]+'\n');
            writer.end();
        }
    }
}
const reads=fs.createReadStream('dummy.log');
let unprocess='';
reads.on('data',(chunk)=>{
    let chunks=unprocess+chunk.toString();
    unprocess='';
    let start=0;
    for(let ch=start;ch<chunks.length;ch++){
        if(chunks[ch]==='\n'){
            const line=chunks.slice(start,ch);
            let che="";
            var json=JSON.parse(line);
            start=ch+1;
            check(json,che);
        }
    }
    if(chunks[chunks.length-1]!=='\n'){
        unprocess=chunks.slice(start);
        if(typeof unprocess==="object")
        {
            let che="";
            var json=JSON.parse(unprocess);
             check(json,che);
             unprocess='';
        }
    }
});
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
