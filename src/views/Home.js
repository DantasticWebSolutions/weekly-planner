import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  // async function setRecipes() {
  //   try {
  //     const docRef = await addDoc(collection(db, 'recipes', 'Lasagne'), {
  //       first: 'Ada',
  //       last: 'Lovelace',
  //       born: 1815,
  //     });
  //     console.log('Document written with ID: ', docRef.id);
  //   } catch (e) {
  //     console.error('Error adding document: ', e);
  //   }
  // }
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

  // const getSingleRecipe = async () => {
  //   const docRef = doc(db, 'recipes', '1');
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     console.log('Document data:', docSnap.data());
  //   } else {
  //     console.log('No such document!');
  //   }
  // };
  useEffect(() => {
    // setRecipes();
    getRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // getSingleRecipe();
  }, []);

  console.log(recipes);
  return (
    <div>
      The recipes are:
      {recipes.map((recipe) => (
        <Link
          to={`/recipe/${recipe.id}`}
          key={recipe.id}
          className='col-span-2'>
          <RecipeCard recipe={recipe} />
        </Link>
      ))}
    </div>
  );
};

export default Home;
