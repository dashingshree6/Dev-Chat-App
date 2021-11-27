import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";

class Spinner extends React.Component {
  render() {
    return (
      <Dimmer active>
        <Loader size="huge" content={"Wait a moment....."} />
      </Dimmer>
    );
  }
}
export default Spinner;
