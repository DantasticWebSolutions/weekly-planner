import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import _ from 'underscore';
import CalendarModal from '../components/CalendarModal';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsCalendarCheck } from 'react-icons/bs';

const Recipe = () => {
  let params = useParams();
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const stepId = 1;
  const recipeName = recipe.name;
  const [showModal, setShowModal] = useState(false);
  // const [showMenu, setShowMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const navigate = useNavigate();

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
      {!loading && (
        <div>
          <button
            className='go-back'
            onClick={() => {
              navigate(-1);
            }}>
            <IoIosArrowBack className='orange' />
          </button>
          <div
            className='imgContainer'
            style={{ backgroundImage: `url(${recipe.photo_url})` }}></div>
          <div className='recipe-info'>
            <div className='recipe-info-title'>
              {/* <h6>{recipe.difficulty_level}</h6> */}
              <h5>{recipe.time}</h5>
              <div className='recipe-info-titile-buttons-container'>
                <div className='recipe-info-titile-button'>
                  <button
                    onClick={addIngredientsToShoppingList}
                    className=''
                    id='0'>
                    <AiOutlineShoppingCart />
                  </button>
                  {/* <span>Shopping List</span> */}
                </div>

                <h1>{recipe.name}</h1>
                <div className='recipe-info-titile-button'>
                  <button onClick={openCalendarModal} className='' id='1'>
                    <BsCalendarCheck />
                  </button>
                  {/* <span>Calendar</span> */}
                </div>
              </div>
            </div>
            <div className='energy-levels-container'>
              <div className='energy-level'>
                <span>{recipe.energy} kcal</span>
                <span>Energy</span>
              </div>
              <div className='energy-level'>
                <span>{`${recipe.protein}`} g</span>
                <span>Protein</span>
              </div>
              <div className='energy-level'>
                <span>{recipe.carbs} g</span>
                <span>Carbs</span>
              </div>
              <div className='energy-level'>
                <span>{recipe.fat} g</span>
                <span>Fat</span>
              </div>
            </div>
            <div className='ingredients-container'>
              <h2>Ingredients</h2>
              <div>
                {recipe.ingredients.map((ingredient) => (
                  <p className='ingredients-list' key={ingredient}>
                    {ingredient}
                  </p>
                ))}
              </div>
            </div>
            {/* <div>
              <h2>Instructions</h2>
              {recipe.instructions.map((instruction) => (
                <p key={instruction}>{instruction}</p>
              ))}
            </div> */}

            <Link
              className='primary-button'
              to={{
                pathname: `step/${stepId}`,
                recipe: recipe,
              }}>
              <span>START COOKING</span>
              <IoIosArrowForward />
            </Link>
          </div>
        </div>
      )}
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
