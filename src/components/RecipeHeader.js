import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import CalendarModal from '../components/CalendarModal';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { BsCalendarCheck } from 'react-icons/bs';
import { SiSpeedtest } from 'react-icons/si';
import { MdOutlineTimer } from 'react-icons/md';
import { NotificationManager } from 'react-notifications';

// NOTIFICATION
const createNotification = (type, message) => {
  return () => {
    switch (type) {
      case 'info':
        NotificationManager.info(message);
        break;
      case 'success':
        NotificationManager.success(message, 'Success', 3000);
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

const RecipeHeader = () => {
  let params = useParams();
  const recipeId = params.recipeId;
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState({});
  const [steps, setSteps] = useState(null);
  const [stepIndex, setStepIndex] = useState(null);
  const [step, setStep] = useState({});
  const [progress, setProgress] = useState('0%');
  const [currentStep, setCurrentStep] = useState(null);
  const [nextStep, setNextStep] = useState(null);
  const navigate = useNavigate();

  const getRecipeData = async () => {
    const docRef = doc(db, 'recipes', params.recipeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setRecipe(docSnap.data());
      getSteps(docSnap.data());
      getStepIndex(parseInt(params.stepId, 10));
      getStep(docSnap.data(), parseInt(params.stepId, 10) - 1);
      getProgress(
        parseInt(params.stepId, 10),
        docSnap.data().instructions.length
      );
      setLoading(false);
    } else {
      setLoading(false);
      console.log('No recipe!');
    }
  };

  function getSteps(recipe) {
    setSteps(recipe.instructions.length);
  }

  function getStepIndex(stepId) {
    setStepIndex(stepId - 1);
  }

  function getStep(recipe, stepIndex) {
    setStep(recipe.instructions[stepIndex]);
  }

  function getProgress(currentStep, steps) {
    const progress = (currentStep / steps) * 100 + '%';
    setProgress(progress);
  }
  console.log(progress);

  function updateState() {
    setLoading(true);
    setStepIndex(parseInt(params.stepId, 10) - 1);
    setStep(recipe.instructions[stepIndex]);
    getProgress(parseInt(params.stepId, 10), recipe.instructions.length);
    setLoading(false);
  }

  useEffect(() => {
    setCurrentStep(parseInt(params.stepId, 10));
    setNextStep(parseInt(params.stepId, 10) + 1);
    getRecipeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.stepId]);

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
        createNotification('success', 'Added to shopping list')
      );
    } catch (e) {
      createNotification('error', 'Error when added to shopping list');
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
      await setDoc(recipeRef, add, { merge: true }).then(
        createNotification('success', 'Added to weekly calendar ')
      );
      // _.debounce(500);
    } catch (e) {
      createNotification('error', 'Error when added to weekly calendar');
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
        <div className='recipe-info-container'>
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
              <div>
                {' '}
                <MdOutlineTimer
                  style={{
                    marginRight: '5px',
                    marginTop: '-4px',
                    color: '#f06e1d',
                    fontSize: '15px',
                  }}
                />
                <span>{recipe.time} min</span>
                <span>
                  &nbsp;&nbsp;
                  <SiSpeedtest
                    style={{
                      marginRight: '5px',
                      marginTop: '-4px',
                      color: '#f06e1d',
                      fontSize: '13px',
                    }}
                  />
                  {recipe.difficulty_level}
                </span>
              </div>
              <div className='recipe-info-titile-buttons-container'>
                <div className='recipe-info-titile-button'>
                  <button
                    onClick={addIngredientsToShoppingList}
                    className=''
                    id='0'>
                    <AiOutlineShoppingCart />
                  </button>
                </div>

                <h1>{recipe.name}</h1>
                <div className='recipe-info-titile-button'>
                  <button onClick={openCalendarModal} className='' id='1'>
                    <BsCalendarCheck />
                  </button>
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
          </div>
        </div>
      )}
      {showModal && (
        <CalendarModal
          onClose={openCalendarModal}
          show={showModal}
          onSelectedDate={handleSelectedDate}
          showModal={showModal}
        />
      )}
    </div>
  );
};

export default RecipeHeader;
