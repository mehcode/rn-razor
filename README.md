# React Native Router
> Router for React Native with declarative configuration similar to React Router.

 - Declarative configuration (using `<Route>` similar to react-router)
 - Idiomatic React; no imperative API or self-contained state (unlike react-router)
 - Uses `NavigatorExperimental` (soon to replace `Navigator` and `NavigatorIOS` in core React Native)

## Install

```
npm install @mehcode/rn-router --save
```

## Usage

###### Configuration

```javascript
import {Router, Route, IndexRoute} from "@mehcode/rn-router";

class Application extends React.Component {
  state = {
    routerState: null,
  };

  @autobind
  handleUpdate(nextRouterState) {
    this.setState({routerState: nextRouterState});
  }

  render() {
    <Router
      state={this.state.routerState}
      onUpdate={this.handleUpdate}
    >
      <IndexRoute component={Index} />
      <Route name="profile" component={Profile} />
      <Route name="contacts" component={ContactList} />
      <Route name="contact" component={ContactDetail} />
    </Router>
  }
}
```

###### Navigation

```javascript
import {StateUtils} from "@mehcode/rn-router";

routerState = StateUtils.push(routerState, "profile");
routerState = StateUtils.replace(routerState, "contact", {id: 10});
```
