import {expect} from 'chai'

import classy from '../lib'

describe('ngClassy', () => {
  beforeEach(angular.mock.module(classy.app.name))

  it('should create a service', () => {

    @classy.Service()
    class SuperService {
      doSomething() {
        return 2
      }
    }
    inject((SuperService) => {
      expect(SuperService.doSomething()).to.equal(2)
    })

  })

  it('Component', () => {
    @classy.Component({
      template: '<div>the color is {{color}}</div>'
    })
    class MyComponent {
      constructor($scope) {
        $scope.color = 'blue'
      }
    }
    inject(($compile, $rootScope) => {
      let el = $compile('<my-component>')($rootScope)
      $rootScope.$apply()
      expect(el.text()).to.equal('the color is blue')
    })
  })

  it('Component with State should pass stateParams to component attributes', () => {
    @classy.Component({
      template: '<div>param1={{vm.param1}}, param2={{vm.param2}}</div>',
      bind: {
        param1: '=',
        param2: '='
      }
    })
    @classy.State('superState', {
      url: '/super/:param1/:param2'
    })
    class SuperComponent {
    }

    inject(($compile, $state, $rootScope) => {
      let app = $compile('<div><ui-view></ui-view></div>')($rootScope)
      $rootScope.$apply()
      $state.go('superState', {
        param1: 'valueOne',
        param2: 'valueTwo'
      })
      $rootScope.$apply()
      console.log(app)
      expect(app.find('super-component').length).to.equal(1)
      expect(app.find('super-component').text()).to.equal('param1=valueOne, param2=valueTwo')
    })
  })

  it('should error if you @State() before @Component()', () => {
    expect(() => {
      @classy.State('someState', {})
      @classy.Component()
      class SomeComponent {
      }
    }).to.throw()
  })
})
