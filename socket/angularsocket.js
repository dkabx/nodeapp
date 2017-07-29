module.exports = function(io) {

var connections = {};


io.sockets.on('connection', function (socket) {
  console.log("connected");
socket.on('online',(data)=>{
  console.log(data.data+ "joined");
  socket.join(data.data.toLowerCase());
})


   socket.on('disconnect', function() {
    
    console.log('disconnect');
    });


   socket.on("room-add",(data)=>{
       io.sockets.emit("res-room-add",{data:data});
   });


   socket.on("msg",(data)=>{

       io.sockets.emit("res-msg",data);
   });


    socket.on('send-req',(data)=>{
      // console.log(io.sockets.adapter.rooms);
      console.log(data);
      io.sockets.in(data.sendto).emit('res-send-req', {sender:data.sender,msg: 'send-request'});
    });
      
     socket.on('accept-req',(data)=>{
      io.sockets.in(data.acceptof).emit("res-accept-req",{acceptor:data.acceptor,acceptof:data.acceptof,msg:'accept-request'});
     })

});
}
