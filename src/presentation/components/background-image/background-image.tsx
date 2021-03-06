import React from 'react'
import Styles from './background-image-styles.scss'
import backImg from '@/presentation/assets/fundo.jpg'

const BackgroundImage: React.FC = () => {
  return (
    <div className={Styles.backgroundImageWrap}>
      <img src={backImg} alt="fundo"/>
    </div>
  )
}

export default BackgroundImage
