// adding new chat documents
// setting up a real-time listener to get new chats
// updating the username
// updating the room

/*
we will create a class chatRoom:

- define async function to add chat message, so any message(object) we send it will include:
the message text, username, which room created in, the time. then add this object to the db.
-we return repsonse at the end ( because we are using async await, so we need to return a response)
-this response we might not use it later on.


- so in conclusion we are taking a message, we get teh date when it was added, we are making a chat object
 with all the properties then we wait for the chat to be added to the db then returning the response.
*/

class Chatroom{
    constructor(room, username){
    this.username = username;
    this.room = room;
    this.chats = db.collection('chats')
    this.unsub;
}

async addChat(message){
    // format a chat object
    const now = new Date();
    const chat = {
        message : message,
        username :this.username,
        room: this.room,
        created_at : firebase.firestore.Timestamp.fromDate(now)
    };

    // save the chat document:
    /* we add the chat object we created above to the db */
    const response = await this.chats.add(chat);
    return response
    }

    getChats(callback){
        this.unsub = this.chats
          .where('room', '==', this.room)
          .orderBy('created_at')
          .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
              if(change.type === 'added'){
                callback(change.doc.data());
              }
            });
        });
      }

      updateName(username){
        this.username = username;
        localStorage.setItem('username', username)
      }

      updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
          this.unsub();
        }
      }
    }
    
// const chatroom = new Chatroom('gaming', 'ziad');
// console.log(chatroom)

// // chatroom.addChat('hello everyone')
// //     .then(()=>console.log('chat added'))
// //     .catch((err=>console.log(err)))

// chatroom.getChats((data)=>{
//     console.log(data)
// })

// setTimeout(() => {
//     chatroom.updateRoom('general');
//     chatroom.updateName('yoshi');
//     chatroom.getChats(data => console.log(data));
//     chatroom.addChat('hello');
//   }, 3000);