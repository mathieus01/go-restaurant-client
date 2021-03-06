import React, { useRef } from 'react'
import Styles from './input-styles.scss'

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>()
  return (
    <div
      className={Styles.inputWrap}
    >
      <input
        {...props}
        ref={inputRef}
        placeholder=" "
      />
      <label
        onClick={() => { inputRef.current.focus() }}
      >
        {props.placeholder}
      </label>
    </div>
  )
}

export default Input
