import React from 'react';
import { Header, Segment,Icon, Input} from 'semantic-ui-react';

class MessagesHeader extends React.Component {
    render() {
        return (
            <Segment clearing>
                {/*Channel Title*/}
                <Header fluid='true' as='h2' floated='left' style={{ marginBottom : 0}}>
                <span>
                    Channel
                    <Icon name='staroutline' color='black'/>
                </span>
                <Header.Subheader>2 Users</Header.Subheader>
                </Header>

                {/*Channel Search Input*/}
                <Header floated='left'>
                    <Input 
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