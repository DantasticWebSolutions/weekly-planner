import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const getRecipes = async () => {
    try {
      const recipesSnap = await getDocs(collection(db, 'recipes'));
      // querySnapshot.forEach((doc) => {
      //   console.log(`${doc.id} => ${doc.data()}`);
      // });
      let recipes = [];
      if (recipesSnap.size) {
        recipesSnap.forEach((doc) => {
          recipes.push({ ...doc.data(), ...{ id: doc.id } });
        });
        setRecipes(recipes);
      }
    } catch (error) {
      console.log('There has been an error during the query: ' + error);
    }
  };

  useEffect(() => {
    getRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(recipes);
  return (
    <div>
      <div className=''>
        <h1>Hello Dan</h1>
        <h6>What are you going to cook today?</h6>
      </div>
      <div className='recipeContainer'>
        {recipes.map((recipe) => (
          <Link
            to={`/recipe/${recipe.id}`}
            key={recipe.id}
            style={{ margin: '10px' }}>
            <RecipeCard recipe={recipe} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
