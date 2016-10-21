var _ = require('lodash');
var moment = require('moment');

module.exports = {

  addMove: function(game, params, cb) {
    if (params.userWon) {
      Move.create( { game: game.id, userType: params.currBoard.turn } ).exec(function(err,createdMove){
        if (err) {
          return cb(err,null);
        }
        Game.update( { id: game.id }, { userWon: true, gameDone: true } ).exec(function(err,updatedGame){
          if (err) {
            return cb(err,null);
          }
          // NotificationService.updateTable...
          return cb(null,updatedGame);
        });
      })
    } else if (params.computerWon) {
      Move.create( { game: game.id, userType: params.currBoard.turn } ).exec(function(err,createdMove){
        if (err) {
          return cb(err,null);
        }
        Game.update( { id: game.id }, { computerWon: true, gameDone: true } ).exec(function(err,updatedGame){
          if (err) {
            return cb(err,null);
          }
          // NotificationService.updateTable...
          return cb(null,updatedGame);
        });
      });
    } else if (params.isFull) {
      Move.create( { game: game.id, userType: params.currBoard.turn } ).exec(function(err,createdMove){
        if (err) {
          return cb(err,null);
        }
        Game.update( { id: game.id }, { isFull: true, gameDone: true } ).exec(function(err,updatedGame){
          if (err) {
            return cb(err,null);
          }
          // NotificationService.updateTable...
          return cb(null,updatedGame);
        });
      });
    } else {
      Move.create( { game: game.id, userType: params.currBoard.turn } ).exec(function(err,createdMove){
        if (err) {
          return cb(err,null);
        }
        return cb(null,createdMove);
      });
    }
  },

  massageGameDataForTable: function(games, cb) {
    var massagedGames = [];
    _.forEach(games, function(game) {
      var victor;
      if (game.userWon) {
        victor = 'Human';
      } else if (game.computerWon) {
        victor = 'Computer';
      } else {
        victor = 'Tied';
      }
      var obj = {
        victor: victor,
        movesNum: game.moves.length,
        time: moment(game.updatedAt).format("ddd, MMMM Do, h:mm a")
      }
      massagedGames.push(obj);
    });
    return cb(massagedGames);
  }

}
