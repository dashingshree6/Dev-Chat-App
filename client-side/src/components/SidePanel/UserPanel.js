import React from "react";
import firebase from '../../Firebase';
import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

class UserPanel extends React.Component {
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>User</strong>
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
    return (
      <div>
        <Grid style={{ background: "#4c3c4c" }}>
          <Grid.Column>
            <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
              <Header inverted floated="left" as="h2">
                <Icon name="code" />
                DevChat
              </Header>
            </Grid.Row>

            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={<span>User</span>}
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default UserPanel;
