var fs=require('fs');
const { type } = require('os');
const readline = require('readline');
function isEmpty(object) {
    for (const property in object) {
      return false;
    }
    return true;
  }

class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        return this.items.push(element);
    }
    dequeue() {
        if(this.items.length > 0) {
            return this.items.shift();
        }
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    isEmpty(){
       return this.items.length == 0;
    }
    size(){
        return this.items.length;
    }
    clear(){
        this.items = [];
    }
}
function log_formatter(obje){
            var ch="";
            let queue = new Queue();
            queue.enqueue([obje,ch]);
            while(!queue.isEmpty()){
                var fr=queue.peek();
                queue.dequeue();
                let obje=fr[0];
                let cha=fr[1];
                 
                if(isEmpty(obje)){
                    let writer = fs.createWriteStream(`${cha}.txt`, {
                        flags:'a',
                        encoding:'utf-8',
                    });
                    writer.write(""+'\n');
                     writer.end();
                } else
                for(var key in obje){
                    if(typeof obje[key]==="object"){
                        if(cha=="")
                        var p=cha+`${key}`;
                        else
                        var p=cha+"."+`${key}`;
                        queue.enqueue([obje[key],p]);
                    }
                    else{
                        if(cha=="")
                        var p=cha+`${key}`;
                        else
                        var p=cha+"."+`${key}`;
                        let writer = fs.createWriteStream(`${p}.txt`, {
                            flags:'a',
                            encoding:'utf-8',
                        });
                        writer.write(obje[key]+'\n');
                        writer.end();
                    }
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
            start=ch+1;
            var json=JSON.parse(line);
            log_formatter(json);
        }
    }
    if(chunks[chunks.length-1]!=='\n'){
        unprocess=chunks.slice(start);
        if(typeof unprocess==="object")
        {
            log_formatter(JSON.parse(unprocess));
            unprocess='';
        }
    }
});
const used = process.memoryUsage().heapUsed/1024/1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
