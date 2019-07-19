const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const zmq = require('zeromq');
const pako = require('pako');
const process = require('process');
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var RED = new Gpio(20, 'out'); //use GPIO pin 4, and specify that it is output
var GREEN = new Gpio(21, 'out'); //use GPIO pin 4, and specify that it is output

// Define a requester
let requester = zmq.socket('req');
requester.connect(process.argv[2] ? process.argv[2] : 'tcp://127.0.0.1:5555')

// Upon Lepton data arriving, build up a frame
requester.on('message', (data) => {
  data.swap16();
  let compressedData = Buffer.from(pako.deflate(data));
  io.volatile.emit('frame', compressedData, {for: 'everyone'});
});

  // When this user emits, client side: socket.emit('otherevent',some data);
  socket.on('iftemp',
  function(iftemp) {
    // Data comes in as whatever was sent, including objects
    console.log("Received: 'iftemp' " + iftemp.min + " " + iftemp.max);
  
    if (iftemp.max >= 40) 
    { 
      RED.writeSync(1);
      GREEN.writeSync(0);
    } 
    else 
    {
      GREEN.writeSync(1);
      RED.writeSync(0);
    }
  
    // Send it to all other clients
    socket.broadcast.emit('iftemp', iftemp);
  }
);


// Request a single frame now
setInterval(() => {
  requester.send('hello');
}, 1000/9);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/pako', express.static(__dirname + '/node_modules/pako/dist/'));

http.listen(3000);
