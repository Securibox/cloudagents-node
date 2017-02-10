cloudagents-node
==============

A node.js client library for the [Securibox Cloud Agents API][1]

## Install
```console
$ npm install cloudagents
```

## Getting started
The module supports all Cloud Agents API endpoints. For complete information about the API, head to the [online documentation][2].

## endpoints

All endpoints require a valide username and password provided by the Securibox team to access.

```javascript
var cloudagents = require('cloudagents');

var client = new cloudagents.Client(api_username, api_password, cloudagents_env);
```

Once an instance of the client has been created you use the following methods:
```javascript
var cloudagents = require('cloudagents');

// Initialize client
var client = new cloudagents.Client(api_username, api_password, cloudagents_env);

//list all categories
client.getCategories(env, callback);

//list all agents
client.getAgents(env, callback);
//list agents by category
client.getAgentsByCategory(category_id, env, callback);
//search agents
client.searchAgents(options, env, callback);

//list all accounts
client.getAllAccounts(options, env, callback);
//list accounts by agent
client.getAllAccounts(options, agent_id, env, callback);
//create account
client.createAccount(account, env, callback);
//delete account
client.deleteAccount(account_id, env, callback);
//synchronize account
client.synchronizeAccount(account_id, user_id, env, callback);
//search account
client.searchAccounts(options, env, callback);

//get all syncrhonization for an account
client.getSynchronizationsByAccount(options, account_id, env, callback);
//get all syncrhonization for an account
client.getLastSynchronizationByAccount(account_id, env, callback);
```

All parameters except options are required. If the options parameter is omitted, the last argument to the function will be interpreted as the callback.


## Callbacks

All callbacks are in the form:
```javascript
function callback(err, response) {
  // err can be a network error or a Securibox API error.
}
```

[1]: https://sca.securibox.eu
[2]: https://sca.securibox.eu/doc.html