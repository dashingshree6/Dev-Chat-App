import React from 'react';
import { Button, Input, Segment } from 'semantic-ui-react';
import firebase from '../../Firebase';
import FileModal from './FileModal';

class MessagesForm extends React.Component {
    state = {
        message: '',
        loading: false,
        channel : this.props.currentChannel,
        user : this.props.currentUser,
        errors : [],
        modal : false
    }

    openModal = () => {
        this.setState({ modal: true})
    }

    closeModal = () => {
        this.setState({ modal: false})
    }
    handleChange = (event) => {
        this.setState({ [event.target.name] : event.target.value})
    }

    createMessage = () => {
        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            content: this.state.message,
            user: {
                id: this.state.user.uid,
                name : this.state.user.displayName,
                avatar : this.state.user.photoURL
            },
        }
        return message;
    }

    sendMessage = event => {
        const {messagesRef} = this.props;
        const {message, channel} = this.state;

        if(message) {
            this.setState({ loading: true});
            messagesRef.child(channel.id).push().set(this.createMessage()).then(() => {
                this.setState({ loading: false, message: '', errors: []})
            }).catch((err) => {
                console.error(err);
                this.setState({
                    loading: false,
                    errors: this.state.errors.concat(err)
                })
            })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message'})
            })
        }
    }

    uploadFile = (file, metadata) => {
        
    }
    render() {
        const {errors, message, loading, modal} = this.state;
        return (
            <Segment className="message__form">
                <Input
                fluid
                onChange={this.handleChange}
                name='message'
                style={{ marginBottom : '0.7em'}}
                label={<Button icon={'add'}/>}
                value={message}
                labelPosition='left'
                className={
                    errors.some(error => error.message.includes('message')) ? 'error' : ''
                }
                placeholder='Write your message'/>

                <Button.Group icon widths='2'>
                    <Button 
                    color='orange'
                    disabled={loading}
                    onClick={this.sendMessage}
                    content='Add Reply'
                    labelPosition='left'
                    icon='edit'/>
                    <Button
                    color='teal'
                    onClick={this.openModal}
                    content='Upload media'
                    labelPosition='right'
                    icon='cloud upload'/>
                </Button.Group>
                <FileModal
                uploadFile={this.uploadFile}
                modal={modal}
                closeModal={this.closeModal}/>
            </Segment>
        )
    }
}

export default MessagesForm;