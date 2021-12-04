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
    user: this.props.currentUser,
    progressBar : false,
    numUniqueUsers: ''
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
      });
      this.countUniqueUsers(loadedMessages);
    })
  }

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc,message) => {
      if(!acc.includes(message.user.name)) {
        acc.push(message.user.name)
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers});
  }
  
  displayMessages = (messages) => 
    messages.length > 0 && messages.map(message => (
      <Message
      key={message.timestamp}
      message={message}
      user={this.state.user}/>
    ))
  
  isProgressBarVisible =(percent) => {
    if( percent > 0) {
      this.setState({progressBar: true})
    }
  }

  displayChannelName = (channel) => channel ? `#${channel.name}` : '';

  render() {
      const {messagesRef,messages, channel, user, numUniqueUsers} = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
        displayChannelName={this.displayChannelName(channel)}
        numUniqueUsers={numUniqueUsers}/>

        <Segment>
          <Comment.Group 
          className='messages'>
            {this.displayMessages(messages)}
          </Comment.Group>  
        </Segment>

        <MessagesForm
        messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user}
        isProgressBarVisible={this.isProgressBarVisible}/>
      </React.Fragment>
    )
  }
}

export default Messages;
