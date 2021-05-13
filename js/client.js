const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left' || position == 'center'){ 
        audio.play();
    }
}


days = ['Mon', 'Tue', 'Wed', 'Thur', "Fri", 'Sat', 'Sun'];

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    var d = new Date();
        var n = d.getDay()
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        if (h > 12) {
            h = h - 12;
            h = addZero(h);
            Cur_time = h + ":" + m + " PM";
        }
        else {
            Cur_time = h + ":" + m + "AM";
        }
    append(`${name} joined the chat  at ${Cur_time} , ${days[n-1]} `, 'center')
   
 
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
// socket.on('left', name =>{
//     append(`${name} left the chat`, 'right')
// })

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})