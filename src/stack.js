/* @flow */
import React, {PropTypes, Component} from "react";
import {View, NavigationExperimental} from "react-native";

import {floatFromBottom} from "./transition";

const {
  Card: NavigationCard,
  Transitioner: NavigationTransitioner,
} = NavigationExperimental;

export default class Stack extends Component {
  static propTypes = {
    navigationState: PropTypes.object.isRequired,
    style: View.propTypes.style,
  }

  constructor(props, context) {
    super(props, context);

    this._render = this._render.bind(this);
    this._renderScene = this._renderScene.bind(this);
  }

  render(): ReactElement {
    return (
      <NavigationTransitioner
        navigationState={this.props.navigationState}
        render={this._render}
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

    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          {scenes}
        </View>
        {/* {this.props.children} */}
      </View>
    );
  }

  _renderScene(props): ReactElement {
    return (
      <NavigationCard
        {...props}
        key={"card_" + props.scene.key}
        renderScene={this.props.renderScene}
        panHandlers={null}
        style={floatFromBottom(props)}
      />
    );
  }
}
