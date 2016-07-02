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
      { translateX: translate },
      { translateY: translate },
    ],
  };
}

export function floatFromBottom(props): Object {
  const {
    layout,
    position,
    scene,
  } = props;

  if (!layout.isMeasured) {
    return initial(props);
  }

  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];
  const height = layout.initHeight;

  const opacity = position.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });

  const translateX = 0;
  const translateY = position.interpolate({
    inputRange,
    outputRange: [height, 0, 0],
  });

  return {
    opacity,
    transform: [
      { translateX },
      { translateY },
    ],
  };
}
