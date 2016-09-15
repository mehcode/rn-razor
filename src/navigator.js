/* @flow */
import {isEqual} from "lodash";
import React, {PropTypes, Component} from "react";
import {NavigationExperimental, View} from "react-native";
import invariant from "invariant";

import Stack from "./stack";

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

export default class Navigator extends React.PureComponent {
  static propTypes = {
    style: View.propTypes.style,
    render: PropTypes.func,
    navigationState: PropTypes.object.isRequired,
    createElement: PropTypes.func,
    onDidFocus: PropTypes.func,
    onWillFocus: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this._renderScene = this._renderScene.bind(this);

    this._routeComponents = {};

    // Build map of name => id
    // NOTE: routes cannot change after construction
    this._routesByName = {};
    for (const routeId of Object.keys(props.routes)) {
      const route = props.routes[routeId];
      if (route.name) {
        this._routesByName[route.name] = route.id;
      }
    }
  }

  componentWillMount() {
    this._handleWillFocus(this.props);
  }

  componentDidMount() {
    this._handleDidFocus();
  }

  componentWillUpdate(nextProps) {
    if (this._routeHasChanged(this.props, nextProps)) {
      this._handleWillFocus(nextProps, this.props);
    }
  }

  componentDidUpdate(prevProps) {
    if (this._routeHasChanged(prevProps, this.props)) {
      this._handleDidFocus();
    }
  }

  _handleWillFocus(nextProps, prevProps) {
    if (this.props.onWillFocus) {
      const route = this._findRoute(
        nextProps.navigationState.routes[
          nextProps.navigationState.index].name);

      let prevLocation;
      if (prevProps) {
        prevLocation = prevProps.navigationState.routes[
          prevProps.navigationState.index];
      }

      this.props.onWillFocus(route, prevLocation);
    }
  }

  _handleDidFocus() {
    if (this.props.onDidFocus) {
      const route = this._findRoute(
        this.props.navigationState.routes[
          this.props.navigationState.index].name);

      const component = this._routeComponents[route.id];
      this.props.onDidFocus(route, component);
    }
  }

  _routeHasChanged(prevProps, nextProps) {
    const prevState = prevProps.navigationState;
    const nextState = nextProps.navigationState;

    return (prevState.index !== nextState.index) || (!isEqual(
      prevState.routes[prevState.index],
      nextState.routes[nextState.index],
    ));
  }

  render(): ReactElement {
    return (
      <Stack
        navigationState={this.props.navigationState}
        renderScene={this._renderScene}
        style={this.props.styles}
        render={this.props.render}
      />
    );
  }

  _findRoute(name) {
    const route = this.props.routes[this._routesByName[name]];

    invariant(route != null,
      "No route found for '" + name + "'"
    );

    return route;
  }

  _renderScene(sceneProps): ReactElement {
    const route = this._findRoute(sceneProps.scene.route.name);
    const Component = route.component;

    const props = {
      params: sceneProps.scene.route.params || {},
      ref: (component) => {
        this._routeComponents[route.id] = component;
      },
    };

    if (this.props.createElement) {
      return this.props.createElement(Component, props);
    }

    return (
      <Component {...props} />
    );
  }
}
