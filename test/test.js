var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var wrapComponent = require('../index');

describe('onclickoutside hoc', function() {

  var Component = React.createClass({
    getInitialState: function() {
      return {
        clickOutsideHandled: false
      };
    },

    handleClickOutside: function(event) {
      if (event === undefined) {
          throw new Error("event cannot be undefined");
      }

      this.setState({
        clickOutsideHandled: true
      });
    },

    render: function() {
      return React.createElement('div');
    }
  });

  var WrappedComponent = wrapComponent(Component);

  // tests

  it('should call handleClickOutside when clicking the document', function() {
    var element = React.createElement(WrappedComponent);
    assert(element, "element can be created");
    var component = TestUtils.renderIntoDocument(element);
    assert(component, "component renders correctly");
    document.dispatchEvent(new Event('mousedown'));
    var instance = component.getInstance();
    assert(instance.state.clickOutsideHandled, "clickOutsideHandled got flipped");
  });


  it('should throw an error when a component without handleClickOutside(evt) is wrapped', function() {
    var BadComponent = React.createClass({
      render: function() {
        return React.createElement('div');
      }
    });

    try {
      var bad = wrapComponent(BadComponent);
      assert(false, "component was wrapped, despite not implementing handleClickOutside(evt)");
    } catch (e) {
      assert(e, "component was not wrapped");
    }
  });


  it('should call the specified handler when clicking the document', function() {
    var CustomComponent = React.createClass({
      getInitialState: function() {
        return {
          clickOutsideHandled: false
        };
      },

      myOnClickHandler: function(event) {
        if (event === undefined) {
            throw new Error("event cannot be undefined");
        }

        this.setState({
          clickOutsideHandled: true
        });
      },

      render: function() {
        return React.createElement('div');
      }
    });

    var WrappedWithCustomHandler = wrapComponent(CustomComponent, {
      handleClickOutside: function (instance) {
        return instance.myOnClickHandler;
      }
    });

    var element = React.createElement(WrappedWithCustomHandler);
    assert(element, "element can be created");
    var component = TestUtils.renderIntoDocument(element);
    assert(component, "component renders correctly");
    document.dispatchEvent(new Event('mousedown'));
    var instance = component.getInstance();
    assert(instance.state.clickOutsideHandled, "clickOutsideHandled got flipped");
  });

  it('should throw an error when a custom handler is specified, but the component does not implement it', function() {
    var BadComponent = React.createClass({
      render: function() {
        return React.createElement('div');
      }
    });

    try {
      var bad = wrapComponent(BadComponent, {
        handleClickOutside: function (instance) {
          return instance.nonExistentMethod;
        }
      });
      assert(false, "component was wrapped, despite not implementing the custom handler");
    } catch (e) {
      assert(e, "component was not wrapped");
    }
  });
});
