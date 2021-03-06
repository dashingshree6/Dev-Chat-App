import React from 'react';
import { Header, Segment,Icon, Input} from 'semantic-ui-react';

class MessagesHeader extends React.Component {
    render() {
        const {displayChannelName, numUniqueUsers, handleSearchChange, searchLoading, isPrivateChannel, handleStar,isChannelsStarred } = this.props;
        return (
            <Segment clearing>
                {/*Channel Title*/}
                <Header fluid='true' as='h2' floated='left' style={{ marginBottom : 0}}>
                <span>
                {displayChannelName}
                {!isPrivateChannel && ( 
                <Icon 
                onClick={handleStar} 
                name={ isChannelsStarred ? 'star' : 'star outline'} 
                color={ isChannelsStarred ? 'yellow' : 'black' }
                />
                )}
                </span>
                <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/*Channel Search Input*/}
                <Header floated='left'>
                    <Input 
                    loading={searchLoading}
                    onChange={handleSearchChange}
                    size='mini'
                    icon='search'
                    name='searchTerm'
                    placeholder='Search Messages'/>
                </Header>
            </Segment>
        )
    }
}

export default MessagesHeader;