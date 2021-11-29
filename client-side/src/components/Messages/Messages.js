import React from "react";
import {Segment, Comment} from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';

class Messages extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MessagesHeader/>

        <Segment>
          <Comment.Group className='messages'>
          </Comment.Group>  
        </Segment>

        <MessagesForm/>
      </React.Fragment>
    )
  }
}

export default Messages;
