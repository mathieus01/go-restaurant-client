import React, { useRef, useContext } from 'react'
import { FormContext } from '@/presentation/contexts'
import Styles from './radio-button-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const RadioButton: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
  const inputRef = useRef<HTMLInputElement>()
  const error = state[`${props.name}Error`]
  return (
    <div
      className={Styles.radioButtonWrap}
      data-testid={`${props.name}-wrap`}
    >
      <label
        data-testid={`${props.name}-label`}
        onClick={() => { inputRef.current.focus() }}
        title={error}
      >
        <input
          type="radio"
          name={props.name}
          value={props.value}
          ref={inputRef}
          title={error}
          onChange={e => { setState({ ...state, [e.target.name]: e.target.value }) }}
          checked={props.name === state.isRestaurant}
        />
        {props.placeholder}
      </label>
    </div>
  )
}

export default RadioButton
