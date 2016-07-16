/* @flow */
import React, {PropTypes, Component} from "react";
import {NavigationExperimental, View} from "react-native";
import invariant from "invariant";

import Stack from "./stack";

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

export default class Navigator extends React.Component {
  static propTypes = {
    style: View.propTypes.style,
    render: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this._renderScene = this._renderScene.bind(this);
  }

  _renderScene(sceneProps): ReactElement {
    const {scene} = sceneProps;
    const route = this.props.routes[scene.route.name];

    invariant(route != null,
      "No route found for '" + scene.route.name + "'"
    );

    // Render route
    const Component = route.props.component;
    return (
      <Component />
    );
  }

  render(): ReactElement {
    return (
      <Stack
        navigationState={this.props.navigationState}
        renderScene={this._renderScene}
        style={this.props.styles}
        render={this.props.render}
      />
    )
  }
}
