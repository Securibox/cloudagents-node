cloudagents-node
==============
[![NPM Version][npm-image]][npm-url]

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
client.getCategories(callback);

//list all agents
client.getAgents(callback);
//list agents by category
client.getAgentsByCategory(category_id, callback);
//search agents
client.searchAgents(options, callback);

//list all accounts
client.getAllAccounts(options, callback);
//list accounts by agent
client.getAllAccounts(options, agent_id, callback);
//create account
client.createAccount(account, callback);
//delete account
client.deleteAccount(account_id, callback);
//synchronize account
client.synchronizeAccount(account_id, user_id, callback);
//search account
client.searchAccounts(options, callback);

//get all syncrhonization for an account
client.getSynchronizationsByAccount(options, account_id, callback);
//get all syncrhonization for an account
client.getLastSynchronizationByAccount(account_id, callback);
```

All parameters except options are required. If the options parameter is omitted, the last argument to the function will be interpreted as the callback.


## Callbacks

All callbacks are in the form:
```javascript
function callback(err, response) {
  // err can be a network error or a Securibox API error.
}
```

## Examples
Collect invoices from DropBox:

```javascript
var cloudagents = require('cloudagents');

var environment = "https://api-cloudagents.securibox.eu/api/v1/";

// Initialize client
var client = new cloudagents.Client('api_username', 'api_password', environment);

//Account to create
var account = {
          customerAccountId: 'randomDropboxAccountID',
          customerUserId: 'UserABCD',
          name: 'John DropBox account',
          agentId: '5194a49d6d064d708ed004bc12709241', //Dropbox ID that you can get by listing all available agents
          credentials: [
              {
                  position: 0,
                  value: "mydropboxusername@test.com",
                  alg: null

              },
              {
                  position: 1,
                  value: "mydropboxpassword",
                  alg: null
              }
          ]  
        }

//Create account and launch synchronization
client.createAccount(account, function(err, res) {
    if (err != null) {
        console.error(err);
    } else {
        console.log(res);
    }
});

// Pool synchronization status to until we get a final status
var interval = setInterval(function(){
    client.getLastSynchronizationByAccount(account.customerAccountId, function(err, res){            
        eq(err, null);
            if(res.synchronizationState == CloudAgents.enums.synchronizationState.PendingAcknowledgement ||
                res.synchronizationState == CloudAgents.enums.synchronizationState.Completed ||
                res.synchronizationState == CloudAgents.enums.synchronizationState.ReportFailed){
                clearInterval(interval);
            }
    })
}, 10000);
```

## Tests

```console
$ make test
```

## License
[GNU GPL][3]

[1]: https://sca.securibox.eu
[2]: https://sca.securibox.eu/doc.html
[3]: https://github.com/Securibox/cloudagents-node/blob/master/LICENSE
[npm-image]: https://img.shields.io/badge/npm-0.0.1-brightgreen.svg
[npm-url]: https://npmjs.org/package/cloudagents