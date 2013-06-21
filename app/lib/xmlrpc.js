/**
 * XML-RPC client for Titanium Mobile.
 * API is inspired from visionmedia's superagent.
 * 
 * @author nulltask <nulltask@gmail.com>
 * @license MIT License
 */

var noop = function() {};

/**
 * TODO: Add support for serialize TiBlob.
 * TODO: Add support for deserialize dateTime.
 */

/**
 * `console` aliases.
 */

if (!this.console) {
  if (Titanium) {
    console = {
      log: Ti.API.debug
    , info: Ti.API.info
    , warn: Ti.API.warn
    , error: Ti.API.error
    };
  } else {
    console = { log: noop, warn: noop, info: noop, error: noop };
  }
}

/**
 * Expose `version`.
 */

exports.version = '0.0.1';

/**
 * Expose `Client`.
 */

exports.Client = Client;

/**
 * Expose `Request`
 */

exports.Request = Request;

/**
 * Expose `Response`
 */

exports.Response = Response;

/**
 * Expose `Serializer`
 */

exports.Serializer = Serializer;

/**
 * Expose `Deserializer`
 */

exports.Deserializer = Deserializer;

/**
 * Expose `createClient`.
 */

exports.createClient = function(options) {
  return new Client(options);
};

/**
 * `Client` constructor.
 * 
 * @param {Object} options
 */

function Client(options) {
  if (!(this instanceof Client)) {
    return new Client(options);
  }
  
  this.url = options.url;
  this.username = options.username;
  this.password = options.password;
}

/**
 * Call method.
 * 
 * @param {String} method
 * @return {Request}
 */

Client.prototype.call = function(method) {
  var options = { url: this.url, method: method };
  
  if (this.username && this.password) {
    options.username = this.username;
    options.password = this.password;
  }
  
  return new Request(options);
};

/**
 * `Response` constructor.
 * 
 * @param {HTTPClient} xhr
 * @param {Object} options
 */

function Response(xhr, options) {
  var deserializer = new Deserializer(xhr.responseXML.documentElement);
  
  Emitter.call(this);

  this.xhr = xhr;
  this.body = deserializer.getBody();
  this.text = xhr.responseText;
}

/**
 * Inherits from `Emitter`.
 */

Response.prototype.__proto__ = Emitter.prototype;

/**
 * `Request` constructor.
 * 
 * @param {Object} options
 */

function Request(options) {
  var self = this;
  
  Emitter.call(this);
  
  this.settings = {};
  for (var i in options) {
    this.settings[i] = options[i];
  }
  
  this.on('end', function() {
    self.callback(new Response(self.xhr));
  });
  
  this.serializer = new Serializer(this.get('method'));
}

/**
 * Inherits from `Emitter`
 */

Request.prototype.__proto__ = Emitter.prototype;

/**
 * Getter for setting value.
 * 
 * @param {String} key
 * @return {Mixed}
 */

Request.prototype.get = function(key) {
  return this.settings[key];
};

/**
 * Setter for setting value.
 * 
 * @param {String} key
 * @param {Mixed} val
 * @return {Request} for chain.
 */

Request.prototype.set = function(key, val) {
  this.settings[key] = val;
  return this;
};

/**
 * Add parameter.
 * 
 * @param {Mixed} data
 * @return {Request} for chain.
 */

Request.prototype.param = function(data) {
  this.serializer.add(data);
  return this;
};

/**
 * Remote procedure call.
 * 
 * @param {Function} fn
 * @return {Request} for chain
 */

Request.prototype.end = function(fn) {
  var self = this
    , xhr = this.xhr = Ti.Network.createHTTPClient();
    
  this.callback = fn || noop;
  
  xhr.onreadystatechange = function() {
    if (4 === xhr.readyState) {
      console.log('res: ' + xhr.responseText);
      self.emit('end');
    }
  }
  
  xhr.open('POST', this.get('url'), true);
  
  if (this.get('username') && this.get('password')) {
    var auth = Ti.Utils.base64encode(this.get('username') + ':' + this.get('password'))
    xhr.setRequestHeader('Authorization', 'Basic ' + auth);
  }
  
  console.log('req: ' + this.serializer.getBody());
  xhr.send(this.serializer.getBody());
  
  return this;
};

/**
 * XML-RPC request serializer.
 * 
 * @param {String} method
 * @param {Array} params
 */

function Serializer(method, params) {
  this.method = method;
  this.params = params || [];
}

/**
 * Add parameter.
 * 
 * @param {Mixed} param
 * @return {Serializer} for chain
 */

Serializer.prototype.add = function(param) {
  this.params.push(param);
  return this;
};

/**
 * Serialize added parameters.
 * 
 * @return {String}
 */

Serializer.prototype.getBody = function() {
  var body = '<methodCall>'
    + '<methodName>' + this.method + '</methodName>'
    + '<params>';
  
  function parse(param) {
    // int
    if (parseInt(param, 10) === param) {
      return '<int>' + param + '</int>';
    }
    
    // double
    if ('[object Number]' === Object.prototype.toString.call(param)) {
      return '<double>' + param + '</double>';
    }
    
    // nil
    if (null == param) {
      return '<nil/>';
    }
    
    // boolean
    if (param === true || param === false || '[object Boolean]' === Object.prototype.toString.call(param)) {
      return '<boolean>' + (param ? 1 : 0) + '</boolean>';
    }
    
    // string
    if ('[object String]' === Object.prototype.toString.call(param)) {
      return '<string>' + param + '</string>';    
    }
    
    // dateTime
    if ('[object Date]' === Object.prototype.toString.call(param)) {
      return ('<dateTime.iso8601>'
        + param.getFullYear()
        + ('0' + (param.getMonth() + 1)).slice(-2)
        + ('0' + param.getDate()).slice(-2)
        + 'T'
        + ('0' + param.getHours()).slice(-2)
        + ('0' + param.getMinutes()).slice(-2)
        + ('0' + param.getSeconds()).slice(-2)
        + '<dateTime.iso8601>');
    }
    
    // array
    if (Array.isArray(param)) {
      var body = '<array><data>';
      param.forEach(function(data) {
        body += '<value>' + parse(data) + '</value>';
      });
      body += '</data></array>';
      return body;
    }
    
    // struct
    if (param === Object(param)) {
      var body = '<struct>';
      Object.keys(param).forEach(function(key) {
        body += '<member>'
          + '<name>' + key + '</name>'
          + '<value>' + parse(param[key]) + '</value>'
          + '</member>';
      });
      body += '</struct>';
      return body;
    }
        
    console.warn('unknown value.');
    return '';
  }
  
  this.params.forEach(function(param) {
    body += parse(param);
  });
  
  body += '</params></methodCall>';
  
  return body;  
};

/**
 * XML-RPC response deserializer.
 * 
 * @param {Titanium.XML.Document} xml
 */

function Deserializer(xml) {
  if ('[object String]' === Object.prototype.toString.call(xml)) {
    this.xml = Ti.XML.parseString(xml);
  } else {
    this.xml = xml;
  }
}

/**
 * Deserialize responsed xml.
 * 
 * @return {Object}
 */

Deserializer.prototype.getBody = function() {
  function parse(node) {    
    if ('value' === node.nodeName) {
      return parse(node.childNodes.item(0));
    }
    
    if ('array' === node.nodeName) {
      var res = []
        , data = node.childNodes.item(0).childNodes;
      for (var i = 0, len = data.length; i < len; ++i) {
        res.push(parse(data.item(i)));
      }
      return res;
    }
        
    if ('int' === node.nodeName || 'i4' === node.nodeName) {
      return parseInt(node.textContent, 10);
    }
    
    if ('base64' === node.nodeName) {
      return Ti.Utils.base64decode(node.textContent);
    }
    
    if ('boolean' === node.nodeName) {
      return !!node.textContent;
    }
    
    if ('dateTime.iso8601' === node.nodeName) {
      return 'n/a';
    }
    
    if ('double' === node.nodeName) {
      return parseFloat(node.textContent);
    }
    
    if ('string' === node.nodeName) {
      return String(node.textContent);
    }
    
    if ('struct' === node.nodeName) {
      var res = {}
        , member = node.childNodes;
      
      for (var i = 0, len = member.length; i < len; ++i) {
        var m = parse(member.item(i));
        res[m.name] = m.value;
      }
      
      return res;
    }
    
    if ('member' === node.nodeName) {
      var res = {}, name, value;
      
      for (var i = 0, len = node.childNodes.length; i < len; ++i) {
        if ('name' === node.childNodes.item(i).nodeName) {
          name = node.childNodes.item(i).textContent;
        }
        if ('value' === node.childNodes.item(i).nodeName) {
          value = parse(node.childNodes.item(i).childNodes.item(0));
        }
      }
      
      return { name: name, value: value };
    }
    
    if ('#text' === node.nodeName) {
      return Ti.XML.serializeToString(node);
    }
    
    Ti.API.warn('unknown node.');
  }

  var body = { ok: true, params: [] }
    , params = this.xml.evaluate('/methodResponse/params/param/value');
  
  if (params.length < 1) {
    body.ok = false;
    params = this.xml.evaluate('/methodResponse/fault/value');
  } 
  
  for (var i = 0, len = params.length; i < len; ++i) {
    body.params.push(parse(params.item(i)));
  }
  
  return body;
};

/**
 * Emitter from visionmedia's uikit
 * 
 * @link https://raw.github.com/visionmedia/uikit/master/lib/components/emitter/emitter.js
 */

/**
 * Expose `Emitter`.
 */

exports.Emitter = Emitter;

/**
 * Initialize a new `Emitter`.
 * 
 * @api public
 */

function Emitter() {
  this.callbacks = {};
};

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  (this.callbacks[event] = this.callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off = function(event, fn){
  var callbacks = this.callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this.callbacks[event];
    return this;
  }

  // remove specific handler
  var i = callbacks.indexOf(fn);
  callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter} 
 */

Emitter.prototype.emit = function(event){
  var args = [].slice.call(arguments, 1)
    , callbacks = this.callbacks[event];

  if (callbacks) {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};