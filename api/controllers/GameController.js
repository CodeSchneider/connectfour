module.exports = {

  'create': function(req,res,next) {
    sails.log.info('GameController: creating new game');
    Game.create().exec(function(err,createdGame){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      return res.send(200, { id: createdGame.id });
    });
  },

  'addMove': function(req,res,next) {
    sails.log.info('GameController: adding move for a particular game');
    var gameId = req.param('gameId');
    Game.findOne( { id: gameId } ).exec(function(err,foundGame){
      if (err) {
        sails.log.error(err);
        return res.send(500);
      }
      if (!foundGame) {
        sails.log.error('Game not found');
        return res.send(500);
      }
      GameService.addMove(foundGame,req.allParams(),function(err,addedMove){
        if (err) {
          sails.log.error('There was a problem adding the move to the game');
          return res.send(500);
        }
        return res.send(200, {});
      });
    });
  }

}
