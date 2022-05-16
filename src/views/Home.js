import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const { currentUser } = useAuth();
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
      <div className='title mt-4 mb-2'>
        <h1>
          Hello{' '}
          {currentUser.displayName
            ? currentUser.displayName
            : currentUser.email}
        </h1>
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

// <div className='z-50 origin-top-right absolute right-0 w-40 rounded-md shadow-lg bg-white focus:outline-none'>
//             <div className='z-40 py-1'>
//               <Link
//                 to={`/recipe/${recipe.id}`}
//                 className='text-gray-700 block px-4 py-2 text-xs'
//                 id='0'>
//                 Open recipe
//               </Link>
//               <div
//                 onClick={openCalendarModal}
//                 className='text-gray-700 block px-4 py-2 text-xs'
//                 id='1'>
//                 Move day
//               </div>
//               <p
//                 onClick={() => {
//                   removeRecipe();
//                 }}
//                 className='text-red-500 block px-4 py-2 text-xs'
//                 id='2'>
//                 Remove from my week
//               </p>
//             </div>
