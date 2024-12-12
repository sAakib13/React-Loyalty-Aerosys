import React from 'react';
import clientlogo from '../../assets/client_logos.webp';

const Brands = () => {
    return (
        <div className='m-6 '>
            <div className='flex item-center justify-center m-4 lg:flex-row md:flex-col sm:flex-col'>
                <h2 className='lg:text-tiny text-center text-light px-6 py-1 md:text-sm sm:text-sm'>Trusted By</h2>
                <img className="lg:w-[70%] lg:h-[70%] md:w-[100%] md:h-[100%] sm:w-[100%] sm:h-[100%]" src={clientlogo} alt='client-logo' />
            </div>
            <div className='border-b-2 border-black-500 m-5'></div>
        </div>
    );
};

export default Brands;
