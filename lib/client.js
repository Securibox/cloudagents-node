
import * as R from 'ramda';
import axios from 'axios';


/**
 * `Client` constructor.
 *
 * @api public
 */
class Client {
    constructor(env) {
        this._env = env;
        this._strategy = null;
        this._authorizationHeader = null;
    }

    static enums = {
        synchronizationState: {
            NewAccount: 0,
            Created: 1,
            Running: 2,
            AgentFailed: 3,
            Delivering: 4,
            PendingAcknowledgement: 5,
            Completed: 6,
            ReportFailed: 7
        },
        synchronizationStateDetails: {
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
            AdditionalAuthenticationRequired: 15,
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

    use(strategy) {
        if (R.isNil(strategy)) {
            throw new Error('A strategy must be defined');
        }
        this._strategy = strategy;
        this._authorizationHeader = null;  // Reset the authorization header
    }

    async _authenticatedRequest(options, callback) {
        if (R.isNil(this._strategy)) {
            throw new Error('A strategy must be defined');
        }

        if (R.isNil(this._authorizationHeader)) {
            this._authorizationHeader = this._strategy.getAuthorization();
        }

        const fetchOptions = {
            method: options.method,
            url: options.uri,
            headers: {
                'Authorization': this._authorizationHeader,
                'Content-Type': 'application/json'
            },
        };

        if (R.isNotNil(options.body)) {
            fetchOptions.data = options.body;
        }

        try {
            const response = await axios(fetchOptions);
            if (response.status < 200 || response.status >= 300) {
                throw { statusCode: response.status, ...response.data };
            }
            const data = response.data;
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    }

    // Categories
    getCategories(options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        if (!options) {
            options = {
                culture: null
            };
        }
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            culture: options.culture,
        }));
        this._authenticatedRequest({
            uri: this._env + '/categories',
            method: 'GET'
        }, callback);
    }

    // Agents
    getAgentsByCategory(category_id, callback) {
        this._authenticatedRequest({
            uri: this._env + '/categories/' + category_id + "/agents",
            method: 'GET'
        }, callback);
    }

    getAgents(options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        if (!options) {
            options = {
                includeLogo: null,
                culture: null
            };
        }

        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            includeLogo: options.includeLogo,
            culture: options.culture,
        }));
        this._authenticatedRequest({
            uri: this._env + '/agents?' + query,
            method: 'GET'
        }, callback);
    }

    searchAgents(options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            country: options.country,
            culture: options.culture,
            q: options.query
        }));
        this._authenticatedRequest({
            uri: this._env + '/agents/search?' + query,
            method: 'GET'
        }, callback);
    }

    // Accounts
    getAllAccounts(options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = undefined;
        }
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            agentId: options.agentId,
            customerUserId: options.customerUserId,
            skip: options.skip,
            take: options.take
        }));

        this._authenticatedRequest({
            uri: this._env + '/accounts?' + query,
            method: 'GET'
        }, callback);
    }

    getAccountsByAgent(options, agent_id, callback) {
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            skip: options.skip,
            take: options.take
        }));
        this._authenticatedRequest({
            uri: this._env + '/agents/' + agent_id + '/accounts?' + query,
            method: 'GET'
        }, callback);
    }

    getAccount(account_id, callback) {
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id,
            method: 'GET'
        }, callback);
    }

    deleteAccount(account_id, callback) {
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id,
            method: 'DELETE'
        }, callback);
    }

    createAccount(account, callback) {
        this._authenticatedRequest({
            uri: this._env + '/accounts',
            method: 'POST',
            body: {
                'synchronize': true,
                'account': account
            }
        }, callback);
    }

    modifyAccount(account_id, account, callback) {
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id,
            method: 'PUT',
            body: account
        }, callback);
    }

    synchronizeAccount(account_id, user_id, isforced, callback) {
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id + "/synchronizations",
            method: 'POST',
            body: {
                'customerAccountId': account_id,
                'customerUserId': user_id,
                'forced': isforced
            }
        }, callback);
    }

    sendMFACode(account_id, code, callback) {
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id + "/mfa",
            method: 'POST',
            body: {
                'customerAccountId': account_id,
                'sbxSecretCode': code
            }
        }, callback);
    }

    searchAccounts(options, callback) {
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            agentId: options.agentId,
            customerUserId: options.customerUserId,
            skip: options.skip,
            take: options.take
        }));
        this._authenticatedRequest({
            uri: this._env + '/accounts/search?' + query,
            method: 'GET'
        }, callback);
    }

    getSynchronizationsByAccount(options, account_id, callback) {
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            startDate: options.startDate,
            endDate: options.endDate
        }));
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id + "/synchronizations?" + query,
            method: 'GET'
        }, callback);
    }

    getLastSynchronizationByAccount(account_id, callback) {
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id + '/synchronizations/last',
            method: 'GET'
        }, callback);
    }

    getDocument(document_id, callback) {
        this._authenticatedRequest({
            uri: this._env + '/documents/' + document_id,
            method: 'GET'
        }, callback);
    }

    searchDocuments(options, callback) {
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            customerAccountId: options.customerAccountId,
            customerUserId: options.customerUserId,
            pendingOnly: options.pendingOnly,
            includeContent: options.includeContent
        }));
        this._authenticatedRequest({
            uri: this._env + '/documents/search?' + query,
            method: 'GET'
        }, callback);
    }

    getDocumentsByAccount(options, account_id, callback) {
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            pendingOnly: options.pendingOnly,
            includeContent: options.includeContent
        }));
        this._authenticatedRequest({
            uri: this._env + '/accounts/' + account_id + '/documents?' + query,
            method: 'GET'
        }, callback);
    }

    acknowledgeDocumentDelivery(document_id, callback) {
        this._authenticatedRequest({
            uri: this._env + '/documents/' + document_id + '/ack',
            method: 'PUT',
            body: document_id
        }, callback);
    }

    acknowledgeSynchronizationForAccount(account_id, acknowledgement, callback) {
        this._authenticatedRequest({
            uri: this._env + '/synchronizations/' + account_id + '/ack',
            method: 'PUT',
            body: acknowledgement
        }, callback);
    }

    searchSynchronizations(options, callback) {
        const query = new URLSearchParams(R.pickBy(R.isNotNil, {
            customerAccountId: options.query.customerAccountId,
            customerUserId: options.query.customerUserId,
            startDate: options.query.startDate,
            endDate: options.query.endDate,
            skip: options.query.skip,
            take: options.query.take
        }));
        this._authenticatedRequest({
            uri: this._env + '/synchronizations/search?' + query,
            method: 'GET'
        }, callback);
    }
}

/**
 * Expose `Client`.
 */
// module.exports = Client;
export default Client;
