import Calendar from 'react-calendar';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'react-calendar/dist/Calendar.css';
import { Modal } from 'react-bootstrap';

function CalendarModal(props) {
  let { value, onClose, onSelectedDate, showModal } = props;
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [formattedCalendarValue, setFormattedCalendarValue] = useState();

  onClose = (e) => {
    props.onClose && props.onClose(e);
  };

  console.log(formattedCalendarValue);
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
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Choose Date for Meal</Modal.Title>
      </Modal.Header>
      <Modal.Body className='confirm-alert'>
        {/* <svg
          id='react-confirm-alert-firm-svg'
          className='react-confirm-alert-svg'>
          <filter id='gaussian-blur'>
            <feGaussianBlur stdDeviation='0.3'></feGaussianBlur>
          </filter>
        </svg> */}
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
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className='modal-footer'>
        <div className='button-container'>
          <button onClick={onClose} className='secondary-button'>
            Cancel
          </button>
          <button
            className='rounded-sm primary-button'
            onClick={() => {
              handleSave();
            }}>
            Save
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default CalendarModal;

CalendarModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};
