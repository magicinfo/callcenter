define([
    'jquery',
    'underscore',
    'moment',
    'twix'
], function($, _, moment, twix) {
    'use strict';

    return {
        formatTime: function(dateObject) {

            var result = '';
            if(dateObject.years) {
                result = dateObject.years+'yrs ' + dateObject.months + 'mnt';
            } else if(dateObject.months) {
                result = dateObject.months+'mnt ' + dateObject.days + 'd';
            } else if(dateObject.days) {
                result = dateObject.days+'d ' + dateObject.hours + 'h';
            } else if(dateObject.hours) {
                result = dateObject.hours+'h ' + dateObject.minutes + 'm';
            } else if(dateObject.minutes) {
                result = dateObject.minutes+'min ' + dateObject.seconds + 'sec';
            } else if(dateObject.seconds) {
                result = dateObject.seconds+'s';
            }

            return result;
        },
        setRefreshInterval: function(dataObject) {
            var result = 'res';

            return result;
        },

        updateTime: function(model) {

            var now = moment();
            var range = moment(model.get('date')).twix(now);
            range = range.asDuration("days");

            var formattedCountdown = this.formatTime(range._data);
            var currentCountdown = model.get('countdown');

            if(currentCountdown != formattedCountdown) {
                model.set('countdown', formattedCountdown);
            }
        },

        // format seconds to minutes and seconds
        formatAverageTime: function(averageTime) {
            var minutes = Math.floor(averageTime / 60);
            var seconds = Math.floor(averageTime % 60);

            if(minutes == 0 || isNaN(minutes)) {
                return [seconds + ' secs'];
                //return seconds + ' secs';
            } else {
                return [minutes + ' m', seconds + ' secs'];
                //return minutes + ' m ' + seconds + ' secs';
            }
        },

        roundedAverageAnswer: function(_seconds) {
            var mins = '', secs = '';
            var minutes = Math.floor(_seconds / 60);
            var seconds = Math.floor(_seconds % 60);

            if(minutes == 0 || isNaN(minutes)) {
                secs = seconds + ' secs';
                //return seconds + ' secs';
            } else {
                mins = minutes + ' m';
                secs = seconds + ' secs';
            }

            return {
                year: moment().subtract(1, 'y').year(),
                mins: mins,
                secs: secs
            };
        },

        setIcon: function(agent) {
            var icon;
            switch(agent.state) {
                case 'VOICE_MAKE_BUSY':
                    switch(agent.busyReason) {
                        case -1:
                            icon = 'busy';
                            break;
                        case 0:
                            icon = 'busy';
                            break;
                        case 1:
                            icon = 'break';
                            break;
                        case 2:
                            icon = 'cash_closing';
                            break;
                        case 3:
                            icon = 'corporate_event';
                            break;
                        case 4:
                            icon = 'counter';
                            break;
                        case 5:
                            icon = 'email';
                            break;
                        case 6:
                            icon = 'lunch';
                            break;
                        case 7:
                            icon = 'meeting';
                            break;
                        case 8:
                            icon = 'personal';
                            break;
                        case 9:
                            icon = 'post_call_work';
                            break;
                        case 10:
                            icon = 'training';
                            break;
                        case 11:
                            icon = 'coaching';
                            break;
                    }
                    break;
                case 'VOICE_UNKNOWN':
                    icon = 'busy';
                    break;
                case 'VOICE_LOGGED_OUT':
                    icon = 'offline';
                    break;
                case 'VOICE_IDLE':
                    icon = 'idle';
                    break;
                case 'VOICE_TALK_ACD':
                    icon = 'acd';
                    break;
                case 'VOICE_HOLD_ACD':
                    icon = 'acd';
                    break;
                case 'VOICE_TALK_NONACD':
                    icon = 'nonACD';
                    break;
                case 'VOICE_HOLD_NONACD':
                    icon = 'nonACD';
                    break;
                case 'VOICE_TALK_OUT':
                    icon = 'outbound';
                    break;
                case 'VOICE_HOLD_OUT':
                    icon = 'acd';
                    break;
                case 'VOICE_WORK_TIMER':
                    icon = 'work_timer';
                    break;
                case 'VOICE_SYSTEM_MAKE_BUSY':
                    icon = 'busy';
                    break;
                case 'VOICE_OFF_HOOK':
                    icon = 'acd';
                    break;
                default:
                    icon = '';
                    break
            }

            if(!icon) {
                icon = 'noicon';
            }

            return icon;
        }
    }
});

