'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var PropTypes = React.PropTypes;
var Resizable = require('./Resizable');

// An example use of Resizable.

var ResizableBox = module.exports = React.createClass({
  displayName: 'ResizableBox',

  propTypes: {
    lockAspectRatio: PropTypes.bool,
    minConstraints: PropTypes.arrayOf(PropTypes.number),
    maxConstraints: PropTypes.arrayOf(PropTypes.number),
    height: PropTypes.number,
    width: PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      lockAspectRatio: false,
      handleSize: [20, 20]
    };
  },

  getInitialState: function getInitialState() {
    return {
      width: this.props.width,
      height: this.props.height,
      aspectRatio: this.props.width / this.props.height
    };
  },

  onResize: function onResize(event, _ref) {
    var _this = this;

    var element = _ref.element;
    var size = _ref.size;
    var width = size.width;
    var height = size.height;

    var widthChanged = width !== this.state.width,
        heightChanged = height !== this.state.height;
    if (!widthChanged && !heightChanged) return;

    var _runConstraints = this.runConstraints(width, height);

    var _runConstraints2 = _slicedToArray(_runConstraints, 2);

    width = _runConstraints2[0];
    height = _runConstraints2[1];

    this.setState({ width: width, height: height }, function () {
      if (_this.props.onResize) {
        _this.props.onResize(event, { element: element, size: { width: width, height: height } });
      }
    });
  },

  // If you do this, be careful of constraints
  runConstraints: function runConstraints(width, height) {
    var min = this.props.minConstraints;
    var max = this.props.maxConstraints;

    if (this.props.lockAspectRatio) {
      height = width / this.state.aspectRatio;
      width = height * this.state.aspectRatio;
    }

    if (min) {
      width = Math.max(min[0], width);
      height = Math.max(min[1], height);
    }
    if (max) {
      width = Math.min(max[0], width);
      height = Math.min(max[1], height);
    }
    return [width, height];
  },

  render: function render() {
    // Basic wrapper around a Resizable instance.
    // If you use Resizable directly, you are responsible for updating the component
    // with a new width and height.
    var _props = this.props;
    var handleSize = _props.handleSize;
    var minConstraints = _props.minConstraints;
    var maxConstraints = _props.maxConstraints;

    var props = _objectWithoutProperties(_props, ['handleSize', 'minConstraints', 'maxConstraints']);

    return React.createElement(
      Resizable,
      {
        minConstraints: minConstraints,
        maxConstraints: maxConstraints,
        handleSize: handleSize,
        width: this.state.width,
        height: this.state.height,
        onResizeStart: this.props.onResizeStart,
        onResize: this.onResize,
        onResizeStop: this.props.onResizeStop,
        draggableOpts: this.props.draggableOpts
      },
      React.createElement(
        'div',
        _extends({ style: { width: this.state.width + 'px', height: this.state.height + 'px' } }, props),
        this.props.children
      )
    );
  }
});