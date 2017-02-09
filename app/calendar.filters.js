(function () {
    'use strict';

    angular
        .module('app')
        .filter('shortenMonth', shortenMonth)
        .filter('dateSuffix', dateSuffix);

    function dateSuffix() {
        var suffixes = ["th", "st", "nd", "rd"];
        return function (input) {
            var relevantDigits = (input < 30) ? input % 20 : input % 30;
            var suffix         = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];
            return input + suffix;
        };
    }

    function shortenMonth() {
        return function (month) {
            return month.substring(0, 3);
        };
    }
})();