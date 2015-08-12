angular.module('starter.controllers', [])

.controller('ProjectListCtrl', function($scope, Projects) {
  $scope.projects = Projects.all();
})

.controller('ProjectDetailCtrl', function($scope, $stateParams, Projects,Surveys) {

  //$scope.$on('$ionicView.enter', function(e) {
  $scope.project = Projects.get($stateParams.projectId);
  $scope.surveys = [];
  angular.forEach( $scope.project.surveys, function(survey_id){
    $scope.surveys.push(Surveys.get(survey_id));
  });
  //});

  $scope.add = function(){
    $scope.surveys.push(Surveys.create( $stateParams.projectId));
  }

})

.controller('SurveyCtrl', function($scope, $stateParams, Surveys, Camera){

  //$scope.survey = Surveys.get($stateParams(surveyId));

  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableSync: true
  };
});
