module.exports = function(io) {

var connections = {};


io.sockets.on('connection', function (socket) {
  connections[socket.id]  = {socket:socket};
  console.log('a user connected');

  socket.on('join', function (data) {
    connections[socket.id].id = data.roomid;

     Object.keys(connections).forEach(function(key,index) {
     if(connections[key].id)
        io.sockets.emit('online',{id:connections[key].id});
});


    socket.join(data.roomid); // We are using room of socket io

  });


  socket.on('new', function (newmsg) {
    socket.broadcast.to(newmsg.id).emit('new_msg', {msg: newmsg.data,name:newmsg.name,receiver_id:newmsg.id,sender_id:newmsg.sender_id}); // We are using room of socket io
  });

socket.on('s_user',function(data){
   socket.broadcast.to(data.id).emit('t_user', {row: data.row,col: data.col,name:data.name}); // We are using room of socket io
 });

   socket.on('disconnect', function() {
    //
     Object.keys(connections).forEach(function(key,index) {
      // console.log(socket.id);
      //  console.log(connections[key].socket.id);
      if(connections[key].socket.id == socket.id){

        io.sockets.emit('offline',{data:connections[key].email});
      }

     });
  //
   delete connections[socket.id];
    console.log('disconnect');
            });


  //  socket.on('chat message', function(msg){
  //   io.emit('chat message', msg);
  // });
});
}
