import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loader = ({ fullScreen = true }) => {
  return (
    <div className={`${fullScreen ? 'min-h-screen' : ''} w-full flex items-center justify-center`}>
      {/* Responsive square wrapper: scales from mobile to desktop */}
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52">
        <DotLottieReact
          src="https://lottie.host/ccad7f1e-91ad-4915-af05-10597acd0acf/I9sl8F9OA5.lottie"
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}

export default Loader