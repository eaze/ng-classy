
/*
 * This is written in ES5, but meant to be used in ES6.
 * This is because ES5 is easier to consume on npm than ES6.
 */


/**
 * We just have one angular module that include all others.
 */
// We assume angular is loaded globally.
var app = module.exports.app = angular.module('ngClassyApp', [
  'ui.router'
]);

module.exports.Service = function Service(serviceName) {
  return function(Class) {
    if (!serviceName) {
      serviceName = Class.name;
    }

    app.service(serviceName, Class);
  };
};

module.exports.Inject = function Inject() {
  var injectables = Array.prototype.slice.call(arguments);
  if (Array.isArray(injectables[0])) {
    injectables = injectables[0];
  }
  return function(Class) {
    Class.$inject = injectables;
  };
};

module.exports.Component = Component;
Component.defaults = {
  restrict: 'E',
  scope: {},
  bindToController: {},
  controllerAs: 'vm',
};
function Component(directiveName, options) {
  return function(Class) {
    if (typeof directiveName == 'object') {
      options = directiveName;
      directiveName = pascalCaseToCamelCase(Class.name);
    } else {
      directiveName = pascalCaseToCamelCase(directiveName);
    }
    options || (options = {});
    options.bindToController = options.bindToController || options.bind || {};

    app.directive(directiveName, function() {
      return angular.merge({}, Component.defaults, {
        controller: Class,
      }, options || {});
    });

    if (Class.$initState) {
      Class.$initState(directiveName);
    }

    Class.$isComponent = true;
  };
};

module.exports.State = function State(stateName, options) {
  return function(Class) {
    if (Class.$isComponent) {
      throw new Error("@State() must be placed after @Component()!");
    }
    Class.$initState = function(directiveName) {
      var urlParams = (options.url.match(/:.*?(\/|$)/g) || []).map(function(match) {
        return match.replace(/\/$/, '').replace(/^:/,'');
      });

      app.config(function($stateProvider) {
        var htmlName = camelCaseToDashCase(directiveName);
        // <my-directive param-one="$stateParams['paramOne']" param-two="$stateParams['paramTwo']">
        var attrValuePairs = urlParams.map(function(param) {
          return camelCaseToDashCase(param) + '="__$stateParams[\'' + param + '\']"';
        }).join(' ');
        var template = '<' + htmlName + ' ' + attrValuePairs + '>';

        $stateProvider.state(stateName, angular.merge({
          controller: function($stateParams, $scope) {
            $scope.__$stateParams = $stateParams;
          },
          template: template
        }, options));
      });
    };

  };
};

// Dumb helpers
function pascalCaseToCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.substring(1);
}
function camelCaseToDashCase(str) {
  return str.replace(/[A-Z]/g, function($1) {
    return '-' + $1.toLowerCase();
  });
}
