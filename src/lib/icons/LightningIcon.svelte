<svg
  width="100"
  height="100"
  viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Background -->
  <circle cx="32" cy="32" r="32" fill="#E7F0FD" />

  <!-- Lightning group -->
  <g id="lightning" transform="translate(0, -20) scale(1)">
    <!-- Lightning path (adapted to center of 64x64) -->
    <path
      d="M 34 26 V 14 L 20 36 h 10 v 12 l 14 -20 h -10 z"
      fill="none"
      stroke="#4285F4"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </g>

  <style>
    #lightning {
      animation: dropPulse 2s ease-in-out infinite;
      transform-origin: center center;
    }

    @keyframes dropPulse {
      0% {
        transform: translate(0, -20) scale(1);
        opacity: 0;
      }
      20% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      30% {
        transform: translate(0, 0) scale(1.15);
      }
      38% {
        transform: translate(0, 0) scale(0.95);
      }
      46% {
        transform: translate(0, 0) scale(1.1);
      }
      54% {
        transform: translate(0, 0) scale(1);
      }
      90% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      91% {
        transform: translate(0, -20) scale(1);
        opacity: 0;
      }
      100% {
        transform: translate(0, -20) scale(1);
        opacity: 0;
      }
    }
  </style>
</svg>
