/* -*- mode: js; js-basic-offset: 4; indent-tabs-mode: tabs -*- */

/**
 * format-clock extension
 * @author: eternal-sorrow <sergamena at mail dot ru>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see {http://www.gnu.org/licenses/}.
 *
 */


const Lang = imports.lang;

const Convenience=imports.misc.extensionUtils.getCurrentExtension().imports.convenience;

const DateMenu = imports.ui.main.panel.statusArea.dateMenu;
const LockScreen = imports.ui.main.screenShield;
const LockClock = imports.ui.screenShield.Clock.prototype;

const old_calendar_update_clock = imports.ui.dateMenu.DateMenuButton.prototype._updateClockAndDate;
const old_screen_lock_update_clock = LockClock._updateClock;

const calendar_update_clock = function()
{
	let displayDate = new Date();
	this._clockDisplay.set_text(displayDate.toLocaleFormat(panelClockFormat));
	this._date.set_label(displayDate.toLocaleFormat(calendarButtonClockFormat));
}

const screen_lock_update_clock = function()
{
	this._time.text = this._wallClock.clock;
	let date = new Date();
	this._date.text = date.toLocaleFormat(lockScreenDateFormat);
}

let calendarButtonClockFormat=null;
let panelClockFormat=null;
let lockScreenDateFormat=null;
let settings=null;

//signal connections
let date_menu_connection=null;
//let lock_screen_connection=null;
//let lock_screen_locked_connection=null;
let panel_clock_format_connection=null;
let calendar_menu_date_format_connection=null;
let lock_screen_date_format_connection=null;

function init()
{
	settings=Convenience.getSettings();
}

function enable()
{
	panelClockFormat=settings.get_string("panel-clock-format");
	calendarButtonClockFormat=settings.get_string("calendar-menu-date-format");
	lockScreenDateFormat=settings.get_string("lock-screen-date-format");
	panel_clock_format_connection=settings.connect
	(
		'changed::panel-clock-format',function()
		{
			panelClockFormat=settings.get_string("panel-clock-format");
		}
	);
	calendar_menu_date_format_connection=settings.connect
	(
		'changed::calendar-menu-date-format',function()
		{
			calendarButtonClockFormat=settings.get_string("calendar-menu-date-format");
		}
	);
	lock_screen_date_format_connection=settings.connect
	(
		'changed::lock-screen-date-format',function()
		{
			lockScreenDateFormat=settings.get_string("lock-screen-date-format");
		}
	);

	//XXX Unable to disconnect by ID
	DateMenu._updateClockAndDate = calendar_update_clock;
	date_menu_connection = DateMenu._clock.connect('notify::clock',
			Lang.bind(DateMenu, DateMenu._updateClockAndDate));
	DateMenu._updateClockAndDate();

	LockClock._updateClock = screen_lock_update_clock;
/*	//XXX same problem as with `dm` above.

	lock_screen_locked_connection = LockScreen.connect('lock-screen-shown',
		function()
		{
			log("format-clock: lock screen event emitted")
			if(!(typeof(LockScreen._clock) === 'undefined')&&(LockScreen._clock))
			{
				lock_screen_connection = LockScreen._clock.connect('notify::clock',
					Lang.bind(LockScreen._clock, LockScreen._clock._updateClock));
				LockScreen._clock._updateClock();
				log("format-clock: lock screen date format changed");
			}
		}
	); */
}

function disable()
{
	settings.disconnect(panel_clock_format_connection);
	settings.disconnect(calendar_menu_date_format_connection);
	settings.disconnect(lock_screen_date_format_connection);

	DateMenu._clock.disconnect(date_menu_connection);
	DateMenu._updateClockAndDate = old_calendar_update_clock;
	DateMenu._clock.connect('notify::clock',
		Lang.bind(DateMenu, DateMenu._updateClockAndDate));
	DateMenu._updateClockAndDate();

	LockClock._updateClock = old_screen_lock_update_clock;
/*	if(!(typeof(LockScreen._clock) === 'undefined')&&(LockScreen._clock))
	{
		LockScreen._clock.disconnect(lock_screen_connection);
		LockScreen._clock.connect('notify::clock',
			Lang.bind(LockScreen._clock,LockScreen._clock._updateClock));
		LockScreen._clock._updateClock();
	}
	LockScreen.disconnect(lock_screen_locked_connection);*/
}

