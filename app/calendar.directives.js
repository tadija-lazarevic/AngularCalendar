(function () {
    'use strict';

    angular
        .module('app')
        .directive('formatTime', formatTime)
        .directive('setDefaultDate', setDefaultDate);

    function formatTime() {
        return {
            require: 'ngModel',
            link   : function (scope, element, attrs, ngModel) {
                element.on('blur', function () {
                    if (element[0].value.length == 1 && Number(element[0].value.charAt(0)) <= 2) {
                        element[0].value += '0:00';
                    } else if (element[0].value.length == 2 && Number(element[0].value.charAt(0)) <= 2) {
                        element[0].value += ':00';
                    } else if (element[0].value.length == 4 && Number(element[0].value.charAt(0)) <= 2) {
                        element[0].value = element[0].value.slice(0, 2) + ':' + element[0].value.slice(2, 4);
                    } else if (element[0].value.length == 3 && Number(element[0].value.charAt(0)) <= 2) {
                        element[0].value = element[0].value.slice(0, 2) + ':' + element[0].value.slice(2, 3) + '0';
                    } else if (Number(element[0].value.toString().charAt(0)) > 2) {
                        element[0].value = '24:00';
                    } else if (ngModel.$error.pattern == true) {
                        element[0].value = '24:00';
                    }

                    ngModel.$setViewValue(element[0].value);
                })
            }
        }
    }

    function setDefaultDate($location, $timeout, CalendarService) {
        return {
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var monthNames    = [
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ],
                        currentDate   = new Date(),
                        currentYear   = currentDate.getFullYear(),
                        currentMonth  = monthNames[currentDate.getMonth()],
                        yearMonthHash = currentMonth + '-' + currentYear,

                        scrollableEl  = null,
                        defaultDateEl = null,

                        calContainerH = 223;

                    if (attrs.id == yearMonthHash) {
                        $location.hash(yearMonthHash);

                        scrollableEl  = angular.element(document.getElementsByClassName('gradient'))[0];
                        defaultDateEl = angular.element(document.getElementById(attrs.id))[0];

                        scrollableEl.scrollTop = (defaultDateEl.offsetTop - calContainerH);

                        // Set default item, notify controller
                        CalendarService.setValue(attrs.id);
                        scope.$emit('item.set');
                    }
                });
            }
        }

    }

})();
