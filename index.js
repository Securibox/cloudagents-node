'use strict';

var querystring = require('querystring');
var R = require('ramda');
var request = require('request');

var CloudAgents = module.exports = {};

CloudAgents.environments = {
  production: 'https://multitenant.securibox.eu/api/v1',
  testenv: 'https://sca-testenv.securibox.eu/api/v1',
};

CloudAgents.Client = function(username, secret, env) {
  if (R.isNil(username)) {
    throw new Error('Missing "username"');
  }

  if (R.isNil(secret)) {
    throw new Error('Missing "secret"');
  }

  if (env !== CloudAgents.environments.production &&
      env !== CloudAgents.environments.testenv) {
    throw new Error('Invalid Cloud Agents environment');
  }

  this.username = username;
  this.secret = secret;
  this.authorization = "Basic " + new Buffer(this.username + ":" + this.secret).toString("base64");

  this.env = env;
};


CloudAgents.Client.prototype._authenticatedRequest = function(options, callback) {
    var $requestOptions = {
        uri: options.uri,
        method: options.method,
        json: true,
        headers : {
            "Authorization" : this.authorization
        }
    };

    if (options.body != null) {
        $requestOptions = R.assoc('body', options.body, $requestOptions);
    }

    request($requestOptions, function(err, res, $body) {
        if (err != null) {
        callback(err, null);
        } else if (res.statusCode !== 200) {
        callback(R.assoc('statusCode', res.statusCode, $body), null);
        } else {
        callback(null, $body);
        }
    });
};

//Categories
CloudAgents.Client.prototype.getCategories = function(env, callback){
    this._authenticatedRequest({
        uri: env + '/categories',
        method: 'GET'
    }, callback)
}

//Agents
CloudAgents.Client.prototype.getAgentsByCategory = function(category_id, env, callback){
    this._authenticatedRequest({
        uri: env + '/categories/' + category_id + "/agents",
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getAgents = function(env, callback){
    this._authenticatedRequest({
        uri: env + '/agents',
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.searchAgents = function(options, env, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        country: options.country,
        culture: options.culture,
        q: options.query
    }));
    this._authenticatedRequest({
        uri: env + '/agents/search?' + qs,
        method: 'GET'
    }, callback)
}

//Accounts
CloudAgents.Client.prototype.getAllAccounts = function(options, env, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        agentId: options.agentId,
        customerUserId: options.customerUserId,
        skip: options.skip,
        take: options.take
    }));

    this._authenticatedRequest({
        uri: env + '/accounts?' + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getAccountsByAgent = function(options, agent_id, env, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        skip: options.skip,
        take: options.take
    }));
    this._authenticatedRequest({
        uri: env + '/agents/' + agent_id + '/accounts?' + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getAccount = function(account_id, env, callback){
    this._authenticatedRequest({
        uri: env + '/accounts/' + account_id,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.deleteAccount = function(account_id, env, callback){
    this._authenticatedRequest({
        uri: env + '/accounts/' + account_id,
        method: 'DELETE'
    }, callback)
}

CloudAgents.Client.prototype.createAccount = function(account, env, callback){
    this._authenticatedRequest({
        uri: env + '/accounts',
        method: 'POST',
        body: {
            'synchronize':true,
            'account': account
        }
    }, callback)
}

CloudAgents.Client.prototype.synchronizeAccount = function(account_id, user_id, env, callback){
    this._authenticatedRequest({
        uri: env + '/accounts/' + account_id + "/synchronizations",
        method: 'POST',
        body: {
            'customerAccountId': account_id,
            'customerUserId': user_id,
            'forced': false
        }
    }, callback)
}

CloudAgents.Client.prototype.searchAccounts = function(options, env, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        agentId: options.agentId,
        customerUserId: options.customerUserId,
        skip: options.skip,
        take: options.take
    }));
    this._authenticatedRequest({
        uri: env + '/accounts/search?' + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getSynchronizationsByAccount = function(options, account_id, env, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        startDate : options.startDate,
        endDate : options.endDate
    }));
    this._authenticatedRequest({
        uri: env + '/accounts/' + account_id + "/synchronizations?" + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getLastSynchronizationByAccount = function(account_id, env, callback){
    this._authenticatedRequest({
        uri: env + '/accounts/' + account_id + '/synchronizations/last',
        method: 'GET'
    }, callback)
}


