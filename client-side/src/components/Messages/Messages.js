import React from "react";
import {Segment, Comment} from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import firebase from '../../Firebase.js';
import "firebase/database";
import Message from './Message';
import {connect} from 'react-redux';
import {setUserPosts} from '../../actions';

class Messages extends React.Component {
  state = {
    privateMessagesRef: firebase.database().ref('privateMessages'),
    privateChannel: this.props.isPrivateChannel,
    messages : [],
    messagesLoading : true,
    messagesRef: firebase.database().ref('messages'),
    usersRef: firebase.database().ref('users'),
    channel : this.props.currentChannel,
    user: this.props.currentUser,
    progressBar : false,
    numUniqueUsers: '',
    searchTerm : '',
    searchLoading: false,
    searchResults: [],
    isChannelsStarred: false
  }

  componentDidMount() {
    const {channel, user} = this.state;
    if( channel && user) {
      this.addListeners(channel.id);
      this.addUsersStarsListener(channel.id, user.uid);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListeners(channelId)
  }

  addMessageListeners = (channelId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false
      });
      this.countUniqueUsers(loadedMessages);
      this.countUserPosts(loadedMessages);
    })
  }

  addUsersStarsListener = (channelId, userId) => {
    this.state.usersRef.child(userId).child('starred').once('value').then(data => {
      if(data.val() !== null) {
        const channelIds = Object.keys(data.val());
        const prevsStarred = channelIds.includes(channelId);
        this.setState({ isChannelsStarred: prevsStarred})
      }
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

  countUserPosts = (messages) => {
    let userPosts = messages.reduce((acc, message) => {
      if(message.user.name in acc) {
        acc[message.user.name].count += 1
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc;
    }, {});
    this.props.setUserPosts(userPosts);
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

  displayChannelName = (channel) => {
    return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
  }
  handleSearchChange = (event) => {
    this.setState({ 
      searchTerm : event.target.value,
      searchLoading: true
    }, () => this.handleSearchMessages());
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
     setTimeout(() => this.setState({ searchLoading: false}),1000);
  }

  getMessagesRef = () => {
    const {messagesRef, privateMessagesRef, privateChannel} = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  handleStar = () => {
    this.setState(prevState => ({
      isChannelsStarred : !prevState.isChannelsStarred
    }), () => this.starChannel())
  }

  starChannel = () => {
    if(this.state.isChannelsStarred) {
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .update({
        [this.state.channel.id]: {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      })
    } else {
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .child(this.state.channel.id)
      .remove(err => {
        if(err !== null) {
          console.error(err);
        }
      })
    }
  }

  render() {
      const {messagesRef,messages, channel, user, numUniqueUsers, searchResults, searchTerm, searchLoading,privateChannel, isChannelsStarred} = this.state;
    return (
      <React.Fragment>
        <MessagesHeader
        displayChannelName={this.displayChannelName(channel)}
        numUniqueUsers={numUniqueUsers}
        handleSearchChange={this.handleSearchChange}
        searchLoading={searchLoading}
        handleStar={this.handleStar}
        isChannelsStarred={isChannelsStarred}
        />

        <Segment>
          <Comment.Group 
          className='messages'>
            { searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>  
        </Segment>

        <MessagesForm
        messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={user}
        isProgressBarVisible={this.isProgressBarVisible}
        isPrivateChannel={privateChannel}
        getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    )
  }
}

export default connect(null, {setUserPosts})(Messages);
