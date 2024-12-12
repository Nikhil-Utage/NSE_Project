import React from 'react';
import ApiConfig from '../Api/ApiConfig';
import DataComponent from './dataComponent';



const FO = () => {
    const Api = ApiConfig.niftySecurity

    return (
        <>
        <section className='relative'>
        <h1 className='text-center text-4xl mb-8 font-bold tracking-widest'>Securities in F&O</h1>
        <DataComponent Api={Api}/>
        </section>
        
        </>
      
    );
};

export default FO;


