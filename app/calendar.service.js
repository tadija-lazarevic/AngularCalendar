(function () {
    'use strict';

    angular
        .module('app')
        .factory('CalendarService', CalendarService);

    CalendarService.$inject = ['$http'];
    function CalendarService($http) {
        var value = null;

        return {
            postNote     : postNote,
            editNote     : editNote,
            deleteNote   : deleteNote,
            getMonthNotes: getMonthNotes,

            setValue: setValue,
            getValue: getValue
        };


        function setValue(value) {
            this.value = value;
        }

        function getValue() {
            return this.value;
        }

        // CREATE
        function postNote(note) {
            return $http({
                method: "POST",
                url   : 'ajax/postNote.php?title=' + note.title + '&label=' + note.label + '&date=' + note.date + '&time=' + note.time
            });
        }

        function editNote(data) {
            return $http({
                method: "POST",
                url   : 'ajax/editNote.php?id=' + data.id + '&label=' + data.label + '&date=' + data.date + '&time=' + data.time + '&title=' + data.title
            });
        }

        function deleteNote(id) {
            return $http({
                method: 'DELETE',
                url   : 'ajax/deleteNote.php?id=' + id
            })
        }

        function getMonthNotes(query) {
            return $http({
                method: 'POST',
                url   : 'ajax/getNotes.php?from=' + query.from + '&to=' + query.to
            })
        }
    }

})();