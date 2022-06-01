import React from 'react';

import { SiSpeedtest } from 'react-icons/si';
import { MdOutlineTimer } from 'react-icons/md';

function RecipeCard({ recipe }) {
  return (
    <div
      className='recipeCard'
      style={{
        background: `url(${recipe.photo_url})`,
      }}
      no-repeat='true'>
      <div className='gradient-background'>
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
        <div className='text-xs'>{recipe.name}</div>
      </div>
    </div>
  );
}

export default RecipeCard;
