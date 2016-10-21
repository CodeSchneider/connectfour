module.exports = {

  'renderHomePage': function(req,res,next) {
    sails.log.info('HomepageController: rendering homepage');
    return res.view('homepage');
  }

}
