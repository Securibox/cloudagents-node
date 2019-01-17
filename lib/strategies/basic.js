var R = require('ramda');
var util = require('util');
var Strategy = require('./strategy');

/**
 * `BasicStrategy` constructor.
 *
 * @api public
 */
function BasicStrategy(username, secret){
    if (R.isNil(username)) {
        throw new Error('Missing "username"');
      }
    
    if (R.isNil(secret)) {
        throw new Error('Missing "secret"');
    }
    Strategy.call(this);

    this.name = 'Basic';
    this.username = username;
    this.secret = secret;
}

util.inherits(BasicStrategy, Strategy);

/**
 * Gets the basic authorization header
 *
 * The authorization header is generated using the username and password
 * in base64 encoding of id and password joined by a colon.
 *
 * @param {Object} [options] Strategy-specific options.
 * @api public
 */
BasicStrategy.prototype.getAuthorization = function(options) {
    return "Basic " + Buffer.from(this.username + ":" + this.secret).toString("base64");
};

/**
 * Expose `BasicStrategy`.
 */
module.exports = BasicStrategy;