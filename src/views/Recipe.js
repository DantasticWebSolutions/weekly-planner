import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import _ from 'underscore';
import CalendarModal from '../components/CalendarModal';

const Recipe = () => {
  let params = useParams();
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const stepId = 1;
  const recipeName = recipe.name;
  const [showModal, setShowModal] = useState(false);
  // const [showMenu, setShowMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  //   GET RECIPE BASED ON PARAMS

  const getSingleRecipe = async () => {
    const docRef = doc(db, 'recipes', params.recipeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //   console.log('Document data:', docSnap.data());
      setRecipe(docSnap.data());
      setLoading(false);
    } else {
      console.log('No such document!');
      setLoading(false);
    }
  };
  console.log(selectedDate);

  useEffect(() => {
    getSingleRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(recipe);

  //   ADD TO SHOPPING LIST

  const { currentUser } = useAuth();

  const createShoppingList = (userId, recipeName, ingredients) =>
    setDoc(doc(db, `shopping-list-${userId}`, recipeName), ingredients, {
      merge: true,
    });
  const addIngredientsToShoppingList = async () => {
    const addTL = { ...recipe.ingredients };

    try {
      await createShoppingList(currentUser.uid, recipe.name, addTL).then(
        alert('Added to shopping list ')
      );
    } catch (e) {
      alert('Error when adding to shopping list');
      console.log(e);
    }
  };

  //   ADD TO WEEKLY CALENDAR

  const addToWeeklyPlanner = async (date, recipeName) => {
    const add = {
      ...{ date: date, recipe },
    };

    const recipeRef = doc(
      db,
      `weekly-planner-${currentUser.uid}`,
      `${date}-${recipeName}`
    );

    try {
      await setDoc(recipeRef, add, { merge: true });
      _.debounce(alert('Added to weekly calendar '), 500);
    } catch (e) {
      alert('Error when added to weekly calendar');
      console.log(e);
    }
  };

  const openCalendarModal = () => {
    setShowModal(!showModal);
  };

  const handleSelectedDate = (date) => {
    setSelectedDate(date);
    addToWeeklyPlanner(date, recipeName);
    setShowModal(false);
  };

  return (
    <div>
      {!loading ? (
        <div>
          Recipe
          <h5>{recipe.time}</h5>
          <h1>{recipe.name}</h1>
          <h6>{recipe.difficulty_level}</h6>
          <div>
            <h2>Ingredients</h2>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </div>
          <div>
            <h2>Instructions</h2>
            {recipe.instructions.map((instruction) => (
              <p key={instruction}>{instruction}</p>
            ))}
          </div>
        </div>
      ) : (
        'Still Loading'
      )}
      <Link
        to={{
          pathname: `step/${stepId}`,
          recipe: recipe,
        }}
        className=''>
        <span>START COOKING</span>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M10.8366 12.3607L10.835 12.0066C10.835 10.535 10.9212 9.19332 11.051 8.31871L11.1648 7.77483C11.228 7.48678 11.3112 7.1588 11.3979 6.99137C11.7154 6.37892 12.3361 6 13.0005 6H13.0583C13.4914 6.01432 14.4012 6.39435 14.4012 6.40756C15.8652 7.02183 18.6895 8.87572 19.994 10.1974L20.3731 10.5942C20.4723 10.7017 20.5839 10.829 20.6531 10.9282C20.8844 11.2344 21 11.6134 21 11.9923C21 12.4153 20.8702 12.8085 20.6247 13.1302L20.2353 13.5505L20.148 13.6402C18.9644 14.9234 15.8739 17.0218 14.2572 17.664L14.0131 17.7576C13.7194 17.8629 13.3078 17.9884 13.0583 18C12.7408 18 12.4376 17.9262 12.1485 17.7808C11.7874 17.577 11.4994 17.2554 11.3401 16.8764C11.2387 16.6143 11.0794 15.8267 11.0794 15.8124C10.9334 15.0183 10.8487 13.7652 10.8366 12.3607ZM3 11.9996C3 11.1613 3.67308 10.4817 4.50325 10.4817L8.20248 10.8088C8.85375 10.8088 9.38174 11.3419 9.38174 11.9996C9.38174 12.6583 8.85375 13.1903 8.20248 13.1903L4.50325 13.5175C3.67308 13.5175 3 12.8378 3 11.9996Z'
            fill='white'
          />
        </svg>
      </Link>

      <button onClick={addIngredientsToShoppingList} className='' id='0'>
        Add to shopping list
      </button>

      <button onClick={openCalendarModal} className='' id='1'>
        Add to my week
      </button>

      {showModal && (
        <CalendarModal
          onClose={openCalendarModal}
          show={showModal}
          onSelectedDate={handleSelectedDate}
        />
      )}
    </div>
  );
};

export default Recipe;
