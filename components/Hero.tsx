import Button from "./Button";

{/* Hero Section */}
<section className="relative overflow-hidden">

  {/* Background Glow */}
  <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 blur-[200px] rounded-full" />

  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] bg-blue-500/10 blur-[180px] rounded-full" />

  <div className="max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">

    {/* Left Side */}
    <div className="relative z-10">

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">

        <div className="w-2 h-2 bg-blue-500 rounded-full" />

        <span className="text-sm text-gray-300">
          The Future of Visibility is Here
        </span>

      </div>

      <h1 className="text-6xl lg:text-7xl font-bold leading-tight">

        The Future of

        <br />

        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Visibility
        </span>

      </h1>

      <p className="mt-8 text-lg text-gray-400 max-w-xl leading-relaxed">

        AdSphere connects advertisers, creators, publishers,
        and physical advertising spaces into one intelligent
        visibility marketplace powered by AI.

      </p>

      <div className="flex flex-wrap gap-4 mt-10">

        <Button>
          Launch Platform →
        </Button>

        <Button variant="secondary">
          Explore Vision
        </Button>

      </div>

      <div className="flex items-center gap-4 mt-12">

        <div className="flex -space-x-3">

          <div className="w-10 h-10 rounded-full bg-gray-500 border border-[#050816]" />

          <div className="w-10 h-10 rounded-full bg-gray-400 border border-[#050816]" />

          <div className="w-10 h-10 rounded-full bg-gray-300 border border-[#050816]" />

        </div>

        <p className="text-gray-400 text-sm">
          Join advertisers, creators and space owners building the future of visibility.
        </p>

      </div>

    </div>

    {/* Right Side */}
    <div className="relative flex items-center justify-center">

      <div className="absolute w-[550px] h-[550px] rounded-full border border-blue-500/20" />

      <div className="absolute w-[450px] h-[450px] rounded-full border border-purple-500/20" />

      <div className="absolute w-[400px] h-[400px] bg-blue-600/30 blur-[120px] rounded-full" />

      <div className="relative flex items-center justify-center">

        <img
          src="/logo.png"
          alt="AdSphere Logo"
          className="w-[420px] h-auto drop-shadow-[0_0_80px_rgba(59,130,246,0.8)]"
        />

      </div>

    </div>

  </div>

  {/* Bottom Glow Horizon */}

  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />

</section>