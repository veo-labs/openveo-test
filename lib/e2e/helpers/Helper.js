'use strict';

/**
 * @module e2e
 */

var openVeoApi = require('@openveo/api');
var ResourceFilter = openVeoApi.storages.ResourceFilter;

/**
 * Helpers intends to use EntityProviders to manipulate the Database without requesting the web browser but staying in
 * protractor's control flow.
 *
 * Do not use this directly but extend it.
 *
 * @example
 *
 *     var Helper = require('@openveo/test').e2e.helpers.Helper;
 *
 *     function MyHelper(provider) {
 *       MyHelper.super_.call(this);
 *     }
 *
 *     module.exports = MyHelper;
 *     util.inherits(MyHelper, Helper);
 *
 *     var helper = new MyHelper(new MyProvider());
 *
 * @class Helper
 * @constructor
 * @param {EntityProvider} provider The entity provider that will be used by the Helper
 */
function Helper(provider) {
  Object.defineProperties(this, {

    /**
     * The entity provider that will be used by the Helper.
     *
     * @property provider
     * @type EntityProvider
     * @final
     */
    provider: {value: provider},

    /**
     * Protractor control flow.
     *
     * @property flow
     * @type ControlFlow
     * @final
     */
    flow: {value: browser.controlFlow()},

    /**
     * The list of entity properties names which "query" parameter will search on when requesting the web service.
     *
     * If the entity managed by the Helper is registered to be tested automatically by the core and has to be tested
     * on the "query" parameter, this property must list all possible values of the "query" parameter of a
     * get /entityName request.
     *
     * @example
     *
     *     ['name', 'description'];
     *
     * @property textSearchProperties
     * @type Array
     */
    textSearchProperties: {value: [], writable: true},

    /**
     * The list of entity properties which sortBy will search on when requesting the web service.
     *
     * If the entity managed by the Helper is registered to be tested automatically by the core and has to be tested
     * on the "sortBy" parameter, this property must list all possible values of the "sortBy" parameter of a
     * get /entityName request with the expected type.
     *
     * Possible type valus are 'string', 'number' and 'date'.
     *
     * @example
     *
     *     [{
     *       name: 'title',
     *       type: 'string'
     *     },{
     *       name: 'description',
     *       type: 'string'
     *     },{
     *       name: 'date',
     *       type: 'number'
     *     },{
     *       name: 'state',
     *       type: 'number'
     *     },{
     *       name: 'views',
     *       type: 'number'
     *     }]
     *
     * @property sortProperties
     * @type Array
     */
    sortProperties: {value: [], writable: true}

  });
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
 * @return {Promise} Promise resolving when entities are added with:
 *   - **Array** The list of added entities
 */
Helper.prototype.addEntities = function(entities) {
  var self = this;

  return browser.waitForAngular().then(function() {
    return self.flow.execute(function() {
      var deferred = protractor.promise.defer();
      var addedEntities;

      // Nothing to add
      if (!entities.length)
        return protractor.promise.fulfilled([]);

      // Create entities
      self.provider.add(entities, function(error, addedCount, newEntities) {
        if (error)
          deferred.reject(error);
        else {
          addedEntities = newEntities;
          deferred.fulfill();
        }
      });

      return deferred.promise.then(function() {
        return protractor.promise.fulfilled(addedEntities);
      });
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

  return browser.waitForAngular().then(function() {
    return self.flow.execute(function() {
      var deferred = protractor.promise.defer();
      var entityIds = [];

      for (var i = 0; i < entities.length; i++)
        entityIds.push(entities[i].id);

      // Nothing to remove
      if (!entityIds.length)
        return protractor.promise.fulfilled();

      self.provider.remove(
        new ResourceFilter().in('id', entityIds),
        function(error) {
          if (error)
            deferred.reject(error);
          else
            deferred.fulfill();
        }
      );

      return deferred.promise;
    });
  });
};

/**
 * Gets all entities from database.
 *
 * @async
 * @method getEntities
 * @param {ResourceFilter} [filter] Rules to filter entities
 * @return {Promise} Promise resolving with the list of entities
 */
Helper.prototype.getEntities = function(filter) {
  var self = this;

  return browser.waitForAngular().then(function() {
    return self.flow.execute(function() {
      var deferred = protractor.promise.defer();
      self.provider.getAll(filter, null, {id: 'desc'}, function(error, entities) {
        if (error)
          throw error;

        deferred.fulfill(entities);
      });
      return deferred.promise;
    });
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

  return browser.waitForAngular().then(function() {
    return self.flow.execute(function() {
      var deferred = protractor.promise.defer();
      var safeIds = safeEntities.map(function(safeEntity) {
        return safeEntity.id;
      });

      self.provider.remove(
        new ResourceFilter().notIn('id', safeIds),
        function(error) {
          if (error)
            throw error;
          else
            deferred.fulfill();
        }
      );
      return deferred.promise;
    });
  });
};

/**
 * Translates a dictionary key.
 *
 * @method translate
 * @param {String} key The key to translate
 * @param {Object} dictionary The dictionary of translations
 * @return {String} The translated text
 */
Helper.prototype.translate = function(key, dictionary) {
  var translation;

  try {
    translation = eval('dictionary.' + key);
    translation = translation || key;
  } catch (error) {
    translation = key;
  }

  return translation;
};

/**
 * Gets entity object example to use with web service put /entityName.
 *
 * If the entity managed by the Helper is registered to be tested automatically by the core, it needs to implement
 * this method which will be used to perform a put /entityName.
 *
 * @method getAddExample
 * @return {Object} The data to add
 */
Helper.prototype.getAddExample = function() {
  throw new Error('Method getAddExample is not implemented by this Helper');
};

/**
 * Gets entity object example to use with web service post /entityName.
 *
 * If the entity managed by the Helper is registered to be tested automatically by the core, it needs to implement
 * this method which will be used to perform a post /entityName.
 *
 * @method getUpdateExample
 * @return {Object} The data to perform the update
 */
Helper.prototype.getUpdateExample = function() {
  throw new Error('Method getUpdateExample is not implemented by this Helper');
};

/**
 * Prepares an entity to be tested against an entity coming from a get /entityName/:id.
 *
 * All properties of the returned object must match properties from a get /entityName/:id.
 *
 * If the entity managed by the Helper is registered to be tested automatically by the core, it needs to implement
 * this method which will be used to perform a post /entityName.
 *
 * @method getValidationExample
 * @return {Object} The entity which will validate a get /entityName/:id response
 */
Helper.prototype.getValidationExample = function(entity) {
  return entity;
};
