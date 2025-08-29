

interface user {
    name:string;
    age:number;
}

async function fetechUser() : Promise<user[]> 
{
const response= await fetch('https://jsonplaceholder.typicode.com/users');
if (! response.ok){
    throw new Error (`http error status`);
}
//parse json data
const data : user[] = await response.json();
return data
}

//exammple Usage

fetechUser().then(user =>{
    console.log("hi ");
})