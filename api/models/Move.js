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

    //move belongs to a game
    game: {
      model: 'Game'
    },

    userType: {
      type: 'string'
    }

  }

}
