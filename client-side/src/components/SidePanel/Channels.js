import React from 'react';
import {Menu, Icon, Modal, Form, Input, Button} from 'semantic-ui-react';

class Channels extends React.Component {
    state = {
        channels : [],
        modal : false
    }

    openModal = () => {this.setState({modal : true})};
    closeModal = () => {this.setState({modal : false})};
    handleChange = (event) => {this.setState({[event.target.name] : event.target.value})};

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
            </Menu.Menu>
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a channel</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                        <Input fluid label='Name of channel' name='channelName' onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field>
                        <Input fluid label='About channel' name='channelDetails' onChange={this.handleChange}/>
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inveted>
                       <Icon name='checkmark'/> Add
                    </Button>
                    <Button color='green' inveted onClick={this.closeModal}>
                       <Icon name='remove'/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
            </React.Fragment>
        )
    }
}

export default Channels;