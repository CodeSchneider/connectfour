module.exports = {

  addMove: function(game, params, cb) {
    console.log('GAME: ',game);
    console.log('PARAMS: ',params);
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
  }

}
