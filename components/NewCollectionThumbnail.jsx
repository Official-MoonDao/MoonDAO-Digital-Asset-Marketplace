import LogoSmall from '../assets/LogoSmall'

const NewCollectionThumbnail = ({img, name, creator}) => {
  return (
    <article className='relative flex flex-col items-center border border-white border-opacity-50 pb-7'>
        <img className='w-[319px] h-[211px]' src={img} alt={`${name} collection thumbnail`} />
        <span className='absolute top-6 left-6'>
        <LogoSmall />
        </span>
        <h6 className='mt-7 font-bold text-lg tracking-wide'>{name}</h6>
        <p className='mt-[5px] text-moon-secondary text-sm font-sans'>{creator}</p>
    </article>
  )
}

export default NewCollectionThumbnail