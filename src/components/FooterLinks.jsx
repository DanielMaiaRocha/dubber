const FooterLink = ({href, title}) => {
    return (
        <a
        href={href} 
            className='block py-2 pl-3 pr-4 font-customFont3 font-semibold text-white sm:text-sl rounded md:p-0 hover:text-zinc-400' >
          {title}
        </a>
    )
}

export default FooterLink;
