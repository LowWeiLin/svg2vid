<svg
  width="100"
  height="100"
  viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Background -->
  <circle cx="32" cy="32" r="32" fill="#E6F4EA" />

  <!-- Lock group for pulsing -->
  <g id="lock" transform="scale(1)">
    <!-- Lock body -->
    <rect x="18" y="30" width="28" height="22" rx="4" fill="#34A853" />
    <!-- Keyhole -->
    <circle cx="32" cy="41" r="2.5" fill="#1B5E20" />
    <!-- Shorter shackle -->
    <path
      id="shackle"
      d="M24 30v-5a8 8 0 0 1 16 0v5"
      fill="none"
      stroke="#34A853"
      stroke-width="4"
      stroke-linecap="round"
      transform="translate(0, -10)"
    />
  </g>

  <style>
    /* Shackle drops, stays closed, then resets */
    #shackle {
      animation: shackleDrop 3s ease-in-out infinite;
    }

    @keyframes shackleDrop {
      0% {
        transform: translate(0, -10);
        opacity: 0;
      }
      20% {
        transform: translate(0, 0);
        opacity: 1;
      }
      90% {
        transform: translate(0, 0);
        opacity: 1;
      }
      91% {
        transform: translate(0, -10);
        opacity: 0;
      }
      100% {
        transform: translate(0, -10);
        opacity: 0;
      }
    }

    /* Pulse after shackle closes */
    #lock {
      animation: lockPulse 3s ease-in-out infinite;
      transform-origin: center center;
    }

    @keyframes lockPulse {
      0%,
      19% {
        transform: scale(1);
      }
      20% {
        transform: scale(1.08);
      }
      25% {
        transform: scale(0.96);
      }
      30% {
        transform: scale(1.02);
      }
      35%,
      90% {
        transform: scale(1);
      }
      91%,
      100% {
        transform: scale(1);
      }
    }
  </style>
</svg>
