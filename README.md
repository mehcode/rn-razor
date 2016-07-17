# (React Native) Razor
> Router for React Native with declarative configuration similar to React Router.

 - Declarative configuration (using `<Route>` similar to react-router)
 - Idiomatic React; no imperative API or self-contained state (unlike react-router)
 - Uses `NavigatorExperimental` (soon to replace `Navigator` and `NavigatorIOS` in core React Native)

## Install

```
npm install rn-razor --save
```

## Usage

##### Configuration

```javascript
import {Router, Route, StateUtils} from "rn-razor";

class Application extends React.Component {
  state = {
    routerState: StateUtils.create({initialRoute: "index"}),
  };

  render() {
    <Router routerState={this.state.routerState}>
      <Route name="index" component={Index} />
      <Route name="profile" component={Profile} />
      <Route name="contacts" component={ContactList} />
      <Route name="contact" component={ContactDetail} />
    </Router>
  }
}
```

##### Navigation

```javascript
import {StateUtils} from "rn-razor";

routerState = StateUtils.push(routerState, "profile");
routerState = StateUtils.pop(routerState);
routerState = StateUtils.jumpTo(routerState, "contact", {id: 10});
routerState = StateUtils.resetTo(routerState, "contact", {id: 10});
```

## Reference

### `<Router>`

###### `routerState`

The current state of navigation.

Can be initialized to an initial route with `StateUtils.create({initialRoute: "..."})`.

####### Example

```
{
  index: 1,
  routes: [
    { name: "index" },
    { name: "contact-detail", params: { id: 3 } },    
  ]
}
```

###### `children`

A collection of `<Route>` components providing the declarative configuration.

###### `onWillFocus`

Called when a route is about to be rendered or "focused" (name comes from react-native). This is called after the route's `onEnter` (if present).

###### `onDidFocus`

Called when a route has been rendered or "focused". This is called after the route component's `componentDidMount` (tip: good place to hide a splash screen from [rn-splash-screen](https://github.com/mehcode/rn-splash-screen)).

###### `createElement`

When the router is ready to render a specific scene, it will use this function to create the elements.

####### Default

```js
function createElement(Component, props) {
  return <Component {...props} />
}
```

###### `render`

When the router is ready to render the scene stack, it will use this function.

Use this callback to add persistent views around the scene stack. Perhaps a navigation drawer or wrap `scenes` in `KeyboardAvoidingView` from react-native.

####### Default

```js
function render(scenes) {
  return scenes;
}
```

### `<Route>`

###### `name`

The route key to use as a unique index during navigation.

###### `component`

The component to be rendered for the route.

###### `onEnter`

Called when a route is about to be entered.

###### `onLeave`

Called when a route is about to be exited. Called before the next route's `onEnter`.

###### `children`

A collection of `<Route>` components that are treated as a group, invoking their parent's `onEnter` and `onLeave` as a group. 

For instance, a group of routes can be given a single `onLeave` or `onEnter` that is called when the router is no longer in the group or when entering the group for the first time.

Note that a `<Route>` cannot have both a `component` and `children` as component nesting is not currently supported.
