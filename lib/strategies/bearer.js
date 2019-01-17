var R = require('ramda');
var util = require('util');
var Strategy = require('./strategy');

/**
 * `BearerStrategy` constructor.
 *
 * @api public
 */
function BearerStrategy(token){
    if (R.isNil(token)) {
        throw new Error('Missing "token"');
    }
    Strategy.call(this);

    this.name = 'Bearer';
    this.token = token;
}

util.inherits(BearerStrategy, Strategy);

/**
 * Gets the basic authorization header
 *
 * The authorization header is generated using the username and password
 * in base64 encoding of id and password joined by a colon.
 *
 * @param {Object} [options] Strategy-specific options.
 * @api public
 */
BearerStrategy.prototype.getAuthorization = function(options) {
    return "Bearer " + this.token;
};


/**
 * Expose `BasicStrategy`.
 */
module.exports = BearerStrategy;
