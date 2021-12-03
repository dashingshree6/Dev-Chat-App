import React from 'react';
import { Button, Input, Segment } from 'semantic-ui-react';
import firebase from '../../Firebase';
import "firebase/storage";
import FileModal from './FileModal';
import {v4 as uuidv4} from "uuid/v4";

class MessagesForm extends React.Component {
    state = {
        storageRef : firebase.storage().ref(),
        uploadState : '',
        uploadTask : null,
        percentUploaded : 0,
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

    createMessage = (fileURL = null) => {
        const message = {
            timestamp : firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name : this.state.user.displayName,
                avatar : this.state.user.photoURL
            },
        }
        if(fileURL !== null) {
            message['image'] = fileURL;
        } else {
            message['content'] = this.state.message
        }
    }

    sendMessage = () => {
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
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filepath = `chat/public/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filepath).put(file, metadata)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.setState({ percentUploaded})
            }, err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    uploadState: 'error',
                    uploadTask: null
                })
            }, () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                    this.sendFileMessage(downloadUrl, ref, pathToUpload);
                }).catch(err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })    
                })
            })
        })
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload).push().set(this.createMessage(fileUrl)).then(() => {
            this.setState({ uploadState: 'done'})
        }).catch(err => {
            this.setState({ errors : this.state.errors.concat(err)})
        })
    }
    render() {
        const {errors, message, loading, modal, uploadState} = this.state;
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
                    disabled={uploadState === "uploading"}
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