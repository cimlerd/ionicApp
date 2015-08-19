angular.module('starter.services', [])


.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();
      options = typeof options !== 'undefined' ? options : {
        quality : 75,
        saveToPhotoAlbum: true
      };

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    },
    getExistingPicture: function(options){
      var q = $q.defer();
      options = typeof options !== 'undefined' ? options : {
        sourceType : Camera.PictureSourceType.SAVEDPHOTOALBUM
      };

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])
.factory('Projects', function() {
  // Might use a resource here that returns a JSON array

  var projects = [{
    id: 1,
    name: "Sliverlake Japanese Cultural Center",
    contract_number: "0thx1138",
    surveys: [1,2]
  }, {
    id: 2,
    name: "Utah Place Bike Workshop",
    contract_number: "0pyx1137",
    surveys: []

  }];

  return {
    all: function() {
      return projects;
    },
    remove: function(project) {
      projects.splice(chats.indexOf(chat), 1);
    },
    get: function(projectId) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(projectId)) {
          return projects[i];
        }
      }
      return null;
    }
  };
})


.factory('Surveys', function(Projects) {
  // Might use a resource here that returns a JSON array

  var pic_id = 1;

  var surveys = [{
    id: 1,
    creation_date: new Date(2009,10,10),
    pictures : [ 
            ],
    tags: []
  }, {
    id: 2,
    creation_date: new Date(20010,10,10),
    pictures : [ 
            { //id: -1,
              description: "Toby Imler - Modern Baby on the go",
              uri: "/img/toby.jpg",
              tags:["area:living room","equipment:boiler"]
            }
            ],
    tags: ["area:living room","cute","equipment:boiler"],
    active_tags: ["cute","cute1","cute2","cute3","cute4","cute5","cute6","cute7","cute8","cute9","cute10","cute11","cute12","cute13","cute14"]

  }];

  return {
    all: function() {
      return projects;
    },
    remove: function(survey) {
      projects.splice(chats.indexOf(survey), 1);
    },
    get: function(surveyId) {
      for (var i = 0; i < surveys.length; i++) {
        if (surveys[i].id === parseInt(surveyId)) {
          return surveys[i];
        }
      }
      return null;
    },
    create: function(projectId) {
      var new_id = surveys.slice(-1)[0].id + 1;
      var new_survey =  {
          id: new_id,
          creation_date: new Date(),
          pictures: [],
          tags: []
      }
      surveys.push( new_survey );
      Projects.get(projectId).surveys.push(new_id);
      return new_survey;
    },
    addPicture: function( survey, picURI){
      var picture = { 
        //id: pic_id,
        uri: picURI,
        tags: ["default","tag"],
        description: ""
      }
      //pic_id = pic_id + 1;
      survey.pictures.push( picture );
    },
    tagPicture: function( survey, pictureIndex, tag){
      survey.tags.push(tag);
      survey.pictures[pictureIndex].tags.push(tag);

    },
    unTagPicture: function( survey, pictureIndex, tag){
      for (var i=survey.pictures[pictureIndex].tags.length-1; i>=0; i--) {
          if (survey.pictures[pictureIndex].tags[i] === tag) {
              survey.pictures[pictureIndex].tags.splice(i, 1);
          }
      }
    },
    unsetTag: function( survey, tag) {
      for (var i=survey.active_tags.length-1; i>=0; i--) {
          if (survey.active_tags[i] === tag) {
              survey.active_tags.splice(i, 1);
          }
      }
    },
    setTag: function( survey, tag) {
      if( survey.active_tags.indexOf(tag) === -1 ){
        survey.active_tags.push(tag);
      }
    }
  };
});
