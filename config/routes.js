
module.exports.routes = {

  //HOMEPAGE CONTROLLER
  'GET /': {controller: 'HomepageController', action: 'renderHomePage'},

  //GAME CONTROLLER
  'GET /game/create': {controller: 'GameController', action: 'create'},
  'POST /game/:gameId/addMove': {controller: 'GameController', action: 'addMove'},
  'GET /game/lastTen': {controller: 'GameController', action: 'getLastTenResults'}

};
