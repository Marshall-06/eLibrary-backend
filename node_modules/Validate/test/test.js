var VALIDATE = require('../index');

var check = VALIDATE['check'];

check({type:'E-MAIL'}, 'name@gmail.com', function(res){
  console.log(res);
});
