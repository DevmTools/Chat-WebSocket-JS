//login 
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login_form");
const loginInput = login.querySelector(".login_input")

//chat
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat_form");
const chatInput = chat.querySelector(".chat_input")
const chatMessages = chat.querySelector(".chat_messages")

const colors_user = [
    "AntiqueWhite",
    "Bisque",
    "Aqua",
    "Aquamarine",
    "AliceBlue",
    "Azure",
    "Beige"
]
const user = { id: "", name: "", color: "" }
let webSocket

const createMessageSelf = (message) => {
    const div = document.createElement("div");
    div.classList.add("message-self");
    div.innerHTML = message;
    return div
}

const createMessageOther = (message, userName, userColor) => {
    const div = document.createElement("div");
    const span = document.createElement("div");

    div.classList.add("message-other");
    span.classList.add("message-sender");
    span.style.color = userColor;

    div.appendChild(span)

    span.innerHTML = userName
    div.innerHTML += message;
    return div
}

const getRandomColor = () => {
    const randonIndex = Math.floor(Math.random() * colors_user.length);
    return colors_user[randonIndex];//devolve a cor com base no randon Math gerado aleatoriamente
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = (event) => {
    const boolean = event.data.trim().startsWith('{') || event.data.trim().startsWith('[')
    switch (boolean) {
        case true:
            const { userId, userName, userColor, message } = JSON.parse(event.data) //mensagem do chat
            const selfOrOtherMessage = userId == user.id
                ? createMessageSelf(message)
                : createMessageOther(message, userName, userColor)
            chatMessages.appendChild(selfOrOtherMessage);
            scrollScreen()
            break;
        default:
            console.log(`${event.data} Usuário ${user.name.toString().toUpperCase()}`) //mensagem do servidor
            break;
    }
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none" // quando entrar, oculta a tela de login
    chat.style.display = "flex" // quando entrar, mostra a tela do chat

    webSocket = new WebSocket(`ws://localhost:${8080}`)// cria a conexao
    webSocket.onmessage = processMessage //processa mensagens vindas do servidor
}

const handleMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        message: chatInput.value
    };
    webSocket.send(JSON.stringify(message));
    chatInput.value = "";
}

loginForm.addEventListener("submit", handleLogin)//Capturando o evento do botao login
chatForm.addEventListener("submit", handleMessage)//Capturando o evento do botao mensagem