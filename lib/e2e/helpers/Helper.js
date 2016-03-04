'use strict';

var async = require('async');

/**
 * @module e2e
 */

/**
 * Helpers intends to use EntityModels to manipulate the Database without requesting the web browser but staying in
 * protractor's control flow.
 *
 * Do not use this directly but extend it.
 *
 * @example
 *
 *     var Helper = require('@openveo/test').e2e.Helper;
 *
 *     function MyHelper(model) {
 *       MyHelper.super_.call(this);
 *     }
 *
 *     module.exports = MyHelper;
 *     util.inherits(MyHelper, Helper);
 *
 *     var helper = new MyHelper(new MyModel());
 *
 * @class Helper
 * @constructor
 * @param {EntityModel} model The entity model that will be used by the Helper
 */
function Helper(model) {

  /**
   * The entity model that will be used by the Helper.
   *
   * @property model
   * @type EntityModel
   */
  this.model = model;

  /**
   * Protractor control flow.
   *
   * @property flow
   * @type ControlFlow
   */
  this.flow = browser.controlFlow();

}

module.exports = Helper;

/**
 * Adds multiple entities at the same time.
 *
 * This method bypass the web browser to directly add entities into database.
 *
 * @async
 * @method addEntities
 * @param {Array} entities A list of entities to add
 * @return {Promise} Promise resolving when entities are added
 */
Helper.prototype.addEntities = function(entities) {
  var self = this;

  return this.flow.execute(function() {
    var deferred = protractor.promise.defer();
    var parallel = [];
    var addedEntities = [];

    // Create function for async to add an entity to the database
    function createAddFunction(entity) {

      // Add function to the list of functions to execute in parallel
      parallel.push(function(callback) {

        // Add entity
        self.model.add(entity, function(error, addedCount, addedEntity) {
          addedEntities.push(addedEntity);
          callback(error);
        });

      });
    }

    // Create functions to add entities with async
    for (var i = 0; i < entities.length; i++)
      createAddFunction(entities[i]);

    // Nothing to add
    if (!parallel.length)
      return protractor.promise.fulfilled(addedEntities);

    // Asynchonously create entities
    async.parallel(parallel, function(error) {
      if (error)
        deferred.reject(error);
      else
        deferred.fulfill();
    });
    return deferred.promise.then(function() {
      return protractor.promise.fulfilled(addedEntities);
    });
  });
};

/**
 * Adds multiple entities at the same time with automatic index.
 *
 * This method bypass the web browser to directly add entities into database.
 *
 * All created entities will have the same name suffixed by the index.
 *
 * @example
 *
 *     // With MyHelper extending Helper
 *     var helper = new MyHelper();
 *     helper.addEntitiesAuto('My entity', 2).then(function(entities) {
 *       console.log('Entity "My entity 0" created');
 *       console.log('Entity "My entity 1" created');
 *       console.log(entities);
 *     });
 *
 * @example
 *
 *     helper.addEntitiesAuto('My entity', 2, 2).then(function(entities) {
 *       console.log('Entity "My entity 2" created');
 *       console.log('Entity "My entity 3" created');
 *       console.log(entities);
 *     });
 *
 * @async
 * @method addEntitiesAuto
 * @param {String} name Base name of the entities to add
 * @param {Number} total Number of entities to add
 * @param {Number} [offset=0] Index to start from for the name suffix
 * @return {Promise} Promise resolving with the added entities
 */
Helper.prototype.addEntitiesAuto = function(name, total, offset) {
  var entities = [];
  offset = offset || 0;

  for (var i = offset; i < total; i++)
    entities.push({name: name + ' ' + i});

  return this.addEntities(entities);
};

/**
 * Removes multiple entities at the same time.
 *
 * This method bypass the web browser to directly remove entities from database.
 *
 * @async
 * @method removeEntities
 * @param {Array} entities A list of entities
 * @return {Promise} Promise resolving when entities are removed
 */
Helper.prototype.removeEntities = function(entities) {
  var self = this;

  return this.flow.execute(function() {
    var deferred = protractor.promise.defer();
    var entityIds = [];

    for (var i = 0; i < entities.length; i++)
      entityIds.push(entities[i].id);

    // Nothing to remove
    if (!entityIds.length)
      return protractor.promise.fulfilled();

    self.model.remove(entityIds, function(error) {
      if (error)
        deferred.reject(error);
      else
        deferred.fulfill();
    });

    return deferred.promise;
  });
};

/**
 * Gets all entities from database.
 *
 * @async
 * @method getEntities
 * @return {Promise} Promise resolving with the list of entities
 */
Helper.prototype.getEntities = function() {
  var self = this;

  return this.flow.execute(function() {
    var deferred = protractor.promise.defer();
    self.model.get(function(error, entities) {
      if (error)
        throw error;

      deferred.fulfill(entities);
    });
    return deferred.promise;
  });
};

/**
 * Removes all entities from database.
 *
 * @async
 * @method removeAllEntities
 * @param {Array} safeEntities A list of entities to keep safe
 * @return {Promise} Promise resolving when all entities are removed
 */
Helper.prototype.removeAllEntities = function(safeEntities) {
  var self = this;
  safeEntities = safeEntities || [];

  return this.flow.execute(function() {
    var deferred = protractor.promise.defer();

    self.model.get(function(error, entities) {
      var ids = [];

      if (error)
        throw error;

      // Keep safe entities out of the list of entities to remove
      entities = entities.filter(function(entity) {
        for (var i = 0; i < safeEntities.length; i++) {
          if (entity.id === safeEntities[i].id)
            return false;
        }

        return true;
      });

      for (var i = 0; i < entities.length; i++)
        ids.push(entities[i].id);

      if (ids.length) {
        self.model.remove(ids, function(error) {
          if (error)
            throw error;
          else
            deferred.fulfill();
        });
      } else
        deferred.fulfill();
    });
    return deferred.promise;
  });
};
