module.exports = {

  'update': function(req,res,next) {
    console.log('params: ',req.allParams());
    return res.send(200, {});
  }

}
