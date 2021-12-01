import React from "react";
import {Segment, Comment} from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import firebase from '../../Firebase.js';
import "firebase/database";
import Message from './Message';

class Messages extends React.Component {
  state = {
    messages : [],
    messagesLoading : true,
    messagesRef: firebase.database().ref('messages'),
    channel : this.props.currentChannel,
    user: this.props.currentUser
  }

  componentDidMount() {
    const {channel, user} = this.state;
    if( channel && user) {
      this.addListeners(channel.id)
    }
  }

  addListeners = (channelId) => {
    this.addMessageListeners(channelId)
  }

  addMessageListeners = (channelId) => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      })
    })
  }

  displayMessages = (messages) => 
    messages.length > 0 && messages.map(message => (
      <Message
      key={message.timestamp}
      message={message}
      user={this.state.user}/>
    ))
  
  render() {
    const {messagesRef,messages, channel, user} = this.state;
    return (
      <React.Fragment>
        <MessagesHeader/>

        <Segment>
          <Comment.Group className='messages'>
            {this.displayMessages(messages)}
          </Comment.Group>  
        </Segment>

        <MessagesForm
        messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user}/>
      </React.Fragment>
    )
  }
}

export default Messages;
