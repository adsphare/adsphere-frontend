"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ListingType } from "@/lib/listings/types";


export default function ListingForm(){


const router = useRouter();


const [loading,setLoading]=useState(false);


const [form,setForm]=useState({

title:"",

location:"",

type:"billboard" as ListingType,

price:"",

description:"",

});



function updateField(
key:keyof typeof form,
value:string
){

setForm(prev=>({

...prev,

[key]:value

}));

}




async function handleSubmit(
e:React.FormEvent
){

e.preventDefault();

setLoading(true);


try{


const response =
await fetch("/api/listings",{

method:"POST",

headers:{
"Content-Type":"application/json",
},


body:JSON.stringify({

...form,

price:Number(form.price),

})

});



if(!response.ok){

throw new Error(
"Listing creation failed"
);

}



router.push("/marketplace");



}catch(error){

console.error(error);

alert(
"Could not create listing"
);


}finally{

setLoading(false);

}


}




return (

<form
onSubmit={handleSubmit}
className="
space-y-5
bg-white/5
border
border-white/10
rounded-2xl
p-8
backdrop-blur-xl
"
>


<input

placeholder="Title"

value={form.title}

onChange={(e)=>
updateField(
"title",
e.target.value
)
}

className="
w-full
p-3
rounded-xl
bg-black/20
border
border-white/10
"

/>



<input

placeholder="Location"

value={form.location}

onChange={(e)=>
updateField(
"location",
e.target.value
)
}

className="
w-full
p-3
rounded-xl
bg-black/20
border
border-white/10
"

/>




<select

value={form.type}

onChange={(e)=>
updateField(
"type",
e.target.value
)
}

className="
w-full
p-3
rounded-xl
bg-black/20
border
border-white/10
"

>


<option value="billboard">
Billboard
</option>


<option value="creator">
Creator
</option>


<option value="screen">
Digital Screen
</option>


<option value="event">
Event
</option>


<option value="ngo">
NGO Visibility
</option>


<option value="business">
Business Space
</option>


<option value="other">
Other
</option>


</select>





<input

type="number"

placeholder="Price"

value={form.price}

onChange={(e)=>
updateField(
"price",
e.target.value
)
}

className="
w-full
p-3
rounded-xl
bg-black/20
border
border-white/10
"

/>





<textarea

placeholder="Description"

value={form.description}

onChange={(e)=>
updateField(
"description",
e.target.value
)
}

className="
w-full
p-3
rounded-xl
bg-black/20
border
border-white/10
"

/>





<button

disabled={loading}

className="
w-full
py-3
rounded-xl
bg-blue-600
hover:bg-blue-500
font-semibold
"

>

{
loading
?
"Creating..."
:
"Create Listing"
}


</button>



</form>

);


}
