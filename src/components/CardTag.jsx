import React from 'react'

const CardTag = ({name, onClick, isSelected}) => {
    const buttonStyles = isSelected 
    ? "text-white bg-[#17a2b8] border-black"
    : "text-black border-black hover:border-slate-600" 
  return (
    <button className= {`${buttonStyles} rounded-lg border px-6 py-3 text-xl cursor-pointer`} onClick={() => onClick(name)}>
        {name}
    </button>
  )
}

export default CardTag