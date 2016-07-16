/* @flow */
import {isEqual, uniqueId} from "lodash";
import React, {PropTypes, Component} from "react";
import {View} from "react-native";
import invariant from "invariant";

import Navigator from "./navigator";

export default class Router extends Component {
  static propTypes = {
    // Routes
    children: PropTypes.node.isRequired,

    // Router state
    routerState: PropTypes.object.isRequired,

    // Style for containing view
    style: View.propTypes.style,

    // When the router is ready to render a specific scene,
    // it will use this function to create the elements.
    createElement: PropTypes.func,

    // When the router is ready to render a stack of scenes,
    // it will use this function.
    render: PropTypes.func,

    // Focus callbacks
    onWillFocus: PropTypes.func,
    oDidFocus: PropTypes.func,
  };

  static defaultProps = {
    style: {flex: 1},
  };

  constructor(props) {
    super(props);

    this._handleWillFocus = this._handleWillFocus.bind(this);
    this._handleDidFocus = this._handleDidFocus.bind(this);

    // The route stack here has nothing to do with the
    // route stack in the router state
    // This route stack represents the transitional state of the
    // onEnter and onLeave callbacks
    // TODO: A better name?
    this._routeStack = [];

    // Traverse the routes
    // NOTE: routes cannot change after construction
    this._routes = {};
    this._traverseRoutes(React.Children.toArray(props.children));

    // Cache list of parents for each route; useful in determining
    // onEnter and onLeave
    this._routeParents = {};
    for (let routeId of Object.keys(this._routes)) {
      this._routeParents[routeId] = [];

      let parentId = this._routes[routeId].parent;
      while (parentId != null) {
        this._routeParents[routeId].push(parentId);
        parentId = this._routes[parentId].parent;
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    if (!this.props.routerState || this.props.routerState.index == null) {
      return null;
    }

    return (
      <Navigator
        navigationState={this.props.routerState}
        render={this.props.render}
        routes={this._routes}
        style={this.props.style}
        onDidFocus={this._handleDidFocus}
        onWillFocus={this._handleWillFocus}
      />
    );
  }

  _traverseRoutes(routes, parent) {
    for (let route of routes) {
      invariant(!!route.props.component ^ !!route.props.children,
        "A route may either have a component or have children",
      );

      const id = uniqueId();
      this._routes[id] = {id, parent, ...route.props};

      if (route.props.children) {
        this._traverseRoutes(
          React.Children.toArray(route.props.children), id);
      }
    }
  }

  _handleDidFocus(route, component) {
    if (this.props.onDidFocus) {
      this.props.onDidFocus(route);
    }

    if (component.routerDidFocus) {
      component.routerDidFocus();
    }
  }

  _handleWillFocus(nextRoute) {
    let currentRoute;
    if (this._routeStack.length > 0) {
      currentRoute = this._routes[
        this._routeStack[this._routeStack.length - 1]];
    }

    const nextRouteParents = this._routeParents[nextRoute.id];

    // Example ::
    // routeStack: [1, 2, 3, 4, 6]
    // parents: [3, 5]
    //
    // 1 - pop  6, 4
    // 2 - push 5
    // 3 - push <nextRoute>.id

    // Compare the route stack to the list of parents
    // We're trying to find the index in which we diverge
    let routeStackIndex = -1;
    let dIndex;
    for (dIndex = nextRouteParents.length - 1; dIndex >= 0; dIndex--) {
      if (routeStackIndex == null) {
        const routeStackIdx = this._routeStack.indexOf(
          nextRouteParents[dIndex]);

        if (routeStackIdx < 0) {
          // Drop the tables (whole stack needs to be flushed)
          break;
        }

        routeStackIndex = routeStackIdx;
      } else {
        routeStackIndex += 1;
        if (this._routeStack[routeStackIndex] !== nextRouteParents[dIndex]) {
          // Here is where we diverge
          break;
        }
      }
    }

    // 1 - Iterate from the divergence index and leave all routes
    if (this._routeStack.length > 0) {
      for (let idx = routeStackIndex; idx < this._routeStack.length; idx++) {
        this._popRouteFromStack();
      }
    }

    // 2 - Iterate from the divergence index and add all parent routes
    for (; dIndex >= 0; dIndex--) {
      this._pushRouteToStack(nextRouteParents[dIndex]);
    }

    // 3 - Add to the route stack
    this._pushRouteToStack(nextRoute.id);

    if (this.props.onWillFocus) {
      this.props.onWillFocus(nextRoute, currentRoute);
    }

    // Call routerWillFocus (static) on the route component
    if (nextRoute.component && nextRoute.component.routerWillFocus) {
      nextRoute.component.routerWillFocus();
    }
  }

  _pushRouteToStack(id) {
    const route = this._routes[id];

    if (route.onEnter != null) {
      route.onEnter();
    }

    this._routeStack.push(id);
  }

  _popRouteFromStack() {
    // Execute the onLeave of outerMost route route (if available)
    const lastId = this._routeStack[this._routeStack.length - 1];
    const route = this._routes[lastId];

    if (route.onLeave != null) {
      route.onLeave();
    }

    // Pop the last route off the stack
    this._routeStack.splice(this._routeStack.length - 1, 1);
  }
}
