const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 animate-gradient-1" />
      <div className="absolute inset-0 animate-gradient-2" />
      <div className="absolute inset-0 animate-gradient-3" />
    </div>
  );
};

export default AnimatedBackground;
