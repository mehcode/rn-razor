/* @flow */
import {isEqual} from "lodash";
import React, {PropTypes, Component} from "react";
import {View, NavigationExperimental} from "react-native";

import {fade} from "./transition";

const {
  Card: NavigationCard,
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

export default class Stack extends Component {
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

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
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
    )
  }

  _render(props): ReactElement {
    const {navigationState} = props;

    const scenes = props.scenes.map((scene) =>
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
    this.setState({inTransition: true})
  }

  _handleTransitionEnd(currentProps, prevProps) {
    this.setState({inTransition: false})
  }
}
