(function(module) {
try {
  module = angular.module('cuf.template');
} catch (e) {
  module = angular.module('cuf.template', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/ang/directives/template.html',
    '<div>11111111111111111111111</div>22222222\n' +
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>\n' +
    '<div>11111111111111111111111</div>\n' +
    '\n' +
    '');
}]);
})();
