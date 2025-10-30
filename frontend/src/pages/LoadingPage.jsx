const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-8 fade-in">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center animate-pulse shadow-2xl p-4">
            <img src="/logo.png" alt="PRESTIGE" className="w-full h-full object-contain" />
          </div>
          {/* Rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-transparent border-t-yellow-500 border-r-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-3">
          <h1 className="text-6xl font-bold rose-gold-text tracking-wider">LUXEMart</h1>
          <p className="text-gray-400 text-lg font-light tracking-widest">LUXURY AWAITS</p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-yellow-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
