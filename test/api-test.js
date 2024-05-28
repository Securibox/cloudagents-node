import assert from 'node:assert/strict';
import * as R from 'ramda';
import CloudAgents from '../lib/index.js';

const eq = assert.strictEqual;

const environment = 'https://sca-testenv.securibox.eu/api/v1';
const api_username = 'username';
const api_password = 'password';


const strategy = new CloudAgents.BasicStrategy(api_username, api_password);
const client = new CloudAgents.Client(environment);
client.use(strategy);

describe('Categories', function () {
    it('List all categories', function (done) {
        client.getCategories(function (err, res) {
            console.log(err);
            eq(err, null);
            assert(R.is(Array, res));

            done();
        });
    });
});

describe('Agents', function () {
    it('List all agents', function (done) {
        this.timeout(0);
        client.getAgents(function (err, res) {
            eq(err, null);

            assert(R.is(Array, res));

            done();
        });
    });

    // it('Search agents by country [PT]', function(done) {
    //     this.timeout(0);
    //     let options = {
    //         country: "PT" 
    //     }
    //     client.searchAgents(options, function(err, res) {
    //         eq(err, null);
    //         assert(R.is(Array, res));
    //         let frenchAgent = R.find(R.propEq('id', 'ea23933398ae41418b50b8097742346b'))(res);
    //         assert(frenchAgent == undefined, "A french agent has been found")
    //         done();
    //     });
    // });

    it('Search agents with culture [en-GB]', function (done) {
        this.timeout(0);
        const options = {
            culture: "en-GB"
        };
        client.searchAgents(options, function (err, res) {
            eq(err, null);
            assert(R.is(Array, res));
            assert(res[0].description.indexOf("pour collecter") == -1, "The detected culture is fr-FR");
            assert(res[0].description.indexOf("to collect") > -1, "The detected culture isn't en-GB");

            done();
        });
    });

    it('Get agents by category [Finance]', function (done) {
        client.getAgentsByCategory("c83e6fbc06433f54cea00d8bd6fb2395", function (err, res) {
            eq(err, null);
            assert(R.is(Array, res));
            done();
        });
    });

});


describe('Accounts', function () {
    let user_id = "UserABCDE";
    let d = new Date();
    let account_id = "AccountADBCDE" + d.getTime();
    let agent_id = "2ac0260f256e4d9fad963ac769b084cd";
    let account_name = "Test Prixtel";
    it('Create account Prixtel', function (done) {
        this.timeout(0);
        let account = {
            customerAccountId: account_id,
            customerUserId: user_id,
            name: account_name,
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
        };
        client.createAccount(account, function (err, res) {
            eq(err, null);
            assert(R.is(Object, res));
            assert(res.agentId == agent_id && res.name == account_name, "The returned account is not correct.");
            done();
        });
    });

    it('Get PrixTel account synchronization', function (done) {
        this.timeout(0);
        client.getLastSynchronizationByAccount(account_id, function (err, res) {
            eq(err, null);
            assert(R.is(Object, res));
            assert(res.customerAccountId == account_id && res.synchronizationStateDetails >= 0, "The synchronization isn't working.");
            done();
        });

    });


    it('Complete PrixTel account synchronization', function (done) {
        this.timeout(300000);
        let interval = setInterval(function () {
            client.getLastSynchronizationByAccount(account_id, function (err, res) {
                eq(err, null);
                if (res.synchronizationState == CloudAgents.Constants.synchronizationState.PendingAcknowledgement ||
                    res.synchronizationState == CloudAgents.Constants.synchronizationState.Completed ||
                    res.synchronizationState == CloudAgents.Constants.synchronizationState.ReportFailed) {
                    clearInterval(interval);
                    done();
                }
            });
        }, 10000);
    });

    it('Delete PrixTel account', function (done) {
        this.timeout(0);
        client.deleteAccount(account_id, function (err, res) {
            eq(err, null);
            done();
        });
    });
});
