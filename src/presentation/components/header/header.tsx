import React from 'react'
import { FiUser, FiShoppingBag } from 'react-icons/fi'
import logoImg from '@/presentation/assets/test.svg'
import Styles from './header-styles.scss'

const Header: React.FC = () => {
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <div className={Styles.logo}>
          <object data={logoImg} type="image/svg+xml" />
        </div>
        <div className={Styles.headerLinks}>
          <div className={Styles.userAddress}>
            <span>ENTREGAR EM</span>
            <span>Blend Apartments</span>
          </div>
          <div>
            <FiUser size={25} />
            <FiShoppingBag size={25} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
