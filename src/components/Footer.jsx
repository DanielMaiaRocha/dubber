import React from 'react'
import FooterLink from './FooterLinks'

const footerLinks = [
    {
        title: "Website",
        path: "/"
    },

    {
        title: "System",
        path: "https://alcateia.dubsol.app/login.php"
    },

    {
        title: "About",
        path: "/"
    },
    {
        title: "Contact us",
        path: "/contact"
    },
]

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white'>
        <div className='md:flex md:justify-between md:items-center sm:px-12 px-4 py-7'>
            <div className='md:flex-1 flex justify-center'>
                <img 
                    src={"/images/logodubsol.png"}
                    alt='/'
                    width={350}
                    height={350}
                />
            </div>
            <div className="md:flex-1 flex flex-col gap-3 justify-center mb-5">
                <h1 className='text-3xl text-[#17a2b8] font-sans font-bold text-center'>Links:</h1>
                <ul className='text-lg font-sans font-semibold flex flex-row justify-center items-center text-center gap-2'>
                  {footerLinks.map((link, index) =>(
                    <li key={index}>
                        <FooterLink href={link.path} title={link.title} />
                    </li>
                  ))}
                </ul>
            </div>
            <div className='md:flex-1 flex flex-col gap-3 justify-center mb-5'>
                <div className='flex flex-row justify-center gap-20'>
                    <img 
                        src={"/images/ega1.jpg"}
                        alt='/'
                        width={120}
                        height={120}
                    />
                    <img 
                        src={"/images/vitrina.jpg"}
                        alt='/'
                        width={120}
                        height={120}
                    />
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
