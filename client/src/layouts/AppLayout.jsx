const AppLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-white">
      {/* Static material texture */}
      <svg
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.0125]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>

        <rect
          width="100%"
          height="100%"
          filter="url(#noise)"
          opacity="0.9"
        />
      </svg>

      {/* Application content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}

export default AppLayout