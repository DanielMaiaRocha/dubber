import React from 'react'
import Navlink from './Navlink'

const MenuOverlay = ({ links }) => {
  return (
    <ul className='flex flex-col py-4 items-center'>
      {links.map((links, index) => (
        <li key={index}>
            <Navlink href={links.path} title={links.title} />     
        </li>
        ))}
    </ul>
  )
}

export default MenuOverlay
