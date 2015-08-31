angular.module('photoTagger.controllers', [])


.controller('SurveyListCtrl', function($scope, $stateParams, Surveys) {
  $scope.surveys = Surveys.all();
  $scope.add = function(){
    Surveys.add();
  }
})

.controller('SurveyCtrl', function($scope, $stateParams, $ionicModal, Surveys, Camera){

  $scope.surveyId = $stateParams.surveyId;
  $scope.survey = Surveys.get($scope.surveyId);

  $scope.getPicture = function() {
    Camera.getPicture().then(function(imageURI) {
      $scope.survey.addPicture(imageURI);
    }, function(err) {
      $scope.survey.addPicture("imageURI");
    });
  };
  $scope.getExistingPicture = function() {
    Camera.getExistingPicture().then(function(imageURI) {
      $scope.survey.addPicture(imageURI);
    }, function(err) {
      $scope.survey.addPicture("imageURI");
    });
  };

  $scope.manageTags = function(){
    $ionicModal.fromTemplateUrl('templates/tags-modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeTagModal = function (){
    if( $scope.modal )
      $scope.modal.remove();
  }


})

.controller('PictureCtrl', function($scope, $stateParams, $ionicModal, Surveys) {
  $scope.surveyId = $stateParams.surveyId;
  $scope.survey = Surveys.get($stateParams.surveyId);
  $scope.picture = $scope.survey.pictures()[$stateParams.pictureId];

  $scope.manageTags = function(){
    $ionicModal.fromTemplateUrl('templates/tags-modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeTagModal = function (){
    if( $scope.modal )
      $scope.modal.remove();
  }


})
.controller('TagModalCtrl',function($scope,$stateParams,$log,Surveys){
  
  $scope.tag_types = ["facility","equipment","area"];
  var surveyId =  $stateParams.surveyId;
  var pictureId = $stateParams.pictureId;
  $log.log( "Survey Id: " + surveyId );
  $log.log( "Picture Id: " +  pictureId );

  $scope.survey = Surveys.get(surveyId );
  if( pictureId ){
    $scope.target = $scope.survey.pictures()[pictureId];
  } else {
    $scope.target = $scope.survey ;
  }

  $scope.init = function(){
    $scope.new_tag = { prefix:"", text: "" };
    $scope.showCreateTag = false;
  }

  $scope.init();

  $scope.showTagCreate = function(){
    $scope.showCreateTag = true;
  }

  $scope.showTagList = function() {
    $scope.showCreateTag = false;
  }

  $scope.isSelected = function(tag) {
    if( $scope.target.tags().indexOf(tag) !== -1){
      return true;
    } else {
      return false;
    }
  }

  $scope.toggleTag = function( tag ){
    if( $scope.isSelected(tag) ){
      $scope.target.unTag(tag);
    } else {
      $scope.target.tag(tag);
    }
  }

  $scope.createTag = function(prefix, tag){
    tag = tag.toLowerCase();
    var new_tag = (prefix)?prefix + ":" + tag:tag;
    $scope.survey.createTag( new_tag );
    $scope.target.tag( new_tag);  //Do we want to auto-tag the target upon creation of a tag?  (I think so)
  }

  $scope.close = function(){
    $scope.init();
    $scope.closeTagModal();
  }
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

.controller('SettingsCtrl', function($scope, Surveys) {
  $scope.settings = {
    enableSync: true
  };

  $scope.resetLocalStorage = function(){
    Surveys.resetLocalStorage();
  }
});
