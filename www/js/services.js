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
.factory('Surveys', function(Survey) {
  // Service that persists local storage of surveys, and restores
  var _surveys = [];
  return {
    all: function() {
      return _surveys;
    },
    add: function() {
      _surveys.push( new Survey());
    },
    get: function( index ){
      return _surveys[index];
    }
  }
})
.factory('Survey',['Picture',function(Picture){

    var Survey = function() {
      this._tags= [];
      this._active_tags = [];
      this._pictures = [];
      this._creation_date = new Date();
    };

    Survey.prototype.allTags = function(){
      return this._tags;
    };

    Survey.prototype.tags = function(){
      return this._active_tags;
    };

    Survey.prototype.tag = function( tag ) {
      if( this._active_tags.indexOf(tag) === -1){
        this._active_tags.push( tag );
      }
    };

    Survey.prototype.unTag = function( tag ){
      var index = this._active_tags.indexOf(tag);
      if( index !== -1 ){
        this._active_tags.splice(index, 1 );
      }
    };

    Survey.prototype.createTag = function( tag ){
      tag = tag.toLowerCase();
      if( this._tags.indexOf(tag) === -1 ){
        this._tags.push(tag);
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
      })

    };

    Survey.prototype.addPicture = function( picture_uri){
      picture = new Picture(picture_uri, this._active_tags );
      this._pictures.push(picture);
    };

    Survey.prototype.pictures = function(){
      return this._pictures;
    };

    Survey.prototype.creation_date = function(){
      return this._creation_date;
    };

    return Survey;
  }])
.factory('Picture',[
  function(){

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

    Picture.prototype.tags = function() {
      return this._tags;
    }

    Picture.prototype.tag = function( tag ) {
      if( this._tags.indexOf(tag) === -1){
        this._tags.push(tag);
      }
    };

    Picture.prototype.unTag = function( tag )
    {
      //Assumption - there is only one copy of this tag in ye olde liste
      var tag_index = this._tags.indexOf(tag);
      if( tag_index !== -1){
        this._tags.splice(tag_index, 1 );
      }
    };

    Picture.prototype.description = function( description ){
      if( arguments.length ){
        this._description = description;
      } else {
        return this._description;
      }
    };
    return Picture;
  }]);
