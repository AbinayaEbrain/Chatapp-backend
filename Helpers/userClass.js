// To display 'online' for a user and To check the user is online or not
class User {
  constructor() {
    // When user connects, we push the user data into this array...
    this.globalArray = [];
  }

  enterRoom(id, name, room) {
    // const user = { id: id, name: name, room: room };
    const user = { id, name, room }; // Shorthand method if both name's are same
    this.globalArray.push(user);
    return user;
  }

  // 'id' refers to the socketId
  getUserId(id) {
    // filter() filters an array and return an filtered array
    // Get the data of the user whose id (userId.id) is equal to the 'id' which we are passing into the method
    const socketId = this.globalArray.filter(userId => userId.id === id)[0];
    return socketId;
  }

  removeUser(id) {
    const user = this.getUserId(id); // To get the object of user
    if (user) {
      // It returns all users expect the user we are passing into this method
      this.globalArray = this.globalArray.filter(userId => userId.id !== id);
    }
    return user; // It returns the removed user object
  }

  getList(room) {
    // It returns all users whose room is same as the room we are passing into this method
    const roomName = this.globalArray.filter(user => user.room === room);
    const names = roomName.map(user => user.name); // To get the name of all users
    return names;
  }
}

module.exports = { User };
