module.exports = function(io) {
  //   const userData = new User();
  io.on('connection', socket => {
    socket.on('join chat', params => {
      //listen the event from 'message component' ....refer socket.io cheatsheet
      socket.join(params.room1); // To join the room in 'message component'
      socket.join(params.room2);
    });

    socket.on('starts_typing', data => {
      // Emit the event only to receiver and it will be called in 'message.component.ts'
      io.to(data.receiver).emit('is_typing', data);
    });

    socket.on('stop_typing', data => {
        // Emit the event only to receiver and it will be called in 'message.component.ts'
        io.to(data.receiver).emit('stopped_typing', data);
      });

  });
};
