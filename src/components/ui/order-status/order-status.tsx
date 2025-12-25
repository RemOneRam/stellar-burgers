import React, { FC } from 'react';
import { OrderStatusUIProps } from './type';

export const OrderStatusUI: FC<OrderStatusUIProps> = ({ textStyle, text }) => (
  <p
    className='text text_type_main-default pt-2'
    style={{ color: textStyle, margin: 0 }}
  >
    {text}
  </p>
);
