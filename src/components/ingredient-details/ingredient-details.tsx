import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsLoading
} from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientData = ingredients.find((ing) => ing._id === id);

  useEffect(() => {
    if (!ingredients.length && !isIngredientsLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isIngredientsLoading]);

  if (isIngredientsLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
