import React from 'react';
import {connect} from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import {Menu, Icon} from 'semantic-ui-react';
import firebase from '../../Firebase';

class Starred extends React.Component {
    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        activeChannel: '',
        starredChannels: []
    }

    componentDidMount() {
        if(this.state.user) {
        this.addListeners(this.state.user.uid);
        }
    }

    addListeners = (userId) => {
        this.state.usersRef.child(userId).child('starred').on('child_added', snap => {
            const starredChannel = {id: snap.key, ...snap.val()};
            this.setState({
                starredChannels: [...this.state.starredChannels, starredChannel]
            });
        })
        this.state.usersRef.child(userId).child('starred').on('child_removed', snap => {
            const channelToRemove = { id: snap.key, ...snap.val()};
            const filteredChannels = this.state.starredChannels.filter(channel => {
                return channel.id !== channelToRemove.id;
            })
            this.setState({ starredChannels : filteredChannels})
        })
    }

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
     
    }

    setActiveChannel = (channel) => {
        this.setState({ activeChannel : channel.id})
    }

    displayChannels = (starredChannels) => (
        starredChannels.length > 0 && starredChannels.map(channel => (
            <Menu.Item
            key={channel.id}
            name={channel.name}
            onClick={() => this.changeChannel(channel)}
            style={{opacity : 0.8}}
            active={channel.id === this.state.activeChannel}>
              
                # {channel.name}
            </Menu.Item>
        ))
    )
    render() {
        const {starredChannels} = this.state;
        return (
            <Menu.Menu className='menu'>
                <Menu.Item>
                    <span>
                        <Icon name='star'/> STARRED
                    </span>{" "}
                    ({starredChannels.length}) <Icon name='add' onClick={this.openModal}/>
                </Menu.Item>
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        )
    }
}

export default connect(null,{setCurrentChannel, setPrivateChannel})(Starred);