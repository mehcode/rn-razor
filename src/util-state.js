/* @flow */
import {isEqual} from "lodash";
import {
  NavigationExperimental,
} from 'react-native';

const {
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

export function create(options = {}) {
  let result = {
    routes: [],
  };

  if (options.initialRoute) {
    result = push(result, options.initialRoute);
    result.index = 0;
  }

  return result;
}

export function push(state: object, name: string, params: ?object): object {
  return NavigationStateUtils.push(state, {
    key: "route-" + state.routes.length,
    name: name,
    params: params || {},
  });
}

export function pop(state: object): object {
  return NavigationStateUtils.pop(state);
}

/**
 * Push a new route on the stack UNLESS the route was previously rendered in which
 * case it jumps to the existing rendered route.
 */
export function jumpTo(state: object, name: string, params: ?object): object {
  let key;
  if (state.routes.length > 0) {
    for (let i = state.routes.length - 1; i >= 0; i--) {
      const route = state.routes[i];
      if (route.name === name && isEqual(route.params, params || {})) {
        key = route.key;
        break;
      }
    }
  }

  if (!key) {
    return push(state, name, params);
  }

  return NavigationStateUtils.jumpTo(state, key);
}

/**
 * Reset the route stack to the new route.
 */
export function resetTo(state: object, name: string, params: ?object): object {
  return push({routes: []}, name, params);
}
