import React, { useRef, useContext } from 'react'
import { FormContext } from '@/presentation/contexts'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext)
  const inputRef = useRef<HTMLInputElement>()
  const error = state[`${props.name}Error`]

  return (
    <div
      data-testid={`${props.name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input
        {...props}
        ref={inputRef}
        title={error}
        data-testid={props.name}
        placeholder=" "
        onChange={e => { setState({ ...state, [e.target.name]: e.target.value }) }}
      />
      <label
        onClick={() => { inputRef.current.focus() }}
        data-testid={`${props.name}-label`}
        title={error}
      >
        {props.placeholder}
      </label>
    </div>
  )
}

export default Input
