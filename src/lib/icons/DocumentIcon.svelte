<svg
  width="100"
  height="100"
  viewBox="0 0 64 64"
  xmlns="http://www.w3.org/2000/svg"
>
  <!-- Background circle -->
  <circle cx="32" cy="32" r="32" fill="#EDE7F6" />

  <!-- Back document -->
  <rect
    x="14"
    y="12"
    width="28"
    height="36"
    rx="4"
    fill="#7E57C2"
    opacity="0.7"
  />

  <!-- Front document group for animation -->
  <g id="frontDoc" transform="translate(0,0)">
    <rect x="22" y="20" width="28" height="36" rx="4" fill="#5E35B1" />
  </g>

  <style>
    #frontDoc {
      animation: moveCloserFar 3s ease-in-out infinite;
      transform-origin: center center;
    }

    @keyframes moveCloserFar {
      0%,
      100% {
        transform: translate(0, 0);
      }
      50% {
        transform: translate(-4px, -4px);
      }
    }
  </style>
</svg>
