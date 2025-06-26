<script lang="ts">
  import LockIcon from "./icons/LockIcon.svelte";
  import LightningIcon from "./icons/LightningIcon.svelte";
  import DocumentIcon from "./icons/DocumentIcon.svelte";
</script>

<div class="w-2/3 max-w-2xl mt-8 mb-8 text-center space-y-6">
  <p class="text-lg text-gray-700 leading-relaxed">
    Convert your animated SVG files into video formats with complete privacy and
    ease. Perfect for turning Draw.io diagrams with animated elements into
    shareable videos.
  </p>

  <div class="grid md:grid-cols-3 gap-6 mt-8">
    <div class="flex flex-col items-center p-4 group">
      <div
        class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
      >
        <LockIcon />
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">100% Private</h3>
      <p class="text-sm text-gray-600 text-center">
        All processing happens locally in your browser. Your files never leave
        your device.
      </p>
    </div>

    <div class="flex flex-col items-center p-4 group">
      <div
        class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
      >
        <LightningIcon />
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
      <p class="text-sm text-gray-600 text-center">
        No uploads, no waiting. Convert your animations instantly using your
        browser's power.
      </p>
    </div>

    <div class="flex flex-col items-center p-4 group">
      <div
        class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300"
      >
        <DocumentIcon />
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
      <p class="text-sm text-gray-600 text-center">
        Export to WebM, MP4, and other formats supported by your browser.
      </p>
    </div>
  </div>

  <div
    class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 hover:bg-blue-100 transition-colors duration-300"
  >
    <h4 class="font-semibold text-blue-900 mb-2">
      💡 Perfect for Draw.io Users
    </h4>
    <p class="text-sm text-blue-800">
      Turn your system diagrams with marching ants, animated arrows, and flowing
      data paths into engaging video presentations. Great for slides,
      documentation, tutorials, and sharing with stakeholders — anywhere
      animated SVGs do not render.
    </p>
    <img src="/sample.svg" alt="Sample SVG Animation" class="mt-4 w-full" />
    <a
      href="/sample.svg"
      download="sample.svg"
      class="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
    >
      📥 Download this sample SVG to try
    </a>
  </div>
</div>
