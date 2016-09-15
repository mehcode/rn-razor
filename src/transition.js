/* @flow */

function initial(props): Object {
  const {
    navigationState,
    scene,
  } = props;

  const focused = navigationState.index === scene.index;
  const opacity = focused ? 1 : 0;

  // If not focused, move the scene to the far away.
  const translate = focused ? 0 : 1000000;
  return {
    opacity,
    transform: [
      {translateX: translate},
      {translateY: translate},
    ],
  };
}

export function fade(props, state): Object {
  const {
    layout,
    position,
    progress,
    navigationState,
    scene,
  } = props;

  const {
    inTransition,
  } = state;

  if (!layout.isMeasured) {
    return initial(props);
  }

  const focused = navigationState.index === scene.index;

  const transform = [];
  const opacity = position.interpolate({
    inputRange: [scene.index - 1, scene.index, scene.index + 1],
    outputRange: [0, 1, 0],
  });

  if (!(focused || inTransition)) {
    transform.push({translateY: 1000000, translateX: 1000000});
  }

  return {
    opacity,
    transform,
  };
}
