import Calendar from 'react-calendar';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css';
// import { DateTime } from 'luxon';

function CalendarModal(props) {
  let { show, value, onClose, onSelectedDate } = props;
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [formattedCalendarValue, setFormattedCalendarValue] = useState();

  onClose = (e) => {
    props.onClose && props.onClose(e);
  };

  const onCalendarChange = (e) => {
    setCalendarValue(e);
  };

  const handleSave = () => {
    const formatToISO = calendarValue.toISOString();
    setFormattedCalendarValue(formatToISO);
    onSelectedDate(formatToISO);
  };

  if (!props.show) {
    return null;
  }

  return (
    <div className='z-50'>
      <svg
        id='react-confirm-alert-firm-svg'
        className='react-confirm-alert-svg'>
        <filter id='gaussian-blur'>
          <feGaussianBlur stdDeviation='0.3'></feGaussianBlur>
        </filter>
      </svg>
      <div className='react-confirm-alert-overlay undefined'>
        <div className='react-confirm-alert'>
          <div className='font-koho flex flex-col bg-gray-50 text-gray-900 px-6 py-4 rounded-sm'>
            <Calendar
              className={
                'flex flex-col justify-center space-y-3 items-center calendar'
              }
              onChange={onCalendarChange}
              value={value}
              minDate={new Date()}
            />
            <div className='flex flex-row justify-between mt-6 mx-3'>
              <button onClick={onClose}>Cancel</button>
              <button
                className='w-1/2 bg-brand-orange text-white py-1 px-3 rounded-sm'
                onClick={() => {
                  handleSave();
                }}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;

CalendarModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
