import React from 'react'
import Styles from './radio-button-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const RadioButton: React.FC<Props> = (props: Props) => {
  return (
    <div className={Styles.radioButtonWrap}>
      <input type="radio" name={props.name} value={props.name}/>
      <label>{props.placeholder}</label>
    </div>
  )
}

export default RadioButton
