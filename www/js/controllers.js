angular.module('starter.controllers', [])

.controller('ProjectListCtrl', function($scope, Projects) {
  $scope.projects = Projects.all();
})

.controller('ProjectDetailCtrl', function($scope, $stateParams, Projects,Surveyz,$log) {
  $scope.surveys = Surveyz.all();
  $scope.add = function(){
    Surveyz.add();
    $log.log( Surveyz.all() );
  }
})

.controller('SurveyCtrl', function($scope, $stateParams, $ionicModal, Surveyz, Camera){

  $scope.surveyId = $stateParams.surveyId;
  $scope.survey = Surveyz.get($scope.surveyId);
  //$scope.tag_types = ["facility","equipment","area"];


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

  //Next line is modal-talk. 
  /*
  $scope.new_tag = { 
    prefix:"",
    text: ""
  };
  */




  //$scope.modal_scope =  $scope.$new(true);
  //$scope.modal_scope.survey = $scope.survey;
  //$scope.modal_scope.target = $scope.survey;
  $ionicModal.fromTemplateUrl('templates/tags-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  }); 

  //$scope.modal_state = 0;

  $scope.manageTags = function(){
    $scope.modal.show()
  }

  $scope.closeTagModal = function (){
    $scope.modal.hide();
  }

  /*
  $scope.showAddTag = function() {
    $scope.modal_state = 1;
  }

  $scope.showNewTag = function(){
    $scope.new_tag.text = "";
    $scope.new_tag.prefix = "";
    $scope.modal_state =2;
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



  $scope.createTag = function(prefix, tag){
    tag = tag.toLowerCase();
    var new_tag = (prefix)?prefix + ":" + tag:tag;
    Surveys.createTag( $scope.survey, new_tag);
    Surveys.setTag( $scope.survey, new_tag);
  }

  $scope.filterTags = function (survey_tag) {
    //So, is item 
    if ( $scope.survey.active_tags.indexOf(survey_tag)==-1 ){
      return survey_tag;
    }
  };*/

})

.controller('PictureCtrl', function($scope, $stateParams, $ionicModal, Surveyz) {
  $scope.surveyId = $stateParams.surveyId;
  $scope.survey = Surveyz.get($stateParams.surveyId);
  $scope.picture = $scope.survey.pictures()[$stateParams.pictureId];


  //Modal shit
  //$scope.tag_types = ["facility","equipment","area"];

  //$scope.modal_state = 0;
  //$scope.new_tag = { 
  //  prefix:"",
  //  text: ""
  //};


  $ionicModal.fromTemplateUrl('templates/tags-modal.html',  {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal
  });

  $scope.openTagModal = function() {
    $scope.modal.show()
  }

  $scope.closeTagModal = function() {
    //$scope.showPictureTagsModal();
    $scope.modal.hide();
  };

  /*
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
  };*/
})
.controller('TagModalCtrl',function($scope,$stateParams,$log,Surveyz){
  
  $scope.tag_types = ["facility","equipment","area"];
  var surveyId =  $stateParams.surveyId;
  var pictureId = $stateParams.pictureId;
  $log.log( "Survey Id: " + surveyId );
  $log.log( "Picture Id: " +  pictureId );

  $scope.survey = Surveyz.get(surveyId );
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

.controller('SettingsCtrl', function($scope) {
  $scope.settings = {
    enableSync: true
  };
});
