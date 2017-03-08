module.exports = (function () {

  var config = require('./../config/config.js');
  var firebase = require('firebase');

  this.connect = function (cred) {
    return new Promise(function (resolve, reject) {
      try {
        var conn = firebase.initializeApp(config.firebase.config).database();
        firebase.auth().signInWithEmailAndPassword(cred.email, cred.password)
        .then(function () { resolve(conn); })
        .catch(function (e) { reject(e); });
      }
      catch (e) { reject(e); }
    });
  };

  this.get = function (db, key) {
    return new Promise(function (resolve, reject) {
      try {
        db.ref(key).once('value')
        .then(function (response) { resolve(response); })
        .catch(function (e) { reject(e); });
      }
      catch (e) { reject(e); }
    });
  };

  this.watch = function (db, key, func) {
    try {
      db.ref(key).on('value', snapshot => func(snapshot));
      return true;
    }
    catch (e) {
      return e;
    }
  };

  this.set = function (db, key, value) {
    return new Promise(function (resolve, reject) {
      try {
        db.ref(key).set(value)
        .then(function (response) { resolve(response); })
        .catch(function (e) { reject(e); });
      }
      catch (e) { reject(e); }
    });
  };

  this.update = function (db, updates) {
    return new Promise(function (resolve, reject) {
      try {
        db.ref(key).update(updates)
        .then(function (response) { resolve(response); })
        .catch(function (e) { reject(e); });
      }
      catch (e) { reject(e); }
    });
  };

  this.remove = function (db, key) {
    return new Promise(function (resolve, reject) {
      try {
        db.ref(key).remove()
        .then(function (response) { resolve(response); })
        .catch(function (e) { reject(e); });
      }
      catch (e) { reject(e); }
    });
  };

  this.disconnect = function () {
    return new Promise(function (resolve, reject) {
      try {
        firebase.auth().signOut()
        .then(function() { resolve(); })
        .catch(function (e) { reject(e); });
      }
      catch (e) {
        reject(e);
      }
    });
  };

  return this;
})();