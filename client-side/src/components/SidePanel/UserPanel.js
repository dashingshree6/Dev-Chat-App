import React from "react";
import firebase from '../../Firebase';
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

class UserPanel extends React.Component {
  state = {
    user : this.props.currentUser
  }

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}>Sign Out</span>
    }
  ];

  handleSignout = () => {
    firebase
    .auth()
    .signOut()
    .then(() => console.log('User Signed out'))
  }
  render() {
    const {user} = this.state;
    const {primaryColor} = this.props;
   
    return (
      <div>
        <Grid style={{ background: primaryColor }}>
          <Grid.Column>
            <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
              <Header inverted floated="left" as="h2">
                <Icon name="code" />
                DevChat
              </Header>
              <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                <span>
                  <Image src={user.photoURL} spaced='right'  avatar />
                  {this.state.user.displayName}
                  </span>}
                options={this.dropdownOptions()}
              />
            </Header>
            
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}


export default UserPanel;
