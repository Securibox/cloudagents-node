"use strict";

var querystring = require('querystring');
var R = require('ramda');
var request = require('request');

//var CloudAgents = module.exports = {};

/**
 * `Client` constructor.
 *
 * @api public
 */
function Client (env) {
    this._env = env;
    this._strategy = null;
    this._authorizationHeader = null;
  }

Client.enums = {
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
};



Client.prototype.use = function(strategy){
    if(R.isNil(strategy)){
        throw new Error('A strategy must be defined');
    }
    delete this._strategy;
    this._strategy = strategy;
};

Client.prototype._authenticatedRequest = function(options, callback) {
    if(R.isNil(this._strategy)){
        throw new Error('A strategy must be defined');
    }

    if(R.isNil(this._authorizationHeader)){
        this._authorizationHeader = this._strategy.getAuthorization();
    }

    let authorizationheader = this._strategy.getAuthorization();
    let $requestOptions = {
        uri: options.uri,
        method: options.method,
        json: true,
        headers : {
            "Authorization" : this._authorizationHeader
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
Client.prototype.getCategories = function(options, callback){
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    if(!options){
        options = {
            culture: null
        };
    }
    var isNullValue = function(val, key) { return !R.isNil(val); };
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        culture: options.culture,
    }));
    this._authenticatedRequest({
        uri: this._env + '/categories',
        method: 'GET'
    }, callback);
};

//Agents
Client.prototype.getAgentsByCategory = function(category_id, callback){
    this._authenticatedRequest({
        uri: this._env + '/categories/' + category_id + "/agents",
        method: 'GET'
    }, callback);
};

Client.prototype.getAgents = function(options, callback){
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    if(!options){
        options = {
            includeLogo: null,
            culture: null
        };
    }
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        includeLogo: options.includeLogo,
        culture: options.culture,
    }));
    this._authenticatedRequest({
        uri: this._env + '/agents?' + qs,
        method: 'GET'
    }, callback);
};

Client.prototype.searchAgents = function(options, callback){
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        country: options.country,
        culture: options.culture,
        q: options.query
    }));
    this._authenticatedRequest({
        uri: this._env + '/agents/search?' + qs,
        method: 'GET'
    }, callback);
};

//Accounts
Client.prototype.getAllAccounts = function(options, callback){
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        agentId: options.agentId,
        customerUserId: options.customerUserId,
        skip: options.skip,
        take: options.take
    }));

    this._authenticatedRequest({
        uri: this._env + '/accounts?' + qs,
        method: 'GET'
    }, callback);
};

Client.prototype.getAccountsByAgent = function(options, agent_id, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        skip: options.skip,
        take: options.take
    }));
    this._authenticatedRequest({
        uri: this._env + '/agents/' + agent_id + '/accounts?' + qs,
        method: 'GET'
    }, callback);
};

Client.prototype.getAccount = function(account_id, callback){
    this._authenticatedRequest({
        uri: this._env + '/accounts/' + account_id,
        method: 'GET'
    }, callback);
};

Client.prototype.deleteAccount = function(account_id, callback){
    this._authenticatedRequest({
        uri: this._env + '/accounts/' + account_id,
        method: 'DELETE'
    }, callback);
};

Client.prototype.createAccount = function(account, callback){
    this._authenticatedRequest({
        uri: this._env + '/accounts',
        method: 'POST',
        body: {
            'synchronize':true,
            'account': account
        }
    }, callback);
};


Client.prototype.modifyAccount = function(account_id, account, callback){
    this._authenticatedRequest({
        uri: this._env + '/accounts/' + account_id,
        method: 'PUT',
        body: account
    }, callback);
};

Client.prototype.synchronizeAccount = function(account_id, user_id, isforced, callback){
    this._authenticatedRequest({
        uri: this._env + '/accounts/' + account_id + "/synchronizations",
        method: 'POST',
        body: {
            'customerAccountId': account_id,
            'customerUserId': user_id,
            'forced': isforced
        }
    }, callback);
};

Client.prototype.searchAccounts = function(options, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        agentId: options.agentId,
        customerUserId: options.customerUserId,
        skip: options.skip,
        take: options.take
    }));
    this._authenticatedRequest({
        uri: this._env + '/accounts/search?' + qs,
        method: 'GET'
    }, callback)
}

Client.prototype.getSynchronizationsByAccount = function(options, account_id, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        startDate : options.startDate,
        endDate : options.endDate
    }));
    this._authenticatedRequest({
        uri: this._env + '/accounts/' + account_id + "/synchronizations?" + qs,
        method: 'GET'
    }, callback)
}

Client.prototype.getLastSynchronizationByAccount = function(account_id, callback){
    this._authenticatedRequest({
        uri: this._env + '/accounts/' + account_id + '/synchronizations/last',
        method: 'GET'
    }, callback);
};


Client.prototype.getDocument = function(document_id, callback){
    this._authenticatedRequest({
        uri: this._env + '/documents/' + document_id,
        method: 'GET'
    }, callback);
};

Client.prototype.searchDocuments = function(options, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); }
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        customerAccountId : options.customerAccountId,
        customerUserId: options.customerUserId,
        pendingOnly : options.pendingOnly,
        includeContent : options.includeContent
    }));
    this._authenticatedRequest({
        uri: this._env + '/documents/search?' + qs,
        method: 'GET'
    }, callback);
};

Client.prototype.getDocumentsByAccount = function(options, account_id, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); };
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        pendingOnly : options.pendingOnly,
        includeContent: options.includeContent
    }));
    this._authenticatedRequest({
        uri: this._env + '/accounts/' + account_id + '/documents?' + qs,
        method: 'GET'
    }, callback);
};

Client.prototype.acknowledgeDocumentDelivery = function(document_id, callback){
    this._authenticatedRequest({
        uri: this._env + '/documents/' + document_id + '/ack',
        method: 'PUT',
        body: document_id
    }, callback);
};


Client.prototype.acknowledgeSynchronizationForAccount = function(account_id, acknowledgement, callback){
    this._authenticatedRequest({
        uri: this._env + '/synchronizations/' + account_id + '/ack',
        method: 'PUT',
        body: acknowledgement
    }, callback);
};


Client.prototype.searchSynchronizations = function(options, callback){
    var isNullValue = function(val, key) { return !R.isNil(val); };
    var qs = querystring.stringify(R.pickBy(isNullValue, {
        customerAccountId : options.query.customerAccountId,
        customerUserId : options.query.customerUserId,
        startDate : options.query.startDate,
        endDate : options.query.endDate,
        skip : options.query.skip,
        take : options.query.take
    }));
    this._authenticatedRequest({
        uri: this._env + '/synchronizations/search?' + qs,
        method: 'GET'
    }, callback);
};


/**
 * Expose `Client`.
 */
module.exports = Client;