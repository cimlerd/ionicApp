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

.controller('SurveyCtrl', function($scope, $stateParams, $ionicModal, Surveys, Camera){

  $scope.projectId =$stateParams.projectId; 
  $scope.survey = Surveys.get($stateParams.surveyId);



  $scope.getPicture = function() {
    Camera.getPicture().then(function(imageURI) {
      var picture = Surveys.addPicture( $scope.survey, imageURI );
    }, function(err) {
      var picture = Surveys.addPicture( $scope.survey, "imageURI" );
    });
  };
  $scope.getExistingPicture = function() {
    Camera.getExistingPicture().then(function(imageURI) {
      var picture = Surveys.addPicture( $scope.survey, imageURI );
    }, function(err) {
      var picture = Surveys.addPicture( $scope.survey, "imageURI" );
    });
  };

  $ionicModal.fromTemplateUrl('templates/manage-survey-tags-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  }); 

  $scope.modal_state = 0;

  $scope.manageTags = function(){
    $scope.modal_state = 0;
    $scope.modal.show()
  }

  $scope.showAddTag = function() {
    $scope.modal_state = 1;
  }

  $scope.closeTagModal = function (){
    $scope.modal.hide();
  }

  $scope.setTag = function(tag){
    Surveys.setTag( $scope.survey,  tag);
  }

  $scope.unsetTag = function(tag){
    Surveys.unsetTag( $scope.survey, tag);
  }

  $scope.createTag = function(tag) {
    Surveys.createTag( $scope.survey );
  }

  $scope.filterTags = function (survey_tag) {
    //So, is item 
    if ( $scope.survey.active_tags.indexOf(survey_tag)==-1 ){
      return survey_tag;
    }
  };

})

.controller('PictureCtrl', function($scope, $stateParams, $ionicModal, Surveys) {
  //$scope.chat = Chats.get($stateParams.chatId);
  $scope.survey = Surveys.get($stateParams.surveyId);
  $scope.picture = $scope.survey.pictures[$stateParams.pictureId];

  $scope.tag_types = ["facility","equipment","area"];

  $scope.modal_state = 0;
  $scope.new_tag = { 
    prefix:"",
    text: ""
  };


  $ionicModal.fromTemplateUrl('templates/edit-picture-tags-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  });

  $scope.openTagModal = function() {
    $scope.modal.show()
  }

  $scope.closeTagModal = function() {
    $scope.showPictureTagsModal();
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });  

  $scope.removeTag = function(tag){
    Surveys.unTagPicture( $scope.survey, $stateParams.pictureId, tag);
  }

  $scope.addTag = function(tag){
    Surveys.tagPicture( $scope.survey, $stateParams.pictureId, tag);
  }

  $scope.createTag = function(prefix, tag){
    tag = tag.toLowerCase();
    if( prefix == undefined){
      Surveys.tagPicture( $scope.survey, $stateParams.pictureId, tag );
    } else {
      Surveys.tagPicture( $scope.survey, $stateParams.pictureId, prefix + ":" + tag );
    }
  }

  $scope.showPictureTagsModal = function(){
    $scope.modal_state = 0;
  }

  $scope.showSurveyTagsModal = function(){
    $scope.modal_state = 1;
  }

  $scope.showNewTagModal = function(){
    $scope.new_tag.text = "";
    $scope.new_tag.prefix = "";
    $scope.modal_state = 2;
  }

  $scope.filterTags = function (survey_tag) {
    //So, is item 
    if ( $scope.picture.tags.indexOf(survey_tag)==-1 ){
      return survey_tag;
    }
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
