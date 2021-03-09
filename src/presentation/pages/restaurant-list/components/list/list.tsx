import React from 'react'
import Item from '../item/item'
import Styles from './list-styles.scss'

const List: React.FC = () => {
  return (
    <ul className={Styles.listWrap}>
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
      <Item />
    </ul>
  )
}

export default List
