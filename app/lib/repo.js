module.exports = (function() {
  //+ @deftype UID = Int

  var open_erp = require('/open_erp_client')
    , Promise = require("/support/promise")
    ;

  //+ login :: String -> String -> Promise(Maybe(UID))
  var login = function(username, password) {
        var promise = new Promise();

        open_erp.login(username, password, function(res) {
          Ti.API.info(res);
          promise.resolve(Either("Invalid Login", res));
        });

        return promise;
      }

  //+ findByDriversLicense :: String -> Promise(UID|Null)
    , findByDriversLicense = function(dl) {
        var promise = new Promise()
          , args = [['driver_license', '=', dl]];

        open_erp.exec('search', 'res.partner', args, function(res) {
          Ti.API.info(res);
          promise.resolve(res);
        });

        return promise;
      }


  return { login: login
         , findByDriversLicense: findByDriversLicense
         };

})();
