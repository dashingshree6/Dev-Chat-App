import React from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react';
import firebase from '../../Firebase';
import {connect} from 'react-redux';
import {setCurrentChannel} from '../../actions/index';

class Channels extends React.Component {
    state = {
        user : this.props.currentUser,
        channels : [],
        modal : false,
        channelName : '',
        channelDetails : '',
        channelsRef : firebase.database().ref('channels')
    }

    componentDidMount = () => {
        this.addListeners();
    }
    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels : loadedChannels})
            console.log(loadedChannels);
        })
    }
    openModal = () => {this.setState({modal : true})};
    closeModal = () => {this.setState({modal : false})};
    handleChange = (event) => {this.setState({[event.target.name] : event.target.value})};
    
    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user} = this.state;

        const key = channelsRef.push().key;
        const newChannel = {
            id : key,
            name : channelName,
            details : channelDetails,
            createdBy : {
                name : user.displayName,
                avatar : user.photoURL
            }
        }

        channelsRef.child(key).update(newChannel).then(() => {
            this.setState({ channelName: '', channelDetails: ''})
            this.closeModal()
            console.log('CHANNEL ADDED')
        }).catch((err) => {
            console.error(err);
        })
    }

    changeChannel = (channel) => {
        this.props.setCurrentChannel(channel)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.isFormValid(this.state)) {
            this.addChannel();
        }
    }

    isFormValid = ({ channelName, channelDetails}) => channelName && channelDetails;

    displayChannels = (channels) => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
            key={channel.id}
            name={channel.name}
            onClick={() => this.changeChannel(channel)}
            style={{opacity : 0.8}}>
                # {channel.name}
            </Menu.Item>
        ))
    )
    render() {
        const { channels, modal} = this.state;
        return (
            <React.Fragment>
            <Menu.Menu style={{ paddingBottom: '2em'}}>
                <Menu.Item>
                    <span>
                        <Icon name='exchange'/> CHANNELS
                    </span>{" "}
                    ({channels.length}) <Icon name='add' onClick={this.openModal}/>
                </Menu.Item>
                {this.displayChannels(channels)}
            </Menu.Menu>
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                        <Input fluid label='Name of channel' name='channelName' onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                        <Input fluid label='About channel' name='channelDetails' onChange={this.handleChange}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inveted onClick={this.handleSubmit}>
                       <Icon name='checkmark'/> Add
                    </Button>
                    <Button color='red' inveted onClick={this.closeModal}>
                       <Icon name='remove'/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </React.Fragment>
        )
    }
}

export default connect(null, {setCurrentChannel})(Channels);