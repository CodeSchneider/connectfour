var uuid = require('node-uuid');

module.exports = {

  autoPK: false,

  attributes: {

    id: {
        type: 'string',
        primaryKey: true,
        defaultsTo: function (){ return uuid.v4(); },
        unique: true,
        index: true,
        uuidv4: true
    },

    //game has many moves
    moves: {
      collection: 'Move',
      via: 'game'
    },

    userWon: {
      type: 'boolean',
      defaultsTo: false
    },

    computerWon: {
      type: 'boolean',
      defaultsTo: false
    },

    isFull: {
      type: 'boolean',
      defaultsTo: false
    },

    gameDone: {
      type: 'boolean',
      defaultsTo: false
    }

  }

}
