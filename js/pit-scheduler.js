'use strict';

(function ($) {
    var i18n = {
        allowed: [
            'en',
            'fr'
        ],
        fr: {
            days: 'Jours',
            months: 'Mois',
            list: 'Liste',
            unlisted: 'Non répertorié'

        },
        en: {
            days: 'Days',
            months: 'Months',
            list: 'List',
            unlisted: 'Unlisted'
        }
    };
    
    $.fn.pitScheduler = function (options){

        var $scheduler = $(this);


        /********* Settings initialization *********/
        console.group();
        console.info('Settings initialization');

        var settings = $.extend({
            date: {
                current: moment(),
                selected: moment()
            },
            uiElements: {

            },
            currentDisplay: ''
        }, options);

        /* Check if the default display is defined */
        if (settings.defaultDisplay === undefined) {
            settings.currentDisplay = 'days';
        } else {
            settings.defaultDisplay.toLowerCase();
            if (settings.defaultDisplay !== 'days' && settings.defaultDisplay !== 'months' && settings.defaultDisplay !== 'list') {
                settings.currentDisplay = 'days';
            } else
                settings.currentDisplay = settings.defaultDisplay;
        }

        /* Check if the default locale is defined */
        if (settings.locale === undefined || i18n.allowed.indexOf(settings.locale) == -1) {
            settings.locale = 'en';
        }
        moment.locale(settings.locale);
        settings.i18n = i18n[settings.locale];

        console.log("Locale: " + settings.locale);
        console.log("Current display: " + settings.currentDisplay);
        console.log("Moment.locale(): " + moment.locale());
        console.log("Selected date: " + settings.date.selected);



        console.groupEnd();

        /********* Main functions *********/

        console.group();
        console.info('Main functions');

        /* update display view*/
        var updateDisplay = function (format) {
            switch (format) {
                case 'days':
                    $('.pts-header-right-container  .pts-btn-day-view').addClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-month-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-list-view').removeClass('pts-active');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale('fr').format('LL'));
                    settings.currentDisplay = 'days'
                    updateDatePicker();
                    break;
                case 'months':
                    $('.pts-header-right-container  .pts-btn-day-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-month-view').addClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-list-view').removeClass('pts-active');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale('fr').format('MMMM YYYY'));
                    settings.currentDisplay = 'months';
                    updateDatePicker();
                    break;
                case 'list':
                    $('.pts-header-right-container  .pts-btn-day-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-month-view').removeClass('pts-active');
                    $('.pts-header-right-container  .pts-btn-list-view').addClass('pts-active');
                    $('.pts-header-date-display').empty();
                    $('.pts-header-date-display').append(moment(settings.date.selected).locale('fr').format('LL'));
                    settings.currentDisplay = 'list';
                    updateDatePicker();
                    break;

            }
        };

        /* Update the content of the datepicker */
        var updateDatePicker = function () {
            $('#header-datetimepicker').datetimepicker();
            $('#header-datetimepicker').data('DateTimePicker').locale(settings.locale);
            $('#header-datetimepicker').data('DateTimePicker').defaultDate(settings.date.selected);
            $('#header-datetimepicker').data('DateTimePicker').date(settings.date.selected);
            $('#header-datetimepicker').data('DateTimePicker').viewDate(settings.date.selected);
            $('#header-datetimepicker').data('DateTimePicker').enabledHours(false);
            $('#header-datetimepicker').data('DateTimePicker').format((settings.currentDisplay === 'months' ? 'MM/YYYY' : 'L'));
            $('#header-datetimepicker').data('DateTimePicker').viewMode((settings.currentDisplay === 'months' ? 'months' : 'days'));

        };

        /* Go to the next month/day */
        var goForward = function () {
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(1, 'day');
            }
            updateDisplay(settings.currentDisplay);
        };

        /* Go to the previous month/day */
        var goBackward = function () {
            if (settings.currentDisplay == 'months') {
                settings.date.selected = moment(settings.date.selected).add(-1, 'months');
            } else {
                settings.date.selected = moment(settings.date.selected).add(-1, 'day');
            }
            updateDisplay(settings.currentDisplay);
        };

        /* Return a task from his Id */
        var getTaskById = function (taskId) {
            var task;
            settings.tasks.forEach(function (e) {
                if (e.id === taskId) {
                    task = e;
                }
            });
            return task;
        };

        /* Get the height of a user line */
        var getUserLineHeight = function (user) {
            var tasks = [];
            user.tasks.forEach(function (task) {
                if (tasks.indexOf(task.id) < 0) {
                    tasks.push(task.id);
                }
            });
            return tasks.length * 40;
        };

        console.groupEnd();

        /********* Generation *********/
        console.group();
        console.info('Generation');

        /* Generate the header content */
        var generateHeader = function () {
            var $header =   '<div class="pts-header row">' +
                            '<div class="pts-header-left-container pull-left">' +
                            '<div class="form-group">' +
                            '<div class="input-group date" id="header-datetimepicker">' +
                            '<input type="text" class="form-control"/>' +
                            '<span class="input-group-addon">' +
                            '<span class="glyphicon glyphicon-calendar"></span>' +
                            '</span></div></div>' +
                            '<div class="pts-nav-buttons">' +
                            '<button class="btn pts-btn-previous"><i class="glyphicon glyphicon-chevron-left"></i></button>' +
                            '<button class="btn pts-btn-next"><i class="glyphicon glyphicon-chevron-right"></i></button>' +
                            '</div>' +
                            '<span class="pts-header-date-display">' +
                            (settings.currentDisplay === "months" ? moment(settings.date.selected).locale('fr').format('MMMM YYYY') : moment(settings.date.selected).locale('fr').format('LL')) +
                            '</span></div>' +
                            '<div class="pts-header-right-container pull-right">' +
                            '<button class="btn btn-sm pts-btn-day-view ' + (settings.currentDisplay === "days" ? "pts-active" : "") + '">' + settings.i18n.days + '</button>' +
                            '<button class="btn btn-sm pts-btn-month-view ' + (settings.currentDisplay === "months" ? "pts-active" : "") + '">' + settings.i18n.months + '</button>' +
                            '<button class="btn btn-sm pts-btn-list-view" ' + (settings.currentDisplay === "list" ? "pts-active" : "") + '>' + settings.i18n.list + '</button></div></div>';

            $scheduler.append($header);
            updateDatePicker();
        };

        /* Generate base empty base structure */
        var generateBaseView = function () {
            var $mainContainer =    '<div class="pts-main-container row">' +
                                    '<div class="pts-corder-mask"></div>' +
                                    '<div class="pts-column-title-container">' +
                                    '<div></div></div>' +
                                    '<div class="pts-line-title-container"><div>' +
                                    '</div></div>' +
                                    '<div class="pts-scheduler-container">' +
                                    '<div class="pts-main-content">' +
                                    '</div></div></div>';

            $scheduler.append($mainContainer);
        };

        /* Generate the table columns lines */
        var generateTableLines = function () {

            $('.pts-column-title-container > div').empty();
            $('.pts-main-content').empty();
            if (settings.currentDisplay == 'days') {
                var lineInterval = 0;
                for (var i=0; i < 25; i++) {
                    $('.pts-column-title-container > div').append('<div class="pts-column-element">' + (i < 24 ? "<p>"+i+":00</p>" : "") + '</div>');
                    if (i < 24) {
                        $('.pts-main-content').append('<div class="pts-main-group-column" style="left:' + lineInterval + 'px"><div></div></div>');
                    }
                    lineInterval += 120;
                }
            } else if (settings.currentDisplay == 'months') {
                var lineInterval = 0,
                    daysInMonth = parseInt(moment(settings.date.selected).daysInMonth()) + 1;
                for (var i=1; i <= daysInMonth; i++) {
                    $('.pts-column-title-container > div').append('<div class="pts-column-element">' + (i < daysInMonth  ? "<p>"+i+"</p>" : "") + '</div>');
                    if (i < daysInMonth) {
                        $('.pts-main-content').append('<div class="pts-main-group-column" style="left:' + lineInterval + 'px"><div></div></div>');
                    }
                    lineInterval += 120;
                }
            }
        };

        /* Generate the groups panels */
        var generateGroupsPanels = function () {
            if (!settings.groups) {
                settings.groups = [{
                    name: settings.i18n.unlisted
                }];
                settings.groups.unlisted = 0; //stores the id of the unlisted group
            }
            settings.groups.added = [];
            settings.groups.forEach(function (e, i) {
                generateGroupTab(e, i);
                settings.groups.added.push({
                    name: e.name,
                    id: 'user-group-' + i
                });
            });
        };

        /* Add one group to the scheduler */
        var generateGroupTab = function (group, index) {
            console.log("Creat group: " + group.name);
            var $groupHeaderContent =   '<div id="user-group-' + index + '" class="pts-line-group-container">' +
                                        '<div class="pts-group-header">' +
                                        '<i class="glyphicon glyphicon-remove pull-left close-group-panel" data-group="' + index + '" data-toggle="opened"></i>' +
                                        '<span>' + group.name + '</span></div>' +
                                        '<div class="pts-group-content"></div></div>';
            var $groupMainContent =     '<div class="pts-main-group-container">' +
                                        '<div class="pts-main-group-header"></div></div>';
            $('.pts-line-title-container > div').append($groupHeaderContent);
        };

        /* Generate the main group content and header */
        var generateGroupMainContent = function () {
            settings.groups.added.forEach(function (group, groupIndex) {
                var $groupMainContent = '<div id="group-container-' + groupIndex + '" class="pts-main-group-container">' +
                                        '<div class="pts-main-group-header"></div></div>';
                $('.pts-main-content').append($groupMainContent);
                settings.users.forEach(function (user, userIndex) {
                    if (user.group === group.name) {
                        $('#group-container-' + groupIndex).append('<div id="content-user-' + userIndex + '" class="pts-main-group-user" style="height:' + getUserLineHeight(user) + 'px"></div>');
                    }
                });
                //Check if the group panel must be closed
                if ($('.close-group-panel[data-group='+groupIndex+']').attr('data-toggle') === 'closed') {
                    $('#group-container-' + groupIndex).children('.pts-main-group-user').css('display', 'none');
                }
            });
            //Generate group header line
            if (settings.currentDisplay == 'days') {
                $('.pts-main-group-header').css('width', '2880px');
                $('.pts-main-group-user').css('width', '2880px');
            } else {
                $('.pts-main-group-header').css('width', (120 * moment(settings.date.selected).daysInMonth()) + 'px');
                $('.pts-main-group-user').css('width', (120 * moment(settings.date.selected).daysInMonth()) + 'px');
            }
            settings.users.forEach(function (user, userIndex) {
                generateTaskLines(user, userIndex);
            });
        };

        /* Generate the left users list */
        var generateUsersList = function () {
            if (!settings.users || settings.users.length <= 0) return console.warn('Warning: No user have been set.');

            settings.users.forEach(function (user) {
                var group = '';
                settings.groups.added.forEach(function (_group) {
                    if (_group.name == user.group || (user.id && _group.users && _group.users.indexOf(user.id) >= 0)) {
                        group = _group.id;
                    }
                });
                if (!group) {
                    console.log('User ' + user.name + ' has not group.');

                    if (!settings.groups.unlisted) {
                        console.log('Unlisted group do not exist, creating one');
                        generateGroupTab({name: settings.i18n.unlisted}, settings.groups.added.length);
                        settings.groups.unlisted = settings.groups.added.length;
                        settings.groups.added.push({
                            name: settings.i18n.unlisted,
                            id: 'user-group-' + settings.groups.added.length
                        });
                    }

                    group = settings.groups.added[settings.groups.unlisted].id;
                }
                generateUserLine(user, group)
            });
        };
        
        /* Add one user line */
        var generateUserLine = function (user, group) {
            if (!user.tasks) return console.warn('Warning: user ' + user.name + 'has no task assigned to himself');
            console.log('Generate line for user: ' + user.name + ' in group: ' + group);

            var $userNameUI = '<div class="pts-group-user" style="height:' + getUserLineHeight(user) + 'px"><p>' + user.name + '</p></div>';

            $('#' + group + ' > .pts-group-content').append($userNameUI);

        };

        /* Generate the tasks lines */
        var generateTaskLines = function (user, userIndex) {
            user.userIndex = userIndex;
            var topDistance = 5;
            user.tasks.forEach(function (e, i) {
                var task = $.extend(getTaskById(e.id), e);
                task.index = i;
                if (task === undefined) return console.warn('Warning: Task ' + e.id + ' has not be found in tasks array for user ' + user.name);
                if (task.start_date >= task.end_date) return console.warn('Warning: end_date must be later than start_date for user ' + user.name + 'in task ' + e.id);
               if (settings.currentDisplay === 'months') {
                   if (task.end_date) {
                       if (moment(settings.date.selected).get('year') >= moment(task.start_date).get('year')
                           && moment(settings.date.selected).get('year') <= moment(task.end_date).get('year')) {
                           if (moment(settings.date.selected).get('month') >= moment(task.start_date).get('month')
                               && moment(settings.date.selected).get('month') <= moment(task.end_date).get('month')) {
                               topDistance += generateTaskLineMonth(user, task, topDistance);
                           }
                       }
                   }
               }
                topDistance += 40;
            });
        };

        /* Generate one task on the month view */
        var generateTaskLineMonth = function (user, task, topDistance) {
            var userIndex = user.userIndex;
            var existingTaskLine = $('div[data-task=' + task.id + '][data-user=' + userIndex + '] > .pts-line-marker');

            if (existingTaskLine.length > 0) {
                console.log("FIND FIND FIND");
                topDistance = existingTaskLine.css('top');
            }

            $('#content-user-' + userIndex).append('<div class="pts-line-marker-group-' + task.index + '" data-task="' + task.id + '" data-user="' + userIndex + '"></div>');

            // If the task start date is in the current month
            if (moment(settings.date.selected).get('month') == moment(task.start_date).get('month')) {
                var splitted = (moment(task.start_date).format('H') >= 12 ? 60 : 0);
                var leftDistance = (120 * (moment(task.start_date).format('D') - 1)) + splitted - 6;
                if (moment(task.end_date).get('month') > moment(settings.date.selected).get('month')) {
                    var labelWidth = 120 * (parseInt(moment(settings.date.selected).daysInMonth()) - parseInt(moment(task.start_date).format('D'))) + (splitted == 0 ? 120 : 60);
                } else {
                    var labelWidth = 120 * (moment(task.end_date).format('D') - moment(task.start_date).format('D') - 1) + (splitted == 0 ? 120 : 60);
                }
                var $label = '<div class="pts-line-marker start" style="top:'+topDistance+'px;left:'+ leftDistance +'px;background-color:' + task.color + ';width:'+labelWidth+'px" data-task="' + task.id + '"></div>'
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($label);
            }

            // If the task end date is in the current month
            if (moment(settings.date.selected).get('month') == moment(task.end_date).get('month')) {
                if (moment(task.start_date).get('month') == moment(settings.date.selected).get('month')) {
                    var splitted = (moment(task.end_date).format('H') <= 12 ? 60 : 0);
                    var leftDistance = (120 * (moment(task.end_date).format('D') - 1)) - splitted;
                    var $label = '<div class="pts-line-marker end" style="top:' + topDistance + 'px;left:' + leftDistance + 'px;background-color:' + task.color + ';" data-task="' + task.id + '"></div>';
                    $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($label);
                } else {
                    var splitted = (moment(task.end_date).format('H') <= 12 ? 60 : 0);
                    var labelWidth = 120 * (moment(task.end_date).format('D')) - splitted;
                    var $label = '<div class="pts-line-marker end" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';width:'+labelWidth+'px" data-task="' + task.id + '"></div>';
                    $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($label);
                }
            }

            // If the task start and end dates are not in the current month but the task is
            if (moment(settings.date.selected).get('month') != moment(task.end_date).get('month') && moment(settings.date.selected).get('month') != moment(task.start_date).get('month')) {
                var $label = '<div class="pts-line-marker middle" style="top:' + topDistance + 'px;left:0px;background-color:' + task.color + ';" data-task="' + task.id + '"></div>';
                $('#content-user-' + userIndex + ' > .pts-line-marker-group-' + task.index).append($label);
            }
            //TODO: Add task label
            return (existingTaskLine.length > 0 ? -40 : 0);
        };

        console.groupEnd();


        /********* Initialization *********/
        console.group();
        console.info("Initialization");

        generateHeader();
        generateBaseView();
        generateTableLines();
        generateGroupsPanels();
        generateGroupMainContent();
        generateUsersList();

        console.groupEnd();

        /********* Events *********/
        console.group();
        console.info('Events');

        $('.pts-btn-day-view').click( function () {
            updateDisplay('days');
            generateTableLines();
            generateGroupMainContent();
        });

        $('.pts-btn-month-view').click( function () {
            updateDisplay('months');
            generateTableLines();
            generateGroupMainContent();
        });

        $('.pts-scheduler-container').scroll(function () {
            $('.pts-line-title-container div').scrollTop($(this).scrollTop());
            $('.pts-column-title-container ').scrollLeft($(this).scrollLeft());
        });

        $('.pts-btn-next').click(function () {
            goForward();
            generateTableLines();
            generateGroupMainContent();
        });

        $('.pts-btn-previous').click(function () {
            goBackward();
            generateTableLines();
            generateGroupMainContent();
        });

        $('#header-datetimepicker').on('dp.change', function (e) {
            if (e.date === settings.date.selected) return console.log("EGALE");
            settings.date.selected = e.date;
            updateDisplay(settings.currentDisplay);
        });

        $('.close-group-panel').click(function () {
            var $usersPanel = $('#group-container-' + $(this).attr('data-group'));
            var $groupPanel = $('#user-group-' + $(this).attr('data-group'));
            if ($(this).attr('data-toggle') === 'opened') {
                $usersPanel.children('.pts-main-group-user').css('display', 'none');
                $groupPanel.children('.pts-group-content').css('display', 'none');
                $(this).attr('data-toggle', 'closed');
                $(this).addClass('closed-btn');
            } else {
                $usersPanel.children('.pts-main-group-user').css('display', 'block');
                $groupPanel.children('.pts-group-content').css('display', 'block');
                $(this).attr('data-toggle', 'opened');
                $(this).removeClass('closed-btn');
            }
        });

        console.groupEnd();


        return $scheduler;
    };
}(jQuery));
