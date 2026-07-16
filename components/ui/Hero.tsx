"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";


export default function Hero() {

return (

<section
className="
relative
min-h-[95vh]
overflow-hidden
bg-[#050816]
"
>


{/* BACKGROUND SYSTEM */}

<div className="
absolute
inset-0
pointer-events-none
">


<div
className="
absolute
-top-[280px]
-left-[250px]
w-[900px]
h-[900px]
rounded-full
bg-blue-600/20
blur-[200px]
"
/>


<div
className="
absolute
-bottom-[280px]
-right-[200px]
w-[800px]
h-[800px]
rounded-full
bg-blue-500/10
blur-[200px]
"
/>


<div
className="
absolute
inset-0
bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_65%)]
"
/>

<div
className="
absolute
inset-0
opacity-20
bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.18)_1px,transparent_1px)]
bg-[size:80px_80px]
"
/>
</div>






<div
className="
relative
max-w-7xl
mx-auto
px-6
min-h-[95vh]
flex
items-center
"
>


<div
className="
grid
grid-cols-1
lg:grid-cols-2
gap-16
lg:gap-20
items-center
w-full
"
>


{/* LEFT CONTENT */}


<motion.div

initial={{
opacity:0,
y:40
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:1
}}

>


<div

className="
inline-flex
px-5
py-2
rounded-full
border
border-blue-500/30
bg-blue-500/10
text-blue-300
text-xs
uppercase
tracking-[0.35em]
mb-8
"

>

Visibility Operating System

</div>





<h1

className="
text-5xl
sm:text-6xl
md:text-7xl
lg:text-[92px]
font-semibold
leading-[0.95]
tracking-[-0.06em]
"

>


The World's


<span
className="
block
text-blue-500
"
>

Visibility

</span>


Economy


</h1>



<h1
  className="
    text-5xl
    sm:text-6xl
    md:text-7xl
    lg:text-[92px]
    font-semibold
    leading-[0.95]
    tracking-[-0.06em]
  "
>
  The World&apos;s

  <span
    className="
      block
      text-blue-500
    "
  >
    Visibility
  </span>

  Economy
</h1>


<p

className="
mt-8
max-w-xl
text-lg
md:text-xl
leading-[1.7]
text-white/50
"

>

The infrastructure connecting brands,
creators, advertisers, and real-world
visibility spaces through one intelligent network.

</p>







<div

className="
mt-10
flex
flex-col
sm:flex-row
gap-4
"

>


<Link

href="/marketplace"

className="
px-8
py-4
rounded-xl
bg-blue-600
hover:bg-blue-500
transition
shadow-xl
shadow-blue-600/30
font-medium
"

>

Explore Marketplace

</Link>





<Link

href="/list-space"

className="
px-8
py-4
rounded-xl
border
border-white/10
bg-white/5
backdrop-blur-xl
hover:bg-white/10
transition
font-medium
"

>

Join Network

</Link>


</div>






<p

className="
mt-8
text-xs
uppercase
tracking-[0.3em]
text-white/30
"

>

AI Intelligence • Verified Network • Real-Time Visibility

</p>




</motion.div>









{/* RIGHT ECOSYSTEM CORE */}


<motion.div

initial={{
opacity:0,
scale:0.8
}}

animate={{
opacity:1,
scale:1
}}

transition={{
duration:1.2
}}

className="
relative
h-[620px]
flex
items-center
justify-center
"

>

{/* CORE GLOW */}

<motion.div

animate={{
scale:[1,1.15,1],
opacity:[0.35,0.7,0.35]
}}

transition={{
duration:5,
repeat:Infinity
}}

className="
absolute
w-[330px]
h-[330px]
md:w-[400px]
md:h-[400px]
rounded-full
bg-blue-500/20
blur-3xl
"

/>






{/* OUTER ORBIT */}


<motion.div

animate={{
rotate:360
}}

transition={{
duration:50,
repeat:Infinity,
ease:"linear"
}}

className="
absolute
w-[430px]
h-[430px]
md:w-[560px]
md:h-[560px]
rounded-full
border
border-blue-500/20
"

>


<OrbitDot
className="
top-0
left-1/2
"
/>


<OrbitDot
className="
bottom-10
right-10
"
/>


</motion.div>







{/* INNER ORBIT */}


<motion.div

animate={{
rotate:-360
}}

transition={{
duration:42,
repeat:Infinity,
ease:"linear"
}}

className="
absolute
w-[300px]
h-[300px]
md:w-[430px]
md:h-[430px]
rounded-full
border
border-white/10
"

>


<OrbitDot
className="
right-0
top-1/2
"
/>


<OrbitDot
className="
bottom-0
left-1/3
"
/>


</motion.div>







{/* LOGO CORE */}


<motion.div

animate={{
y:[0,-15,0],
rotateY:[0,8,0,-8,0]
}}

transition={{
duration:8,
repeat:Infinity,
ease:"easeInOut"
}}

className="
relative
z-20
"

>


<div
className="
relative
w-[320px]
h-[320px]
md:w-[460px]
md:h-[460px]
"
>
  <motion.div

animate={{
scale:[1,1.08,1],
opacity:[0.25,0.45,0.25]
}}

transition={{
duration:5,
repeat:Infinity,
ease:"easeInOut"
}}

className="
absolute
inset-0
rounded-full
bg-blue-500/10
blur-3xl
"

/>  
<Image

src="/logo.png"

alt="Adspheria"

fill

priority

className="
object-contain
drop-shadow-[0_0_100px_rgba(59,130,246,0.75)]
"

/>


</div>


</motion.div>








{/* FLOATING GLASS CARDS */}



<FloatingNode

position="
-top-4
right-0
"

title="Brands"

value="Activate"

/>



<FloatingNode

position="
top-28
-left-4
"

title="Creators"

value="Connect"

/>

<FloatingNode

position="
top-14
right-[28%]
"

title="Advertisers"

value="Campaigns"

/>

<FloatingNode

position="
bottom-24
right-0
"

title="Visibility"

value="Verified Network"

/>



</motion.div>





</div>


</div>


</section>


);

}









function FloatingNode({

position,
title,
value

}:{
position:string;
title:string;
value:string;
}){


return (

<motion.div

animate={{
y:[0,-14,0],
rotate:[0,0.8,0,-0.8,0]
}}

transition={{
duration:6,
repeat:Infinity,
ease:"easeInOut"
}}

className={`

absolute
${position}
z-20
rounded-2xl
border
border-white/10
bg-white/[0.05]
backdrop-blur-2xl
px-6
py-4
shadow-2xl
shadow-blue-500/20

`}
>


<p className="
text-[11px]
uppercase
tracking-[0.25em]
text-white/40
">

{title}

</p>


<p className="
mt-1
text-blue-300
font-semibold
">

{value}

</p>

</motion.div>

);

}









function OrbitDot({

className

}:{
className:string;
}){


return (

<div

className={`
absolute
${className}
w-3
h-3
rounded-full
bg-blue-400
shadow-lg
shadow-blue-400/70
`}

/>

);

}
{/* CONTINUE PART 2 HERE */}
