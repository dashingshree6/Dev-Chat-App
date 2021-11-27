import "../styles.css";
import { Grid } from "semantic-ui-react";
import SidePanel from "./SidePanel/SidePanel";
import ColorPanel from "./ColorPanel/ColorPanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

export default function App() {
  return (
    <div>
      <Grid columns="equal" className="app" style={{ background: "#eee" }}>
        <ColorPanel />
        <SidePanel />
        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages />
        </Grid.Column>
        <Grid.Column width={4}>
          <MetaPanel />
        </Grid.Column>
      </Grid>
    </div>
  );
}
