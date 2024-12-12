import ApiConfig from "../Api/ApiConfig";
import DataComponent from "./dataComponent";





const Nifty50 = () => {
    const Api = ApiConfig.nifty50
   

    return (
        <>
        <section className="relative">
        <h1 className='text-center text-4xl mb-8 font-bold tracking-widest'>Nifty50</h1>
       <DataComponent  Api={Api}/>
     
        </section>
        </>
      
       
       
    );
};

export default Nifty50;
