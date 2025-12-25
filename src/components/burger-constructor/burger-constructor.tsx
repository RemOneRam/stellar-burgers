import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  selectIsAuthenticated
} from '../../services/selectors';
import {
  createOrder,
  clearOrderModal
} from '../../services/slices/orderModalSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
    dispatch(clearConstructor());
  };

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
