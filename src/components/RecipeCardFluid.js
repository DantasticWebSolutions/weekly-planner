import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsCalendarCheck } from 'react-icons/bs';
// import {
//   doc,
//   getFirestore,
//   setDoc
// } from 'firebase/firestore';
import CalendarModal from '../components/CalendarModal';
// import {NotificationContainer, NotificationManager} from 'react-notifications';

RecipeCardFluid.propTypes = {
  recipe: PropTypes.object,
};

function RecipeCardFluid(props) {
  const { recipe, onDelete, onMove, id } = props;
  // const userUID = localStorage.getItem('userUID');
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  console.log(selectedDate);
  const removeRecipe = () => {
    onDelete(id);
  };

  const moveRecipe = (date) => {
    onMove(id, recipe.name, date, recipe);
  };

  // const displayMenu = (e) => {
  //   setShowMenu(!showMenu);
  // };

  // const addToWeeklyPlanner = async (date, recipeName) => {
  //   const add = {
  //     ...{ date: date, recipe },
  //   };
  //   const recipeRef = doc(
  //     db,
  //     `weekly-planner-${userUID}`,
  //     `${date}-${recipeName}`
  //   );

  //   try {
  //     await setDoc(recipeRef, add, { merge: true });
  //     alert('Recipe has been moved');
  //   } catch (e) {
  //     alert('Oops, something went wrong. Try again!');
  //     console.log(e);
  //   }
  // };

  const openCalendarModal = () => {
    setShowModal(!showModal);
    setShowMenu(!showMenu);
  };

  const handleSelectedDate = (date) => {
    setSelectedDate(date);
    moveRecipe(date);
    setShowModal(false);
  };

  return (
    <div
      className='recipeCard'
      style={{
        background: `url(${recipe.photo_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      no-repeat='true'>
      <div className='top-buttons-card'>
        <div
          onClick={() => {
            removeRecipe();
          }}
          className='delete-button'
          id='2'>
          <AiOutlineCloseCircle />
        </div>
        <div onClick={openCalendarModal} className='move-day-button' id='1'>
          <BsCalendarCheck />
        </div>
      </div>
      <Link to={`/recipe/${recipe.name}`} className='w-100'>
        <div className='gradient-background'>
          <div className='w-100'>
            <svg
              width='12'
              height='12'
              viewBox='0 0 12 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: '5px' }}>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M6.00001 0.166668C9.21651 0.166668 11.8333 2.7835 11.8333 6C11.8333 9.2165 9.21651 11.8333 6.00001 11.8333C2.78351 11.8333 0.166672 9.2165 0.166672 6C0.166672 2.7835 2.78351 0.166668 6.00001 0.166668ZM6.00001 1.04167C3.26592 1.04167 1.04167 3.26592 1.04167 6C1.04167 8.73409 3.26592 10.9583 6.00001 10.9583C8.73409 10.9583 10.9583 8.73409 10.9583 6C10.9583 3.26592 8.73409 1.04167 6.00001 1.04167ZM5.80237 3.13898C6.04446 3.13898 6.23987 3.33498 6.23987 3.57648V6.15598L8.22612 7.34015C8.43321 7.4644 8.50146 7.73274 8.37779 7.9404C8.29554 8.07749 8.15029 8.1539 8.00154 8.1539C7.92512 8.1539 7.84812 8.13407 7.77754 8.09265L5.57837 6.78074C5.44654 6.7014 5.36487 6.55849 5.36487 6.40449V3.57648C5.36487 3.33498 5.56087 3.13898 5.80237 3.13898Z'
                fill='white'
              />
            </svg>
            <span>{recipe.time}</span>
          </div>
          <div className=' pb-1 z-10'>{recipe.name}</div>
        </div>
      </Link>
      {/* {showMenu && ( */}
      {showModal && (
        <CalendarModal
          onClose={openCalendarModal}
          show={showModal}
          onSelectedDate={handleSelectedDate}
        />
      )}
    </div>
  );
}

export default RecipeCardFluid;