import { MutatingDots } from 'react-loader-spinner'

const LoaderLazy = () => {
    return (
        <>
            <div className='center-loader'>
                <MutatingDots
                    height="80"
                    width="80"
                    radius="9"
                    color='green'
                    ariaLabel='three-dots-loading'
                    wrapperStyle
                    wrapperClass
                />
            </div>
        </>
    )
}
export default LoaderLazy;
