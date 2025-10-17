"use strict";
var VALIDATE = VALIDATE || {};

/*
* VALIDATE.check({type:'E-MAIL'}, 'name@gmail.com', function(res){});
*
*/
VALIDATE.check = (function() {
  var _init       = function() {},
      _checkType  = {},
      _check      = function() {},
      _checkEmail = function() {};

  _init = function() {
    _checkType = {
      'E-MAIL':'E-MAIL'
    };
  }();

  _check = function(options, checkVale, checkCallback) {
    switch (options.type) {
      case _checkType['E-MAIL']:
        _checkEmail(checkVale, checkCallback);
        break;
      default:
    }
  };

  _checkEmail = function(value, callback) {
    /**
    * regex source: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    **/
    var _isEmailAddr = false,
        _re          = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    _isEmailAddr = _re.test(value);
    callback({
      type:'E-MAIL',
      isEmail:_isEmailAddr
    });
  };
  // 初始化

  return _check;
})();

VALIDATE.check({type:'E-MAIL'}, 'name@gmail.com', function(res){
  console.log(res);
});

module.exports = VALIDATE;
