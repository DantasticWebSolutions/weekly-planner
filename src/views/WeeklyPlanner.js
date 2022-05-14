import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { DateTime } from 'luxon';
import {
  doc,
  collection,
  getDocs,
  getFirestore,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { confirmAlert } from 'react-confirm-alert';
import RecipeCardFluid from '../components/RecipeCardFluid';

const WeeklyPlanner = () => {
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

  const confirmDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='font-koho mx-8 flex flex-col bg-gray-50 text-gray-900 px-6 py-4 rounded-sm'>
            <h1 className='flex flex-row space-x-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='text-red-400 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
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
            <div className='flex flex-row justify-between mt-5'>
              <button onClick={onClose}>Cancel</button>
              <button
                className='bg-red-500 text-white py-1 px-3 rounded-sm'
                onClick={() => {
                  handleClickDelete(userUID, id);
                  onClose();
                }}>
                Yes, Remove it!
              </button>
            </div>
          </div>
        );
      },
    });
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
      alert('Recipe has been added to your planner.');
    } catch (e) {
      alert('Oops, something went wrong. Try again!');
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
          <div className='font-koho mx-8 flex flex-col bg-gray-50 text-gray-900 px-6 py-4 rounded-sm'>
            <h1 className='flex flex-row space-x-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='text-red-400 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
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
            <div className='flex flex-row justify-between mt-5'>
              <button onClick={onClose}>Cancel</button>
              <button
                className='bg-red-500 text-white py-1 px-3 rounded-sm'
                onClick={() => {
                  handleClickMove(id, recipeName, date, recipe);
                  onClose();
                }}>
                Yes, Move it!
              </button>
            </div>
          </div>
        );
      },
    });
  };

  return (
    <div>
      WeeklyPlanner
      {!loading && planner.length === 0 && (
        <div
          className={
            'mb-25 p-4 flex flex-col justify-center items-center space-y-5 text-sm ' +
            (window.innerHeight < 700 ? 'py-auto' : 'py-28')
          }>
          {/* <img src={empty} alt='empty calendar'></img> */}
          <p>Your weekly planner is empty.</p>
        </div>
      )}
      {!loading && planner.length > 0 && (
        <div className='mb-25 p-4 pb-28'>
          <div className='flex flex-col space-y-6'>
            {planner.map((item) => (
              <div key={item.id} className='flex flex-col space-y-4'>
                <h2 className='text-lg'>{weekDayFormatting(item.date)}</h2>
                <RecipeCardFluid
                  key={`${item.date}-${item.recipe.name}`}
                  date={item.date}
                  id={`${item.date}-${item.recipe.name}`}
                  recipe={item.recipe}
                  onMove={confirmMove}
                  onDelete={confirmDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlanner;
