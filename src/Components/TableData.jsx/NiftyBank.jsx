import ApiConfig from "../Api/ApiConfig";
import DataComponent from "./dataComponent";













const NiftyBank = () => {
    const Api = ApiConfig.niftyBank
   
    return (
        <>
        <section className="relative">
        <h1 className='text-center text-4xl mb-8 font-bold tracking-widest'>Nifty Bank</h1>
       <DataComponent  Api={Api}/>
        </section>
       
        </>
       
    );
};

export default NiftyBank;
