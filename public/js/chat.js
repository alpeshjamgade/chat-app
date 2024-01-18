const socket = io();

// Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.getElementById("input");
const $messageFormButton = document.querySelector("button");
const $locationButton = document.getElementById("send-location-button");

socket.on("greet", (message) => {
    console.log(`Greetings from server: ${message}`);
})

socket.on("server-message", (message) => {
    console.log(`Received message from server: ${message}`);
})

$messageFormButton.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("clicked");
    $messageFormButton.setAttribute("disabled", "disabled");
    // disable the form
    const message = event.target.elements.message.value;
    socket.emit("client-message", message, (error) => {
        // enable
        if (error) {
            return console.log(error);
        }
        console.log("Message delivered.");
    })
})

$locationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert('Gelocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('client-location', {latitude: position.coords.latitude, longitude: position.coords.longitude}, (message) => {
            console.log(message);
        })
    })
});
