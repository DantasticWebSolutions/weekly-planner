import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { DateTime } from 'luxon';
import {
  doc,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { confirmAlert } from 'react-confirm-alert';
import RecipeCardFluid from '../components/RecipeCardFluid';
import { BsCalendar2Plus } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

// NOTIFICATION
const createNotification = (type, message) => {
  return () => {
    switch (type) {
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message, 'Success', 1000);
        break;
      case 'warning':
        NotificationManager.warning(message, 'Warning', 3000);
        break;
      case 'error':
        NotificationManager.error(message, 'Error', 5000);
        break;
      default:
        break;
    }
  };
};

const WeeklyPlanner = () => {
  const navigate = useNavigate();
  const userUID = localStorage.getItem('userUID');

  const [loading, setLoading] = useState(true);
  const [planner, setPlanner] = useState([]);

  const IsoToday = DateTime.now().toISO();
  const formattedToday = DateTime.now().toLocaleString(DateTime.DATE_HUGE);
  const tomorrow = DateTime.now().plus({ days: 1 });
  const formattedTomorrow = tomorrow.toLocaleString(DateTime.DATE_HUGE);

  function weekDayFormatting(item) {
    const formattedDate = DateTime.fromISO(item).toLocaleString(
      DateTime.DATE_HUGE
    );
    if (formattedDate === formattedToday) {
      return 'Today';
    } else if (formattedDate === formattedTomorrow) {
      return 'Tomorrow';
    } else {
      return formattedDate;
    }
  }

  const getWeeklyPlanner = (userId) =>
    getDocs(collection(db, `weekly-planner-${userId}`));

  const getWeeklyPlannerData = async () => {
    const listSnap = await getWeeklyPlanner(userUID);
    let planner = [];
    if (listSnap.size) {
      listSnap.forEach((doc) => {
        if (doc.data().date > IsoToday) {
          planner.push({ ...doc.data(), ...{ id: doc.id } });
        }
      });
      setPlanner(planner);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeeklyPlannerData(userUID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickDelete = (userId, id) => {
    setLoading(true);
    setPlanner(planner.filter((item) => item.id !== id));
    deleteDoc(doc(db, `weekly-planner-${userId}`, id));
    setLoading(false);
  };

  const [show, setShow] = useState(true);
  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const confirmDelete = (id) => {
    handleShow();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Meal</Modal.Title>
            </Modal.Header>
            <Modal.Body className='confirm-alert'>
              <h1 className='flex flex-row space-x-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-red-400 h-6 w-6'
                  viewBox='0 0 24 24'
                  stroke='#f06e1d'
                  fill='none'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
                <span>Are you sure?</span>
              </h1>
              <p className='text-sm'>
                Recipe will be removed from your weekly planner.
              </p>
            </Modal.Body>
            <Modal.Footer className='modal-footer'>
              <div className='button-container'>
                <button
                  className='py-1 px-3 rounded-sm secondary-button'
                  onClick={onClose}>
                  Cancel
                </button>
                <button
                  className='text-white py-1 px-3 rounded-sm primary-button'
                  onClick={() => {
                    handleClickDelete(userUID, id);
                    onClose();
                  }}>
                  Remove
                </button>
              </div>

              {/* <form onSubmit={handleCheckout}></form> */}
            </Modal.Footer>
          </Modal>
        );
      },
    });
    navigate('/weekly-planner');
  };

  const addToWeeklyPlanner = async (date, recipeName, recipe) => {
    const add = {
      ...{ date: date, recipe },
    };
    const recipeRef = doc(
      db,
      `weekly-planner-${userUID}`,
      `${date}-${recipeName}`
    );

    try {
      await setDoc(recipeRef, add, { merge: true });
      createNotification('success', 'Recipe has been added to your planner.');
    } catch (e) {
      createNotification('error', 'Oops, something went wrong. Try again!');
      console.log(e);
    }
  };

  const handleClickMove = (id, recipeName, date, recipe) => {
    setLoading(true);
    deleteDoc(doc(db, `weekly-planner-${userUID}`, id))
      .then(addToWeeklyPlanner(date, recipeName, recipe))
      .then(getWeeklyPlannerData(userUID));
    setLoading(false);
  };

  const confirmMove = (id, recipeName, date, recipe) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
              <Modal.Title>Change Meal Date </Modal.Title>
            </Modal.Header>
            <Modal.Body className='confirm-alert'>
              <h1 className='flex flex-row space-x-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-red-400 h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='#f06e1d'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
                <span>Are you sure?</span>
              </h1>
              <p className='text-sm'>
                Recipe will be moved to the selected date.
              </p>
            </Modal.Body>
            <Modal.Footer className='modal-footer'>
              <div className='button-container'>
                <button className='secondary-button' onClick={onClose}>
                  Cancel
                </button>
                <button
                  className='bg-red-500 text-white py-1 px-3 rounded-sm primary-button'
                  onClick={() => {
                    handleClickMove(id, recipeName, date, recipe);
                    onClose();
                  }}>
                  Yes, Move it!
                </button>
              </div>
              {/* <form onSubmit={handleCheckout}></form> */}
            </Modal.Footer>
          </Modal>
        );
      },
    });
  };

  console.log(planner);

  return (
    <div>
      {!loading && planner.length === 0 && (
        <div className={'weekly-planner-no-recipes'}>
          <h1>Your weekly planner is empty.</h1>
          <p>Add some recipes to the planner from the main page</p>
          <Link to='/'>
            <BsCalendar2Plus className='weekly-planner-no-recipes-icon' />
          </Link>
        </div>
      )}
      {!loading && planner.length > 0 && (
        <div className='mb-25 p-4 pb-28'>
          {/* <div className='title mb-3'>
            <h2 className='text-lg'>Your next meal are:</h2>
          </div> */}
          <div className='flex flex-col space-y-6'>
            <div className=''>
              {planner.map((item) => (
                <div key={item.id} style={{ margin: '10px' }}>
                  <div className='title text-left'>
                    <h2 className='text-lg capitalise'>
                      {weekDayFormatting(item.date)}
                    </h2>
                  </div>
                  <RecipeCardFluid
                    key={`${item.date}-${item.recipe.name}`}
                    date={item.date}
                    id={`${item.date}-${item.recipe.name}`}
                    recipe={item.recipe}
                    formatedDate={weekDayFormatting(item.date)}
                    onMove={confirmMove}
                    onDelete={confirmDelete}
                    handleShow={handleShow}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;
