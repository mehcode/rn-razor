import React, {PropTypes, Component} from "react";

export default class IndexRoute extends Component {
  static propTypes = {
    name: PropTypes.string,
    component: PropTypes.object,
  };

  render() {
    // Intended to serve as declarative configuration
    return null;
  }
}
