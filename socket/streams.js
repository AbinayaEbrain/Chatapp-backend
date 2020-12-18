module.exports = function(io, User, _) {
  const userData = new User(); // Create a instance for User class
  io.on('connection', socket => {
    //Listening to the connection event by calling on method
    socket.on('refresh', data => {
      //listen the event from 'post-form component' ....refer socket.io cheatsheet
      io.emit('refreshPage', {}); //emit 'refreshPage' event and goes to 'posts.component.ts'
    });

    socket.on('online', data => {
      socket.join(data.room); // join the room
      userData.enterRoom(socket.id, data.user, data.room);
      const list = userData.getList(data.room);
      io.emit('usersOnline', _.uniq(list)); // 'uniq' removes duplicate values from array
    });

    // 'disconnect' event is applicable in socket.io itself
    socket.on('disconnect', () => {
      const user = userData.removeUser(socket.id);
      if (user) {
        const userArray = userData.getList(user.room);
        const arr = _.uniq(userArray);
        _.remove(arr, n => n === user.name); // To remove user from array
        io.emit('usersOnline', arr);
      }
    });
  });
};
