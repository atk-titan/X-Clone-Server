import { initServer } from "./app";
import dotenv from 'dotenv';
dotenv.config();

async function init(){
    const app = await initServer();

    app.listen(8000,()=>{
        console.log('server started at Port:8000')
    })
}

init();