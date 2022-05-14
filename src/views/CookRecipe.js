import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

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
      CookRecipe Step{' '}
      {loading ? (
        '-/-'
      ) : (
        <span>
          {currentStep} / {steps}
        </span>
      )}
      <div className='pt-4 leading-relaxed text-gray-800'>
        {loading ? 'Loading' : step}
      </div>
      {loading ? (
        <div className='loading'>
          <span>Loading</span>
        </div>
      ) : (
        <Link
          onClick={updateState}
          to={
            currentStep < steps ? `/recipe/${recipeId}/step/${nextStep}` : `/`
          }
          className=''>
          <span>{currentStep < steps ? 'CONTINUE' : 'FINISH'}</span>
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
      )}
    </div>
  );
};

export default CookRecipe;
