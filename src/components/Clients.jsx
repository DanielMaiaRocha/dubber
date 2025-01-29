import React from 'react'

const handleLoginButtonClick = () => {
    window.location.href = "/login"; 
};  

const Clients = () => {
  return (
    <div className='w-full py-[10rem] px-4 bg-white'>
        <div className='max-w-[1240px] mx-auto grid md:grid-cols-3 gap-8'>
            <div className='w-full border-2 rounded-md shadow-xl flex flex-col p-4 m-0 md:m-4 hover:scale-105 duration-200'>
                <img
                    className='mx-auto mt-[-3rem] bg-white'
                    src={"/images/microfonesvg.png"}
                    alt='/'
                    width={50}
                    height={50}
                />
                <h2 className='text-2xl font-customFont font-bold text-[#17a2b8] text-center py-8'>Find everything you need for your production</h2>
                <p className='text-lg font-customFont text-[#97969d] font-bold text-center py-4'>Here you can find all the professionals for your production and get all set for begin your project.</p>
                <p className='text-lg font-customFont text-[#97969d] font-bold text-center py-4'>Never was so easy to start your production</p>
                <button onClick={handleLoginButtonClick} className='text-lg font-customFont font-bold rounded-md text-white bg-[#17a2b8] hover:bg-[#468089] my-6 mx-auto px-6 py-3'>See more</button>
            </div>
            <div className='w-full border-2 rounded-md shadow-xl flex flex-col p-4 my-8 md:m-4 hover:scale-105 duration-200'>
                <img
                    className='mx-auto mt-[-3rem] bg-white'
                    src={"/images/world.png"}
                    alt='/'
                    width={50}
                    height={50}
                />
                <h2 className='text-2xl font-customFont font-bold text-[#17a2b8] text-center py-8'>Work Everywhere</h2>
                <p className='text-lg font-customFont text-[#97969d] font-bold text-center py-4'>With our plataform, after you get all the needs for the begin the project, you gains acess to our very own virtual studio, with everything for make the best project ever.</p>
                <p className='text-lg font-customFont text-[#97969d] font-bold text-center py-4'>Work everywhere with the same quality of a presencial studio</p>
                <button onClick={handleLoginButtonClick} className='text-white text-lg font-customFont font-bold rounded-md bg-[#17a2b8] hover:bg-[#468089] my-6 mx-auto px-6 py-3'>See more</button>
            </div>
              <div className='w-full border-2 rounded-md shadow-xl flex flex-col p-4 m-0 md:m-4 hover:scale-105 duration-200'>
                <img
                    className='mx-auto mt-[-3rem] bg-white'
                    src={"/images/user.png"}
                    alt='/'
                    width={50}
                    height={50}
                />
                <h2 className='text-2xl font-customFont font-bold text-[#17a2b8] text-center py-8'>Easier Acess</h2>
                <p className='text-lg font-customFont text-[#97969d] font-bold text-center py-4'>In our plataform, you can find the best professionals with easy way to make contact and start producing as fast you need! Working only with the best.</p>
                <p className='text-lg font-customFont text-[#97969d] font-bold text-center py-4'>Getting the best for you to make the best for the other people.</p>
                <button onClick={handleLoginButtonClick} className='text-white text-lg font-customFont font-bold rounded-md bg-[#17a2b8] hover:bg-[#468089] my-6 mx-auto px-6 py-3'>See more</button>
            </div>
        </div>
    </div>
  )
}

export default Clients