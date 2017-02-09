(function () {
    'use strict';

    // These are component specifics ( params, templateUrl and controller )
    var componentOptions = {
        bindings   : {
            startyear: '=',
            endyear  : '='
        },
        controller : CalendarController,
        templateUrl: 'app/calendar.html'
    };

    angular
        .module('app')
        .component('mySuperCalendar', componentOptions);

    function CalendarController(CalendarService, toastr, $scope, $timeout) {
        var self = this;

        // Initialize ( get parameters or set defaults )
        self.$onInit = onInit;

        // When left side is done, emit the event here and continue
        $scope.$on('item.set', function () {
            var yearAndMonth = CalendarService.getValue();

            var month = yearAndMonth.toString().split('-')[0];
            var year  = yearAndMonth.toString().split('-')[1].toString();

            pickYearAndMonth(year, month)
        });

        self.pickYearAndMonth = pickYearAndMonth;
        self.pickDay          = pickDay;

        self.postNote   = postNote;
        self.editNote   = editNote;
        self.deleteNote = deleteNote;
        self.addNote    = addNote;

        self.applyEdit     = applyEdit;
        self.showEdit      = showEdit;
        self.cancel        = cancel;
        self.stopFollowing = stopFollowing;

        self.scrollMe = scrollMe;
        self.goToItem = goToItem;


        // Set passed parameters ( startFrom and endYear )
        self.startOn = self.startyear || 1950;
        self.endOn   = self.endyear || 2100;

        self.onlyNumbers = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;
        self.today       = new Date();

        self.months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
        self.days   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        self.labels = ['Yellow', 'Green', 'Red', 'Blue'];

        self.years      = [];
        self.monthNotes = [];


        // Date model which holds actual values
        self.date          = {
            year : self.today.getFullYear(),
            month: self.months[self.today.getMonth()],
            day  : self.days[self.today.getDay()]
        };
        self.todayName     = self.days[self.today.getDay()];
        self.todayFullDate = self.today.getFullYear() + '-' + toZeroBased(self.today.getMonth() + 1) + '-' + toZeroBased(self.today.getDate());
        self.selectedDate  = '';

        self.showAdd = false;
        self.editing = false;

        self.note         = {};
        self.activeDayObj = {};
        self.editObj      = {};


        // Info and error messages
        var infoErrorObj = {
            selectDateFirst: "Select a date for your new note.",
            fillAllFields  : "Please fill all fields.",
            noCurrentDate  : "No current date, please try adding note again.",
            noteDeleteQ    : "Are you sure you want to delete this note?",
            deleteOk       : "Note deleted successfully.",
            editOk         : "Note updated successfully.",
            startEndError  : "startFrom year must be smaller then endOn year."
        };

        // Initialize function, get years range
        function onInit() {

            // Initialize left part ( from - to year and get this months day )
            if (self.startOn < self.endOn) {
                getYearRange();
            }
            else toastr.error(infoErrorObj.startEndError)

        }

        // This action happens when day in month is selected
        function pickDay(day, days) {
            if (day && day.disabled) return;

            if (self.editing) self.editing = false;

            if (day) {
                self.selectedDate = day.year + '-' + toZeroBased(self.months.indexOf(day.month) + 1) + '-' + toZeroBased(day.num);

                day.selected      = true;
                self.note.date    = self.selectedDate;
                self.activeDayObj = day;
            }

            loadDayNotes(day);

            if (days) {
                clearSelection();
            }

            // Load right side notes for one day
            function loadDayNotes(day) {
                self.activeDayObj.notes = [];

                for (var note in self.monthNotes) {
                    var noteObj      = self.monthNotes[note],
                        noteDate     = self.monthNotes[note].date,
                        currentYear  = self.date.year,
                        currentMonth = toZeroBased(self.months.indexOf(self.date.month) + 1),
                        currentDay   = null,
                        currentDate  = null;

                    day ? currentDay = toZeroBased(day.num) : currentDay = new Date().getDay();

                    currentDate = currentYear + '-' + currentMonth + '-' + currentDay;

                    if (noteDate && noteDate === currentDate) {
                        self.activeDayObj.notes.push(noteObj);
                    }
                }
            }

            // Clear selected day
            function clearSelection() {
                for (var i = 0; i < days.length; i++) {
                    for (var j = 0; j < days[i].length; j++) {
                        if (days[i][j].hasOwnProperty('selected') && (days[i][j].num != day.num)) {
                            days[i][j].selected = false;
                        }
                    }
                }
            }
        }

        // This action is called when user clicks on date and onInit()!
        function pickYearAndMonth(year, month) {
            self.date.year  = year || new Date().getFullYear();
            self.date.month = month || self.months[new Date().getMonth()];
            self.date.day   = new Date().getDay();
            self.activeDay  = self.date.day;

            getMonthNotes(year, month);
        }

        // Get passed years and calculate how many years to show in left scrollable section
        function getYearRange() {
            for (var i = self.startOn; i <= self.endOn; i++) {
                self.years.push(i);
            }
        }

        // Get notes for selected month
        function getMonthNotes(year, month) {
            // Now we have current date ( or selected date ) so we can get all notes for that date
            var query = {
                from: self.date.year + '-' + (self.months.indexOf(self.date.month) + 1) + '-' + '00',
                to  : self.date.year + '-' + (self.months.indexOf(self.date.month) + 1) + '-' + '31'
            };
            CalendarService.getMonthNotes(query)
                .then(function (response) {
                    if (response.data.message == 'listOk') {
                        angular.copy(response.data.notes, self.monthNotes);

                        return self.monthNotes;
                    }
                })
                .then(function () {
                    renderMonth(year, month);
                })
                .catch(function (error) {
                    // do some error handling
                });
        }

        // Create new note
        function postNote(note) {
            if (!note.date) {
                return toastr.info(infoErrorObj.selectDateFirst);
            }
            if (!note.label || !note.date || !note.title || !note.time) {
                return toastr.info(infoErrorObj.fillAllFields);
            }

            CalendarService.postNote(note)
                .then(function (response) {
                    if (response.data.message == 'insertOk') {

                        // push to month notes
                        self.note.id = response.data.id;
                        self.monthNotes.push(note);

                        // The bellow add note to date notes array
                        var currentYear  = self.activeDayObj.year,
                            currentMonth = toZeroBased(self.months.indexOf(self.activeDayObj.month) + 1),
                            day          = toZeroBased(self.activeDayObj.num.toString()),
                            noteDate;

                        if (!currentMonth && !currentYear && !day) {
                            return toastr.error(infoErrorObj.noCurrentDate);
                        }

                        noteDate = currentYear + '-' + currentMonth + '-' + day;

                        if (self.note.date == noteDate) {

                            self.activeDayObj.notes.push(self.note);

                            // Decrement note based on which one is removed
                            if (note.label == 'Yellow') {
                                self.activeDayObj.yellow++;
                            }
                            if (note.label == 'Green') {
                                self.activeDayObj.green++;
                            }
                            if (note.label == 'Blue') {
                                self.activeDayObj.blue++;
                            }
                            if (note.label == 'Red') {
                                self.activeDayObj.red++;
                            }

                        }

                        self.showAdd = false;

                        // Reset model to default values (didn't reset date value because it comes trough pickDay() or its stays the same)
                        self.note       = {};
                        self.note.date  = self.selectedDate;
                        self.note.label = self.labels[0];

                        return false;

                    }
                })
                .catch(function (error) {
                    // do some error handling
                })
        }

        // Edit note
        function editNote(index, note) {
            self.editing = true;
            self.editObj = note;

            self.editObj.index = index;
        }

        // Call edit note service and apply the changes
        function applyEdit(editObj) {
            if (!editObj.label || !editObj.date || !editObj.title || !editObj.time) {
                return toastr.info(infoErrorObj.fillAllFields);
            }

            CalendarService.editNote(editObj)
                .then(function (response) {
                    if (response && response.data.message === 'updateOk') {
                        toastr.info(infoErrorObj.editOk);

                        self.editing = false;
                    }
                    else if (response && (response.data.message === 'updateError' || response.message === 'noID')) {
                        toastr.error('Note update error!');
                    }
                });
        }

        // Removes note from db.
        function deleteNote(index, id, date, label) {
            if (confirm(infoErrorObj.noteDeleteQ) == true) {
                CalendarService.deleteNote(id)
                    .then(function (response) {
                        if (response.data.message == 'deleteOk') {

                            var currentYear  = self.activeDayObj.year,
                                currentMonth = toZeroBased(self.months.indexOf(self.activeDayObj.month) + 1),
                                day          = toZeroBased(self.activeDayObj.num.toString()),
                                noteDate;

                            if (!currentMonth && !currentYear && !day) {
                                return toastr.error(infoErrorObj.noCurrentDate);
                            }

                            noteDate = currentYear + '-' + currentMonth + '-' + day;

                            if (date == noteDate) {

                                // Decrement note based on which one is removed
                                if (label == 'Yellow') {
                                    self.activeDayObj.yellow--;
                                }
                                if (label == 'Green') {
                                    self.activeDayObj.green--;
                                }
                                if (label == 'Blue') {
                                    self.activeDayObj.blue--;
                                }
                                if (label == 'Red') {
                                    self.activeDayObj.red--;
                                }

                                // Remove note from active day notes
                                self.activeDayObj.notes.splice(index, 1);
                            }

                            toastr.info(infoErrorObj.deleteOk);

                        }
                    })
                    .catch(function (error) {
                        // do some error handling
                    })
            }

        }

        // This action runs on add new note click
        function addNote() {
            self.showAdd = !self.showAdd;
        }

        // Show edit dialog
        function showEdit() {
            self.editing = !self.editing;
        }

        // Cancel edit/add
        function cancel() {
            self.editing = false;
        }

        // Render month grid
        function renderMonth(year, month) {

            // If it is 0 then it is Sunday so skip the whole first row / start from 7
            var startFrom     = new Date(year, self.months.indexOf(month), 1).getDay() || 7,
                monthDays     = new Date(year, self.months.indexOf(month) + 1, 0).getDate(),

                todayDate     = new Date(year, self.months.indexOf(month) + 1, 0),
                previousDate  = todayDate.getMonth() - 1,
                pasMonthDays  = new Date(year, previousDate + 1, 0).getDate(),

                countFrom     = 1,
                nextMouth     = 1,
                previousMonth = (pasMonthDays - startFrom) + 1;

            self.dates     = [];
            self.monthDays = [];
            self.allDays   = [];

            // Make array of month days
            if (monthDays) daysToArray(monthDays);

            // Go through 0 to 42, grid length
            for (var i = 0; i < 42; i++) {


                // Create new array holder
                if (i % 7 == 0) {
                    self.dates.push([]);
                }

                // Push previous month days
                if (i < startFrom) {
                    self.dates[self.dates.length - 1].push({
                        disabled: true,
                        num     : previousMonth++ || ''
                    });
                }

                // Push current month days
                else if (i >= startFrom && self.monthDays.length >= i - startFrom && self.monthDays[countFrom]) {
                    self.dates[self.dates.length - 1].push({
                        num     : self.monthDays[countFrom],
                        index   : i,
                        notes   : [],
                        year    : self.date.year,
                        month   : self.date.month,
                        fullDate: self.date.year + '-' + toZeroBased(self.months.indexOf(self.date.month) + 1) + '-' + toZeroBased(self.monthDays[countFrom]),
                        green   : 0,
                        yellow  : 0,
                        blue    : 0,
                        red     : 0
                    });
                    countFrom++;
                }

                else
                    self.dates[self.dates.length - 1].push({
                        disabled: true,
                        num     : nextMouth++ || ''
                    });

            }

            getAllDays();
            checkForNotes();

            // Get all object days from self.dates and put them into separate array
            function getAllDays() {
                for (var x = 0; x < self.dates.length; x++) {
                    for (var z in self.dates[x]) {
                        self.allDays.push(self.dates[x][z]);
                    }
                }
            }

            // Check which day has note
            function checkForNotes() {
                for (var q = 0; q < self.allDays.length; q++) {
                    for (var k = 0; k < self.monthNotes.length; k++) {
                        var note      = self.monthNotes[k],
                            monthNum  = note.date.split('-')[1].toString(),
                            cDay      = Number(note.date.split('-')[2]),
                            year      = Number(note.date.split('-')[0]),
                            monthName = '',
                            day       = self.allDays[q];

                        // Normalize month number and get month name
                        if (monthNum.split('')[0] == 0) {
                            monthNum = Number(monthNum.split('')[1] - 1);
                        }
                        else {
                            monthNum = Number(monthNum) - 1;
                        }
                        monthName = self.months[monthNum];

                        if (day && (day.hasOwnProperty('num') && (day.hasOwnProperty('month') && (day.hasOwnProperty('year'))))) {
                            if (day.num == cDay && day.year == year && day.month == monthName) {
                                if (note.label === 'Yellow') {
                                    day.yellow++;
                                }
                                if (note.label === 'Green') {
                                    day.green++;
                                }
                                if (note.label === 'Red') {
                                    day.red++;
                                }
                                if (note.label === 'Blue') {
                                    day.blue++;
                                }

                            }
                        }
                    }
                }
            }

            // Make array of month days
            function daysToArray(days) {
                for (var j = 0; j <= days; j++) {
                    self.monthDays.push(j);
                }
            }
        }

        // Return false/stop following clicked link
        function stopFollowing() {
            return false;
        }

        // Convert number to zero based number (7 - 07)
        function toZeroBased(number) {
            return (number && number.toString().length == 1) ? "0" + number : number;
        }

        // Center month when clicked
        function goToItem(month, year) {
            var itemHash      = month + '-' + year,
                itemElement   = document.getElementById(itemHash),
                ngElement     = angular.element(itemElement),
                scrGradient   = document.getElementsByClassName('gradient'),
                scrElement    = angular.element(scrGradient),
                calContainerH = 223;


            scrElement[0].scrollTop = (ngElement[0].offsetTop - calContainerH);

        }

        // Used to scroll certain number of pixels
        function scrollMe($event, $delta, $deltaX, $deltaY) {
            $event.preventDefault();
            var thing = document.getElementsByClassName('gradient');
            var aEl   = thing[0];

            function scrollIt(div, deltaY) {
                var step = 30,
                    pos  = div.scrollTop;

                div.scrollTop = pos + (step * (-deltaY));
            }

            scrollIt(aEl, $deltaY);
        }

    }

})();


