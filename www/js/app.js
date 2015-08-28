// Photo Tagger App

// Redone version of the Ionic Starter App
angular.module('photoTagger', ['ionic', 'photoTagger.controllers', 'photoTagger.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/survey',
    views: {
      'tab-survey': {
        templateUrl: 'templates/survey-list.html',
        controller: 'SurveyListCtrl'
      }
    }
  })
  .state('tab.survey-detail',{
    url: '/survey/:surveyId',
      views: {
        'tab-survey': {
          templateUrl: 'templates/survey-detail.html',
          controller: 'SurveyCtrl'
        }
      }
  })
  .state('tab.picture-detail',{
    url: '/survey/:surveyId/:pictureId',
      views: {
        'tab-survey': {
          templateUrl: 'templates/picture-detail.html',
          controller: 'PictureCtrl'
        }
      }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/survey');

});
