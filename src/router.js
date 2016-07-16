/* @flow */
import React, {PropTypes, Component} from "react";
import {NavigationExperimental, View} from "react-native";

import Navigator from "./navigator";

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

function routesToMap(routes) {
  const result = {};

  for (let route of routes) {
    result[route.props.name] = route;
  }

  return result;
}

export default class Router extends Component {
  static propTypes = {
    // Routes
    children: PropTypes.node.isRequired,

    // Router state
    routerState: PropTypes.object.isRequired,

    // Style for containing view
    style: View.propTypes.style,

    // When the router is ready to render a stack of scenes,
    // it will use this function.
    render: PropTypes.func,

    // Callback when router state is updated
    onUpdate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {flex: 1},
  };

  componentWillMount() {
    // If we didn't receive an initial router state
    // initialize with the first route
    let children = React.Children.toArray(this.props.children);

    if (!this.props.routerState || this.props.routerState.index == null) {
      this.props.onUpdate({
        index: 0,
        routes: [
          {
            key: "0",
            name: children[0].props.name,
          },
        ],
      });
    }
  }

  render() {
    if (!this.props.routerState || this.props.routerState.index == null) {
      return null;
    }

    return (
      <Navigator
        routes={routesToMap(React.Children.toArray(this.props.children))}
        navigationState={this.props.routerState}
        style={this.props.style}
        render={this.props.render}
      />
    );
  }
}
