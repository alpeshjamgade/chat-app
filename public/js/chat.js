const socket = io();

socket.on("countUpdated", (message) => {
    console.log(`The count has been updated!. Current Count = ${message}`);
})

document.querySelector("#increment").addEventListener("click", () => {
    console.log("Clicked!");
    socket.emit("increment");
})