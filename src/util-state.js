/* @flow */
import {
  NavigationExperimental,
} from 'react-native';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

export function create() {
  // NOTE: Should this do anything else?
  return {};
}

export function push(state: object, name: string, params: ?object): object {
  return NavigationStateUtils.push(state, {
    key: "route-" + state.routes.length,
    name: name,
    params: params || {},
  });
}
