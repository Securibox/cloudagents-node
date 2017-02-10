'use strict';

var assert = require('assert');
var R = require('ramda');
var CloudAgents = require('../');

var eq = assert.strictEqual;

var environment = CloudAgents.environments.testenv;
var api_username = 'username';
var api_password = 'password';

var client = new CloudAgents.Client(api_username, api_password, environment);

describe('Categories', function() {
  it('List all categories', function(done) {
        client.getCategories(environment, function(err, res) {
            eq(err, null);

            assert(R.is(Array, res));

            done();
        });
    });
});

describe('Agents', function() {
  it('List all agents', function(done) {
      this.timeout(0);
        client.getAgents(environment, function(err, res) {
            eq(err, null);

            assert(R.is(Array, res));

            done();
        });
    });

    // it('Search agents by country [PT]', function(done) {
    //     this.timeout(0);
    //     var options = {
    //         country: "PT" 
    //     }
    //     client.searchAgents(options, environment, function(err, res) {
    //         eq(err, null);
    //         assert(R.is(Array, res));
    //         var frenchAgent = R.find(R.propEq('id', 'ea23933398ae41418b50b8097742346b'))(res);
    //         assert(frenchAgent == undefined, "A french agent has been found")
    //         done();
    //     });
    // });

    it('Search agents with culture [en-GB]', function(done) {
        this.timeout(0);
        var options = {
            culture: "en-GB" 
        }
        client.searchAgents(options, environment, function(err, res) {
            eq(err, null);
            assert(R.is(Array, res));
            assert(res[0].description.indexOf("pour collecter") == -1, "The detected culture is fr-FR")
            assert(res[0].description.indexOf("to collect") > -1, "The detected culture isn't en-GB")

            done();
        });
    });

    it('Get agents by category [Finance]', function(done) {
        client.getAgentsByCategory("c83e6fbc06433f54cea00d8bd6fb2395", environment, function(err, res) {
            eq(err, null);

            assert(R.is(Array, res));

            done();
        });
    });

});


describe('Accounts', function() {
    var user_id = "UserABCDE";
    var account_id = "AccountADBCDE";
    var agent_id = "959ad16ef0f9440aaaa3dfad90b25948";
    it('Create account BricoPrive', function(done) {
        this.timeout(0);
        var account = {
          customerAccountId: account_id,
          customerUserId: user_id,
          name: "Test BricoPrive",
          agentId: agent_id,
          credentials: [
              {
                  position: 0,
                  value: "username@test.com",
                  alg: null

              },
              {
                  position: 1,
                  value: "p@ssword",
                  alg: null
              }
          ]  
        }
        client.createAccount(account, environment, function(err, res) {
            eq(err, null);
            assert(R.is(Object, res));
            assert(res.agentId == agent_id && res.name == "Test BricoPrive", "The returned account is not correct.");
            done();
        });
    });

    it('Get BricoPrive account synchronization', function(done) {
        this.timeout(0);
        client.getLastSynchronizationByAccount(account_id, environment, function(err, res){
            eq(err, null);
            assert(R.is(Object, res));
            assert(res.customerAccountId == account_id && res.synchronizationStateDetails >= 0, "The synchronization isn't working.");
            done();
        });

    });


    it('Complete BricoPrive account synchronization', function(done) {
        this.timeout(300000)
        var interval = setInterval(function(){
            client.getLastSynchronizationByAccount(account_id, environment, function(err, res){            
                eq(err, null);
                if(res.synchronizationState == 5 ||
                    res.synchronizationState == 6 ||
                    res.synchronizationState == 7){
                        clearInterval(interval);
                        done();
                    }
            })
        }, 10000);
    });

    it('Delete BricoPrive account', function(done){
        this.timeout(0);
        client.deleteAccount(account_id, environment, function(err, res){
            eq(err, null);
            done();
        });
    });
});