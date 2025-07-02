const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")
dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });

wss.on("connection", (ws) => {//ws é o usuario conectado
    ws.on("error", console.error)//ws.on("error", (error) => console.log("erro")) os dois são a mesma coisa esse comentado é passando explicitamente um callback

    ws.send("Conectado no Servidor:")

    ws.on("message", (data) => {
        //clients é uma interface de instancias que contem todos usuarios conectados, podemos usar para resumir a forma notificar a todos
        wss.clients.forEach((client) => client.send(data.toString()))//aqui eu envio para todos conectados

    })
})