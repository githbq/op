define(function(require,exports,module){
    var app=angular.module('formApp');
    app.factory('select2Query', ['$timeout', function ($timeout) {
        return {
            getAjaxConfig: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        url: "/api/a/odrDraft/getAccountForSubOrderPartner",
                        dataType: 'json',
                        data: function (term) {
                            return {
                                q: term
                            };
                        },
                        results: function (data, page) {
                            return {results: data.movies};
                        }
                    },
                    formatResult: function (data) {
                        return data.title;
                    },
                    formatSelection: function (data) {
                        return data.title;
                    }
                };

                return config;
            }
        }
    }]);

});
