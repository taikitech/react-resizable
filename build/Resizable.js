'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var DraggableCore = require('react-draggable').DraggableCore;
var assign = require('object-assign');
var cloneElement = require('./cloneElement');

var Resizable = module.exports = React.createClass({
  displayName: 'Resizable',

  propTypes: {
    // Require that one and only one child be present.
    children: React.PropTypes.element.isRequired,
    // Functions
    onResizeStop: React.PropTypes.func,
    onResizeStart: React.PropTypes.func,
    onResize: React.PropTypes.func,

    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    // If you change this, be sure to update your css
    handleSize: React.PropTypes.array,
    // These will be passed wholesale to react-draggable
    draggableOpts: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      handleSize: [20, 20]
    };
  },

  getInitialState: function getInitialState() {
    return {
      bounds: this.constraintsToBounds(),
      width: this.props.width,
      height: this.props.height
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(props) {
    if (!this.state.resizing) {
      this.setState({
        width: props.width,
        height: props.height,
        bounds: this.constraintsToBounds()
      });
    }
  },

  constraintsToBounds: function constraintsToBounds() {
    var p = this.props;
    var mins = p.minConstraints || p.handleSize;
    var maxes = p.maxConstraints || [Infinity, Infinity];
    return {
      left: mins[0] - p.width,
      top: mins[1] - p.height,
      right: maxes[0] - p.width,
      bottom: maxes[1] - p.height
    };
  },

  /**
   * Wrapper around drag events to provide more useful data.
   *
   * @param  {String} handlerName Handler name to wrap.
   * @return {Function}           Handler function.
   */
  resizeHandler: function resizeHandler(handlerName) {
    var me = this;
    return function (e, _ref) {
      var node = _ref.node;
      var position = _ref.position;

      var width = me.state.width + position.deltaX,
          height = me.state.height + position.deltaY;
      me.props[handlerName] && me.props[handlerName](e, { node: node, size: { width: width, height: height } });

      if (handlerName === 'onResizeStart') {
        me.setState({ resizing: true });
      } else if (handlerName === 'onResizeStop') {
        me.setState({ resizing: false });
      } else {
        me.setState({ width: width, height: height });
      }
    };
  },

  render: function render() {
    var p = this.props,
        s = this.state;

    // What we're doing here is getting the child of this element, and cloning it with this element's props.
    // We are then defining its children as:
    // Its original children (resizable's child's children), and
    // A draggable handle.
    return cloneElement(p.children, assign({}, p, {
      children: [p.children.props.children, React.createElement(
        DraggableCore,
        _extends({}, p.draggableOpts, {
          ref: 'draggable',
          onStop: this.resizeHandler('onResizeStop'),
          onStart: this.resizeHandler('onResizeStart'),
          onDrag: this.resizeHandler('onResize'),
          bounds: this.state.bounds
        }),
        React.createElement('span', { className: 'react-resizable-handle' })
      )]
    }));
  }
});