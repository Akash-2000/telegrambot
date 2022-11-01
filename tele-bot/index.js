const exec = require('child_process').exec;
const fs = require('fs');
const { resolve } = require('path');
const { promise } = require('ping');

const TelegramBot = require('node-telegram-bot-api');
const token = '5766283395:AAHJvIx8dXwkc_zv9HG-I8llruLU0nGLoJ8';
const bot = new TelegramBot(token, {polling: true});

const hosts = ["www.google.com"]
const replyFromLocale = "Reply from"

const promises = [];
var latencyValue
hosts.forEach(host=>{
    promises.push(new Promise((resolve,reject)=>{
        exec(`ping  ${host}`,(err,stdout,stderr)=>{
            let status = "offline"
            let output = stdout.toString()
        //regex 
            const reg = /Average\s=\s[0-9]+ms/gm
            average = output.match(reg)
            //
            const finalvlaue  = /Average\s=\s[0-9]+/gm
            average = output.match(finalvlaue)
            const latencyfinal = average[0].match(/[0-9]+/gm)
             latencyValue = Number(latencyfinal[0])
            let replyFromIndex = output.indexOf(replyFromLocale);
            
            if(replyFromIndex > 0 && output.substring(replyFromIndex).toUpperCase().indexOf("BYTES")>0){
                status="online"
               
            }
            resolve(new Date().toISOString()+" "+host+" "+status)
           
        })
    }
    ).then(()=>{
        if (latencyValue >= 100) {
           bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Latency is High :'+latencyValue + 'ms');
});
        } else {
             bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Latency is lower than 100 ms current latency is :'+latencyValue + 'ms');
});
        }
})
    )
})

Promise.all(promises).then((results)=>{
    fs.writeFile("ping-resuls.txt",results.join("\n"),(err)=>{
        if(err){
            console.log(err)
        }
    })

})

