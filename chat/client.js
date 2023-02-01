const { Console } = require('console');
const {Socket} = require('net');

//libreria para leer desde consola
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
})
const END = 'END';

const error = (message) => {
    console.error(message);
    process.exit(1);
};

const connect = (host,port)=>{
    console.log(`Conectado ${host}:${port}`);
    const socket = new Socket();
    socket.connect({host, port});
    socket.setEncoding("utf-8");

    socket.on("connect",() => {
        console.log('Conectado');
        readline.question("Ingrese un nombre:",(username ) => {
            var x = Math.floor(Math.random()*10);
            socket.write(username + x);
            console.log("Tu Usuario Asignado Es:",username + x);
            // socket.write(username +  Math.floor(Math.random()*11));    
            //console.log(`Tu nombre de usuario es:${username}`);
            console.log(`Escribe cualquier mensaje,presiones ${END} PARA FINALIZAR`);
        })
        readline.on("line", (message)=> {
            socket.write(message);
            if(message ===END){
                socket.end();
                Console.log("Desconectado");
                process.exit(0)
            }
        });
        socket.on("data",(data)=>{
            console.log(data);
        });

    })

   
    socket.on("error",(err)=> error(err.message))
};

const main = () =>{
    if(process.argv.length !==4){
        error(`Usage:node ${__filename} host port`);
    }

let [,, host,port]= process.argv;
if(isNaN(port)){
    error(`Invalid port ${port}`);
}
port = Number(port);
connect(host,port)

}




if (module === require.main){
    main();

}

