import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { IoIosArrowBack } from 'react-icons/io';

const CookRecipe = () => {
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
  return (
    <div>
      {!loading && (
        <div>
          <button
            className='go-back'
            onClick={() => {
              navigate(-1);
            }}>
            <IoIosArrowBack />
          </button>
          <div
            className='imgContainer'
            style={{ backgroundImage: `url(${recipe.photo_url})` }}></div>
        </div>
      )}

      <div className='recipe-info'>
        {loading ? (
          '-/-'
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h1>{recipe.name}</h1>
            <div style={{ marginBottom: '10px' }}>
              {currentStep} / {steps}
            </div>
            <div className='progress-bar-container'>
              <div
                className='progress-bar'
                style={{ width: `${progress}` }}></div>
            </div>
          </div>
        )}
        <div className='pt-4 leading-relaxed text-gray-800'>
          {loading ? 'Loading' : step}
        </div>
        {loading ? (
          <div className='loading'>
            <span>Loading</span>
          </div>
        ) : (
          <div className='button-container'>
            <Link to='/' className='secondary-button'>
              Cancel
            </Link>
            <Link
              className='primary-button'
              onClick={updateState}
              to={
                currentStep < steps
                  ? `/recipe/${recipeId}/step/${nextStep}`
                  : `/`
              }>
              <span>{currentStep < steps ? 'CONTINUE' : 'FINISH'}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookRecipe;
