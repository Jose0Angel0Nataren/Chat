
const{Server} = require("net");
const { parse } = require("path");

const host = "0.0.0.0";
const END = 'END';
//almacenar las conexiones y mapear un socket a un usuario
const connection = new Map();


const error= (message)=> {
    console.error(message);
    process.exit(1);

}
//Enviar el mensaje a todos menos al origen del mensaje
const sendMessage = (message,origin )=>{
    for(const socket of connection.keys()){
        if(socket !== origin){
            socket.write(message);
        }
    }
};

const listen = (port) =>{
    const server = new Server();
    server.on("connection",(socket)=>{
        const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
      


        console.log(`Nueva conexion con ${remoteSocket}`);
        socket.setEncoding('utf-8');//Descodificar
        
        socket.on("data",(message)=>{
            if(!connection.has(socket)){
                //mostrar nombre de usuario
                console.log(`Nombre del usuario ${message} conectado con ${remoteSocket}`);
                connection.set(socket,message);
            }
        else if(message === END){
          
            console.log(`Conexion con  ${remoteSocket} sesion cerrada`);
            connection.delete(socket);
            socket.end();
           
         }else{
            // for (const username of connection.values()){
            //     console.log(username);
            // }
            //enviar el mensaje al resto de clientes
            const fullMessage = `[${connection.get(socket)}]: ${message}`;
            console.log(`${remoteSocket} -> ${fullMessage}`);
            sendMessage(fullMessage,socket);
         }
        });

        socket.on("error",(err) => error(err.message));
    });
    server.listen({port,host},()=>{
    console.log("Corriendo en el puerto",{port});
    
    });
    server.on("error", (err) => error(err.message));



}

const main =() => {
    if(process.argv.length !== 3){
        error(`Usage: node ${__filename}port`);

    }
    let port = process.argv[2];
    if(isNaN(port)){
        error(`Invalid port ${port}`);
    }

    port = Number(port);
    listen(port);
}

if(require.main === module){
    main();
}

