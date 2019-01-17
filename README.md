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

## Endpoints

All endpoints require a valid authentication strategy provided by the Securibox team to access (basic or bearer/JWT).

```javascript
var CloudAgents = require('cloudagents');

var client = new CloudAgents.Client(cloudagents_env);
var authStrategy = new CloudAgents.BasicStrategy(api_username, api_password);
//or authStrategy = new CloudAgents.BearerStrategy("[token]");
client.use(authStrategy);

```

Once an instance of the client has been created you use the following methods:
```javascript
var CloudAgents = require('cloudagents');

// Initialize client
var client = new CloudAgents.Client(cloudagents_env);

// Initialize authentication strategy
var authStrategy = new CloudAgents.BasicStrategy(api_username, api_password);

// Bind authentication strategy to client
client.use(authStrategy);

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
//modify account
client.modifyAccount(account_id, account, callback);
//delete account
client.deleteAccount(account_id, callback);
//synchronize account
client.synchronizeAccount(account_id, user_id, callback);
//search account
client.searchAccounts(options, callback);

//search synchronizations
client.searchSynchronizations(options, callback)
//get all syncrhonization for an account
client.getSynchronizationsByAccount(options, account_id, callback);
//get all syncrhonization for an account
client.getLastSynchronizationByAccount(account_id, callback);
//acknowledge synchronization by account
client.acknowledgeSynchronizationForAccount(account_id, acknowledgement, callback);


//search documents by account, user, pending with or without content
client.searchDocuments(options, callback);
//get a specific downloaded document
client.getDocument(document_id, callback);
//acknowledge the reception of a specific document
client.acknowledgeDocumentDelivery(document_id, callback);
//get documents by account id
client.getDocumentsByAccount(options, account_id, callback);

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
var CloudAgents = require('cloudagents');

var environment = "https://sca-multitenant-prod.securibox.eu/api/v1/";

// Initialize client
var client = new CloudAgents.Client(environment);
var basicAuthentication = new CloudAgents.BasicStrategy('api_username', 'api_password');
client.use(basicAuthentication);

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
			if(res.synchronizationState == CloudAgents.Constants.synchronizationState.PendingAcknowledgement ||
				res.synchronizationState == CloudAgents.Constants.synchronizationState.Completed ||
				res.synchronizationState == CloudAgents.Constants.synchronizationState.ReportFailed){
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