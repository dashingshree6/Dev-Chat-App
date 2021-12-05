import "../index.css";
import { Grid } from "semantic-ui-react";
import SidePanel from "./SidePanel/SidePanel";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import {connect} from 'react-redux';
function App({currentUser,currentChannel,isPrivateChannel, userPosts}) {
  return (
    <div>
      <Grid columns="equal" className="app" style={{ background: "#eee" }}>
        <ColorPanel />
        <SidePanel 
        key={currentUser && currentUser.uid}
        currentUser={currentUser}/>
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages 
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
          isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel 
           key={currentChannel && currentChannel.id}
           userPosts={userPosts}
           isPrivateChannel={isPrivateChannel}
           currentChannel={currentChannel}
          />
        </Grid.Column>
      </Grid>
    </div>
  );
}

const mapStateToProps = (state) => ({
   currentUser : state.user.currentUser,
   currentChannel : state.channel.currentChannel,
   isPrivateChannel: state.channel.isPrivateChannel,
   userPosts: state.channel.userPosts
})

export default connect(mapStateToProps)(App);
