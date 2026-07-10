"use client";

import Hero from "@/components/ui/Hero";
import Link from "next/link";
import Image from "next/image";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

import { useEffect, useState } from "react";


export default function HomePage() {


  const [mounted,setMounted] = useState(false);


  useEffect(()=>{
    setMounted(true);
  },[]);



  const {scrollY}=useScroll();



  const heroY = useSpring(
    useTransform(scrollY,[0,700],[0,-40]),
    {
      stiffness:60,
      damping:25
    }
  );



  const sectionY = useSpring(
    useTransform(scrollY,[0,1200],[0,-20]),
    {
      stiffness:60,
      damping:30
    }
  );



  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);



  useEffect(()=>{

    if(!mounted) return;


    const move=(e:MouseEvent)=>{

      mouseX.set(
        (e.clientX-window.innerWidth/2)*0.015
      );


      mouseY.set(
        (e.clientY-window.innerHeight/2)*0.015
      );

    };


    window.addEventListener(
      "mousemove",
      move
    );


    return()=>window.removeEventListener(
      "mousemove",
      move
    );


  },[mounted]);



  if(!mounted) return null;



return (

<main

className="
relative
min-h-screen
overflow-hidden
bg-[#050816]
text-white
"

>


{/* MOVING BLUE LIGHT */}

<motion.div

style={{
x:mouseX,
y:mouseY
}}

className="
pointer-events-none
absolute
left-1/2
top-1/2
w-[900px]
h-[900px]
-translate-x-1/2
-translate-y-1/2
rounded-full
bg-blue-500/20
blur-[180px]
"

/>





{/* HERO */}

<motion.section

style={{
y:heroY
}}

>


<Hero/>



<ShowcaseImage

src="/showcase/hero.jpg"

alt="Adspheria ecosystem"

contain

/>


</motion.section>







{/* TRUST */}

<section

className="
py-28
text-center
text-xs
md:text-sm
tracking-[0.35em]
text-white/40
"

>

VERIFIED NETWORK • AI RANKING • REAL WORLD VISIBILITY

</section>









{/* METRICS */}


<section

className="
max-w-6xl
mx-auto
px-6
grid
grid-cols-2
md:grid-cols-4
gap-6
py-20
"

>


{

[

["1K+","Visibility Spaces"],
["300+","Connected Brands"],
["50+","Active Locations"],
["24/7","Market Intelligence"]

].map((item,index)=>(


<motion.div


key={index}


whileHover={{
y:-12,
scale:1.04
}}


transition={{
type:"spring",
stiffness:200
}}


className="
rounded-3xl
border
border-white/10
bg-white/[0.06]
backdrop-blur-2xl
p-8
text-center
shadow-2xl
"

>


<h3

className="
text-3xl
font-semibold
text-blue-400
"

>

{item[0]}

</h3>


<p

className="
mt-3
text-white/40
"

>

{item[1]}

</p>


</motion.div>


))

}


</section>









{/* MARKETPLACE */}



<motion.section


style={{
y:sectionY
}}


className="
max-w-7xl
mx-auto
px-6
py-40
"


>


<div

className="
text-center
mb-20
"

>


<p

className="
text-xs
uppercase
tracking-[0.35em]
text-blue-400
"

>

Marketplace

</p>



<h2

className="
mt-6
text-6xl
md:text-7xl
font-semibold
tracking-tight
"

>

Discover

<span

className="
text-blue-400
"

>

 Visibility

</span>


</h2>



</div>





<ShowcaseImage


src="/showcase/marketplace.jpg"


alt="Adspheria marketplace"


contain


/>


</motion.section>
{/* DASHBOARD */}

<motion.section

style={{
y:sectionY
}}

className="
max-w-7xl
mx-auto
px-6
py-40
"

>


<div

className="
text-center
mb-20
"

>


<p

className="
text-xs
uppercase
tracking-[0.35em]
text-blue-400
"

>

Intelligence Layer

</p>



<h2

className="
mt-6
text-6xl
md:text-7xl
font-semibold
tracking-tight
"

>

Measure

<span

className="
text-blue-400
"

>

 Impact

</span>


</h2>


</div>





<ShowcaseImage

src="/showcase/dashboard.jpg"

alt="Adspheria dashboard"

contain

/>


</motion.section>









{/* ABOUT */}



<section

className="
max-w-7xl
mx-auto
px-6
py-40
text-center
"

>


<p

className="
text-xs
uppercase
tracking-[0.35em]
text-blue-400
"

>

Ecosystem

</p>




<h2

className="
mt-6
text-6xl
md:text-7xl
font-semibold
tracking-tight
"

>

Connected

<span

className="
text-blue-400
"

>

 Visibility

</span>


</h2>





<ShowcaseImage

src="/showcase/about.jpg"

alt="Adspheria ecosystem"

/>



</section>









{/* CTA */}


<section

className="
py-40
text-center
"

>


<h2

className="
text-6xl
md:text-7xl
font-semibold
tracking-tight
"

>

Build the

<span

className="
text-blue-400
"

>

 Visibility Economy

</span>


</h2>



<div

className="
mt-10
flex
justify-center
gap-5
"

>


<Link

href="/list-space"

className="
px-8
py-4
rounded-xl
bg-white
text-black
font-medium
hover:scale-105
transition
"

>

Start

</Link>




<Link

href="/marketplace"

className="
px-8
py-4
rounded-xl
border
border-white/20
bg-white/5
backdrop-blur-xl
hover:bg-white/10
transition
"

>

Explore

</Link>



</div>



</section>









<footer

className="
border-t
border-white/10
py-10
text-center
text-white/30
"

>

© {new Date().getFullYear()} Adspheria

</footer>



</main>

);

}












function ShowcaseImage({

src,
alt,
contain=false

}:{

src:string;
alt:string;
contain?:boolean;

}){


return (

<motion.div


initial={{

opacity:0,
y:50,
scale:0.97

}}


whileInView={{

opacity:1,
y:0,
scale:1

}}


viewport={{

once:true,
amount:0.2

}}


transition={{

duration:1,
ease:"easeOut"

}}



whileHover={{

scale:1.015

}}


className="

relative

mt-16

w-full

h-[520px]

md:h-[680px]

rounded-[55px]

overflow-hidden

border

border-white/10

bg-white/[0.04]

backdrop-blur-2xl

shadow-2xl

"

>


<Image

src={src}

alt={alt}

fill

priority={src.includes("hero")}

className={

contain

?

`
object-contain
p-4
md:p-8
transition-transform
duration-1000
hover:scale-[1.03]
`

:

`
object-cover
transition-transform
duration-1000
hover:scale-[1.05]
`

}


/>



{/* GLASS DEPTH */}

<div

className="
absolute
inset-0
pointer-events-none
bg-gradient-to-b
from-transparent
via-transparent
to-[#050816]/30
"

/>



{/* BORDER LIGHT */}

<div

className="
absolute
inset-0
rounded-[55px]
ring-1
ring-white/10
pointer-events-none
"

/>



</motion.div>

);

}