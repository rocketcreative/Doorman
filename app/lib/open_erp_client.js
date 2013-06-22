var xmlrpc = require('/xmlrpc')
		, username = 'admin'
		, pwd = '8T%FcWQDpr#t'
		, dbname = 'GreenCross'
		, uid = 1
    , client = null
		;

var makeClient = function(endpoint) {
  return xmlrpc.createClient({
      url: 'http://50.57.71.28:8069/xmlrpc/'+endpoint
    , username: username
    , password: pwd
  });
}

var exec = function(service, name, args, cb) {  
  client = makeClient('object');

	client
    .call('execute')
    .param(dbname)
    .param(uid)
    .param(pwd)
    .param(name)
    .param(service)
    .param(args)
    .end(function(res){
      var xmldata=Titanium.XML.parseString(res.text);
      var val = xmldata.documentElement.getElementsByTagName("int");
      var result = null;

      if(val.item(0)) {
        result = val.item(0).text;
      }
      cb(result);
    });
}

var login = function(usernm, pass, cb) {  
  client = makeClient('common');

  client
    .call('login')
    .param(dbname)
    .param(usernm)
    .param(pass)
    .end(function(res){
      var xmldata=Titanium.XML.parseString(res.text);
      var val = xmldata.documentElement.getElementsByTagName("int");
      if(val.item(0)) {
        uid = val.item(0).text;
      }
      cb(uid);
    });
}

module.exports = {exec: exec, login: login};
