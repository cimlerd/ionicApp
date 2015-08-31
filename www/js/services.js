angular.module('photoTagger.services', [])


.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();
      options = typeof options !== 'undefined' ? options : {
        quality : 75,
        saveToPhotoAlbum: true
      };

      try{
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
      } catch(e) {
        q.reject(e);
      }

      return q.promise;
    },
    getExistingPicture: function(options){
      var q = $q.defer();
      try {
        options = typeof options !== 'undefined' ? options : {
          sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM
        };
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
      } catch(e){
        q.reject(e);
      }
      return q.promise;
    }
  }
}])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}])
.factory('Surveys', function(Survey,$localstorage,$rootScope) {
  // Service that persists local storage of surveys, and restores
  var _surveyStorage = $localstorage.getObject('Surveys');
  var _surveys = [];

  if( _surveyStorage.length){
    angular.forEach(_surveyStorage, function( survey ){
      var new_survey = new Survey( survey );
      _surveys.push( new_survey );
    })
  };

  var service = {
    all: function() {
      return _surveys;
    },
    add: function() {
      _surveys.push( new Survey());
      $rootScope.$broadcast("savestate");
    },
    get: function( index ){
      return _surveys[index];
    },
    saveState: function() {
      $localstorage.setObject('Surveys',_surveys);
    },
    resetLocalStorage: function() {
      _surveys = [];
      this.saveState();
    }
  };

  $rootScope.$on("savestate", service.saveState);  //Bind to the 'savestate'
  return service;
})
.factory('Survey',function(Picture,$rootScope){

    var Survey = function( saved_survey ) {

      if( saved_survey ){
        this.reconstitute( saved_survey );
        return;
      } 

      this._tags= ["example"];
      this._active_tags = [];
      this._pictures = [];
      this._creation_date = new Date();
      
    };

    Survey.prototype.reconstitute = function( saved_survey ){
      this._tags= saved_survey._tags;
      this._active_tags =saved_survey._active_tags;
      this._pictures = [];
      this._creation_date = saved_survey._creation_date;

      if( saved_survey._pictures.length){
        var survey = this;
        angular.forEach( saved_survey._pictures, function( picture ){
          var new_picture = new Picture();
          new_picture.reconstitute( picture );
          survey._pictures.push( new_picture );
        })
      };
    }

    Survey.prototype.allTags = function(){
      return this._tags;
    };

    Survey.prototype.tags = function(){
      return this._active_tags;
    };

    Survey.prototype.tag = function( tag ) {
      if( this._active_tags.indexOf(tag) === -1){
        this._active_tags.push( tag );
        $rootScope.$broadcast("savestate");
      }
    };

    Survey.prototype.unTag = function( tag ){
      var index = this._active_tags.indexOf(tag);
      if( index !== -1 ){
        this._active_tags.splice(index, 1 );
        $rootScope.$broadcast("savestate");
      }
    };

    Survey.prototype.createTag = function( tag ){
      tag = tag.toLowerCase();
      if( this._tags.indexOf(tag) === -1 ){
        this._tags.push(tag);
        $rootScope.$broadcast("savestate");
      }
    };

    Survey.prototype.renameTag = function( old_tag, new_tag){
      var index = this._active_tags.indexOf(old_tag);
      if( index !== -1){
        this._active_tags[index] = new_tag
      }
      var index = this._tags.indexOf(old_tag);
      if( index !== -1){
        this._tags[index] = new_tag
      }
      angular.forEach( this._pictures, function( picture ){
        picture.renameTag(old_tag, new_tag);
      });
      $rootScope.$broadcast("savestate");

    };

    Survey.prototype.addPicture = function( picture_uri){
      picture = new Picture(picture_uri, this._active_tags );
      this._pictures.push(picture);
      $rootScope.$broadcast("savestate");
    };

    Survey.prototype.pictures = function(){
      return this._pictures;
    };

    Survey.prototype.creation_date = function(){
      return this._creation_date;
    };

    return Survey;
  })
.factory('Picture',
  function($rootScope){

    var Picture = function( picture_uri, active_tags ) {

      this.uri= picture_uri;
      this._description = "";
      this._tags = [];

      var picture = this;
      if( active_tags ){
        angular.forEach( active_tags, function(tag){
          picture._tags.push(tag);
        })
      }
    };

    Picture.prototype.reconstitute = function( saved_picture ){
      this.uri = saved_picture.picture_uri;
      this._description = saved_picture._description;
      this._tags = saved_picture._tags;
    }

    Picture.prototype.tags = function() {
      return this._tags;
    }

    Picture.prototype.tag = function( tag ) {
      if( this._tags.indexOf(tag) === -1){
        this._tags.push(tag);
      }
      $rootScope.$broadcast("savestate");
    };

    Picture.prototype.unTag = function( tag )
    {
      //Assumption - there is only one copy of this tag in ye olde liste
      var tag_index = this._tags.indexOf(tag);
      if( tag_index !== -1){
        this._tags.splice(tag_index, 1 );
        $rootScope.$broadcast("savestate");
      }
    };

    Picture.prototype.description = function( description ){
      if( arguments.length ){
        this._description = description;
        $rootScope.$broadcast("savestate");
      } else {
        return this._description;
      }
    };
    return Picture;
  });
