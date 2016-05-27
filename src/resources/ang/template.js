(function(module) {
try {
  module = angular.module('cuf.template');
} catch (e) {
  module = angular.module('cuf.template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/ang/template.html',
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>5555555555\n' +
    '<div>11111111111111111111111</div>\n' +
    '\n' +
    '');
}]);
})();
