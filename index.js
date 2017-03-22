'use strict';

var querystring = require('querystring');
var R = require('ramda');
var request = require('request');

var CloudAgents = module.exports = {};

CloudAgents.enums = {
    synchronizationState:{
        NewAccount: 0,
        Created: 1,
        Running: 2,
        AgentFailed: 3,
        Delivering: 4,
        PendingAcknowledgement: 5,
        Completed: 6,
        ReportFailed: 7
    },
    synchronizationStateDetails:{
        NewAccount: 1,
        Completed: 2,
        CompletedNothingToDownload: 3,
        CompletedNothingNewToDownload: 4,
        CompletedWithMissingDocs: 5,
        CompletedWithErrors: 6,
        WrongCredentials: 7,
        UnexpectedAccountData: 8,
        Scheduled: 9,
        Pending: 10,
        InProgress: 11,
        DematerialisationNeeded: 12,
        CheckAccount: 13,
        AccountBlocked: 14,
        AdditionalAuthenticationRequired:15,
        LoginPageChanged: 16,
        WelcomePageChanged: 17,
        WebsiteInMaintenance: 18,
        WebsiteChanged: 19,
        ResetPasswordWarning: 20,
        ResetPasswordRequired: 21,
        ServerUnavailable: 22,
        PersonalNotification: 23,
        TemporaryServerError: 24,
        CaptchaFound: 25
    }
}

CloudAgents.Client = function(username, secret, env) {
  if (R.isNil(username)) {
    throw new Error('Missing "username"');
  }

  if (R.isNil(secret)) {
    throw new Error('Missing "secret"');
  }

  if (R.isNil(secret)) {
    throw new Error('Missing "env"');
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
CloudAgents.Client.prototype.getCategories = function(callback){
    this._authenticatedRequest({
        uri: this.env + '/categories',
        method: 'GET'
    }, callback)
}

//Agents
CloudAgents.Client.prototype.getAgentsByCategory = function(category_id, callback){
    this._authenticatedRequest({
        uri: this.env + '/categories/' + category_id + "/agents",
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getAgents = function(callback){
    this._authenticatedRequest({
        uri: this.env + '/agents',
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.searchAgents = function(options, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        country: options.country,
        culture: options.culture,
        q: options.query
    }));
    this._authenticatedRequest({
        uri: this.env + '/agents/search?' + qs,
        method: 'GET'
    }, callback)
}

//Accounts
CloudAgents.Client.prototype.getAllAccounts = function(options, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        agentId: options.agentId,
        customerUserId: options.customerUserId,
        skip: options.skip,
        take: options.take
    }));

    this._authenticatedRequest({
        uri: this.env + '/accounts?' + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getAccountsByAgent = function(options, agent_id, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        skip: options.skip,
        take: options.take
    }));
    this._authenticatedRequest({
        uri: this.env + '/agents/' + agent_id + '/accounts?' + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getAccount = function(account_id, callback){
    this._authenticatedRequest({
        uri: this.env + '/accounts/' + account_id,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.deleteAccount = function(account_id, callback){
    this._authenticatedRequest({
        uri: this.env + '/accounts/' + account_id,
        method: 'DELETE'
    }, callback)
}

CloudAgents.Client.prototype.createAccount = function(account, callback){
    this._authenticatedRequest({
        uri: this.env + '/accounts',
        method: 'POST',
        body: {
            'synchronize':true,
            'account': account
        }
    }, callback)
}

CloudAgents.Client.prototype.synchronizeAccount = function(account_id, user_id, callback){
    this._authenticatedRequest({
        uri: this.env + '/accounts/' + account_id + "/synchronizations",
        method: 'POST',
        body: {
            'customerAccountId': account_id,
            'customerUserId': user_id,
            'forced': false
        }
    }, callback)
}

CloudAgents.Client.prototype.searchAccounts = function(options, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        agentId: options.agentId,
        customerUserId: options.customerUserId,
        skip: options.skip,
        take: options.take
    }));
    this._authenticatedRequest({
        uri: this.env + '/accounts/search?' + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getSynchronizationsByAccount = function(options, account_id, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        startDate : options.startDate,
        endDate : options.endDate
    }));
    this._authenticatedRequest({
        uri: this.env + '/accounts/' + account_id + "/synchronizations?" + qs,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.getLastSynchronizationByAccount = function(account_id, callback){
    this._authenticatedRequest({
        uri: this.env + '/accounts/' + account_id + '/synchronizations/last',
        method: 'GET'
    }, callback)
}


CloudAgents.Client.prototype.getDocument = function(document_id, callback){
    this._authenticatedRequest({
        uri: this.env + '/documents/' + document_id,
        method: 'GET'
    }, callback)
}

CloudAgents.Client.prototype.searchDocuments = function(options, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        customerAccountId : options.customerAccountId,
        customerUserId: options.customerUserId,
        pendingOnly : options.pendingOnly,
        includeContent : options.includeContent
    }));
    this._authenticatedRequest({
        uri: this.env + '/documents/search?' + qs,
        method: 'GET'
    }, callback)
}


