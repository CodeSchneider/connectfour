
module.exports = {

  updateTable: function(cb) {
    sails.sockets.blast('updateTable', {});
    return cb();
  }

}
