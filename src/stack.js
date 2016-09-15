/* @flow */
import {isEqual} from "lodash";
import React, {PropTypes} from "react";
import {View, NavigationExperimental} from "react-native";

import {fade} from "./transition";

const {
  Card: NavigationCard,
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

export default class Stack extends React.PureComponent {
  static propTypes = {
    navigationState: PropTypes.object.isRequired,
    style: View.propTypes.style,
    render: PropTypes.func,
  };

  state = {
    inTransition: false,
  };

  constructor(props, context) {
    super(props, context);

    this._render = this._render.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._handleTransitionStart = this._handleTransitionStart.bind(this);
    this._handleTransitionEnd = this._handleTransitionEnd.bind(this);
  }

  render(): ReactElement {
    return (
      <NavigationTransitioner
        navigationState={this.props.navigationState}
        render={this._render}
        onTransitionEnd={this._handleTransitionEnd}
        onTransitionStart={this._handleTransitionStart}
        style={this.props.style}
      />
    );
  }

  _render(props): ReactElement {
    const {navigationState} = props;

    const scenes = props.scenes.filter((scene) =>
      !scene.isStale || scene.index === this.state.prevScene
    ).map((scene) =>
      this._renderScene({
        ...props,
        scene,
      })
    );

    if (this.props.render) {
      return this.props.render(scenes);
    }

    return scenes;
  }

  _renderScene(props): ReactElement {
    return (
      <NavigationCard
        {...props}
        key={"card_" + props.scene.key}
        renderScene={this.props.renderScene}
        panHandlers={null}
        style={fade(props, this.state)}
      />
    );
  }

  _handleTransitionStart(currentProps, prevProps) {
    this.setState({inTransition: true, currentScene: currentProps.scene.index, prevScene: prevProps.scene.index});
  }

  _handleTransitionEnd(currentProps, prevProps) {
    this.setState({inTransition: false});
  }
}
