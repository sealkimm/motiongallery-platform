import * as motion from 'motion/react-client';

// import SearchBar from './SearchBar';

const HeroSection = () => {
  return (
    <div className="relative pb-28 pt-48">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(102, 0, 204, 0.2) 0%, rgba(102, 0, 204, 0.1) 30%, transparent 80%)',
        }}
      ></div>
      <div className="container relative max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="gradient-text mb-6 text-4xl font-bold md:text-6xl">
            Explore the Art of Motion
          </h1>
          <p className="mb-12 text-xl text-gray-300 md:text-2xl">
            Discover a collection of stunning animations and visual effects
            created using GSAP, Three.js, and CSS.
          </p>
          {/* <SearchBar /> */}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
