<script lang="ts">
  import {
    getSupportedVideoFormats,
    getFileExtensionFromFormat,
  } from "./lib/utils.js";
  import PromotionalContent from "./lib/PromotionalContent.svelte";

  type WorkflowState =
    | "FILE_SELECTION"
    | "OPTIONS_SELECTION"
    | "CONVERTING"
    | "COMPLETED";
  let workflowState = $state<WorkflowState>("FILE_SELECTION");
  let svgFile = $state<FileList | null>(null);
  let width = $state(800);
  let height = $state(600);
  let linkDimensions = $state(true);
  let aspectRatio = $state<number | null>(null);
  let duration = $state(5000);
  let framerate = $state(30);
  let background = $state("#FFFFFF");
  let supportedFormats = getSupportedVideoFormats();
  let outputFormat = $state(supportedFormats[0]);

  let imgEl = $state<HTMLImageElement | null>(null);
  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let initTime: number | null = null;
  let conversionProgress = $state(0);

  const getFile = () => {
    if (svgFile && svgFile.length > 0) {
      return svgFile[0];
    }
    return null;
  };

  const handlePreviewLoad = (event: Event) => {
    const img = event.target as HTMLImageElement;
    width = img.naturalWidth;
    height = img.naturalHeight;
    aspectRatio = img.naturalWidth / img.naturalHeight;
  };

  const handleWidthChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const newWidth = parseInt(input.value);
    if (!isNaN(newWidth) && linkDimensions && aspectRatio) {
      height = Math.round(newWidth / aspectRatio);
    }
  };

  const handleHeightChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const newHeight = parseInt(input.value);
    if (!isNaN(newHeight) && linkDimensions && aspectRatio) {
      width = Math.round(newHeight * aspectRatio);
    }
  };

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      workflowState = "OPTIONS_SELECTION";
    } else {
      workflowState = "FILE_SELECTION";
    }
  };

  const handleRemoveFile = () => {
    svgFile = new DataTransfer().files;
    aspectRatio = null;
    width = 800;
    height = 600;
    workflowState = "FILE_SELECTION";
  };

  const handleDone = () => {
    svgFile = new DataTransfer().files;
    aspectRatio = null;
    width = 800;
    height = 600;
    conversionProgress = 0;
    workflowState = "FILE_SELECTION";
  };

  const handleConvert = () => {
    workflowState = "CONVERTING";
    conversionProgress = 0;
    convertToVideo().then((videoBlob) => {
      downloadVideo(videoBlob);
      conversionProgress = 100;
      workflowState = "COMPLETED";
    });
  };

  const convertToVideo = () =>
    new Promise<Blob>((resolve) => {
      if (!imgEl || !canvasEl) return;
      const ctx = canvasEl.getContext("2d");
      if (!ctx) return;

      const chunks: Blob[] = [];
      const stream = canvasEl.captureStream(framerate);
      const recorder = new MediaRecorder(stream, { mimeType: outputFormat });
      initTime = null;

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: outputFormat }));
      };

      const renderLoop = (time?: number) => {
        render();
        if (initTime == null) {
          if (!time) {
            recorder.start();
          } else {
            initTime = time;
          }
        } else if (time && time - initTime > duration) {
          recorder.stop();
          return;
        } else if (time && initTime) {
          // Update progress based on elapsed time
          const elapsed = time - initTime;
          conversionProgress = Math.min((elapsed / duration) * 100, 99);
        }

        requestAnimationFrame(renderLoop);
      };

      const render = () => {
        if (!ctx || !imgEl) return;
        ctx.rect(0, 0, width, height);
        ctx.fill();
        ctx.drawImage(imgEl, 0, 0, width, height);
      };

      canvasEl.width = width;
      canvasEl.height = height;
      imgEl.width = width;
      imgEl.height = height;
      ctx.fillStyle = background;

      imgEl.onload = () => {
        renderLoop();
      };

      // Workaround for chrome bug where SVG including foreignObject is tainted
      // https://bugs.chromium.org/p/chromium/issues/detail?id=294129
      // https://stackoverflow.com/questions/50824012/why-does-this-svg-holding-blob-url-taint-the-canvas-in-chrome
      const reader = new FileReader();
      reader.readAsDataURL(getFile()!);
      reader.onload = (e) => {
        if (!e.target || !e.target.result || !imgEl) {
          return;
        }
        imgEl.src = e.target.result as string;
      };
    });

  const downloadVideo = (blob: Blob) => {
    const extension = getFileExtensionFromFormat(outputFormat);

    const generatedFile = new File(
      [new Blob([blob], { type: "application/octet-stream" })],
      getFile()!.name.replace(/\.svgz?$/i, `.${extension}`)
    );
    const a = document.createElement("a");
    a.download = generatedFile.name;
    a.href = URL.createObjectURL(generatedFile);
    a.dataset.downloadurl = [generatedFile.type, a.download, a.href].join(":");
    a.click();
    a.remove();
  };
</script>

<main>
  <div class="flex flex-col items-center justify-center relative">
    <!-- GitHub link with SVG icon in top right -->
    <a
      href="https://github.com/LowWeiLin/svg2vid/"
      target="_blank"
      rel="noopener noreferrer"
      class="absolute top-4 right-4 cursor-pointer transition-transform hover:scale-110"
      title="View on GitHub"
    >
      <img
        src="./svg2vid.svg"
        alt="SVG2Vid Logo"
        width="48"
        height="48"
        class="drop-shadow-md"
      />
    </a>

    <h1 class="m-8 text-5xl text-gray-900 text-center">
      Animated SVG to Video
    </h1>

    {#if workflowState === "OPTIONS_SELECTION" || workflowState === "CONVERTING" || workflowState === "COMPLETED"}
      <div class="w-1/2 p-4 flex justify-between items-center">
        <p class="text-sm font-medium text-gray-700">
          File: {getFile()?.name} ({getFile()?.size} bytes)
        </p>
        {#if workflowState === "OPTIONS_SELECTION"}
          <button
            type="button"
            onclick={handleRemoveFile}
            class="text-sm font-medium text-red-600 hover:text-red-800 underline transition-colors"
          >
            Remove file
          </button>
        {/if}
      </div>
      <div class="w-1/2 p-4">
        <img
          src={URL.createObjectURL(getFile()!)}
          alt="SVG Preview"
          class="w-full h-auto"
          onload={handlePreviewLoad}
        />
      </div>
      {#if workflowState === "CONVERTING"}
        <div
          class="relative h-5 rounded-full overflow-hidden bg-gray-300 mt-4 mx-10 w-1/2"
        >
          <div
            class="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-30"
            style="width:{Math.round(conversionProgress)}%"
          ></div>
        </div>
        <p class="text-sm text-gray-600 mt-2">
          Converting... {Math.round(conversionProgress)}%
        </p>
        <div
          class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 w-1/2"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-yellow-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <div class="text-sm text-yellow-800">
              <strong class="font-medium">Stay on this page!</strong>
              <p class="mt-1">
                Keep this tab active while converting. Switching tabs or
                minimizing may affect the rendering process.
              </p>
            </div>
          </div>
        </div>
      {/if}
      {#if workflowState === "COMPLETED"}
        <div class="mt-4 flex flex-col items-center">
          <p class="text-green-600 font-medium mb-4">
            ✓ Conversion completed! File downloaded.
          </p>
          <button
            type="button"
            onclick={handleDone}
            class="inline-block rounded-sm bg-green-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
          >
            Done
          </button>
        </div>
      {/if}
    {/if}

    <form class="w-1/2 flex flex-col items-center gap-4 p-4">
      <label
        for="svg"
        class={`${workflowState === "FILE_SELECTION" ? "" : "hidden"} w-full h-32 relative transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
      >
        <span
          class="absolute top-0 left-0 w-full h-full flex items-center justify-center space-x-2"
        >
          <span class="font-medium text-gray-600 text-center">
            Drop or
            <span class="text-blue-600 underline">browse</span>
            for SVG file
          </span>
        </span>
        <input
          id="svg"
          name="svg"
          type="file"
          accept="image/svg+xml"
          required
          class="w-full h-full opacity-0"
          onchange={handleFileChange}
          bind:files={svgFile}
        />
      </label>
      <div
        class={`${workflowState === "OPTIONS_SELECTION" ? "" : "hidden"} flex flex-col items-center gap-4 w-full`}
      >
        <label for="width" class="flex flex-col w-3/4">
          <span class="text-sm font-medium text-gray-700">Width</span>
          <div class="relative">
            <input
              id="width"
              name="width"
              type="number"
              min="1"
              bind:value={width}
              oninput={handleWidthChange}
              class="mt-0.5 w-full rounded border-gray-300 pe-8 shadow-sm sm:text-sm"
            />
            <span
              class="absolute inset-y-0 right-0 grid w-8 place-content-center text-gray-700"
            >
              px
            </span>
          </div>
        </label>
        <label for="height" class="flex flex-col w-3/4">
          <span class="text-sm font-medium text-gray-700">Height</span>
          <div class="relative">
            <input
              id="height"
              name="height"
              type="number"
              min="1"
              bind:value={height}
              oninput={handleHeightChange}
              class="mt-0.5 w-full rounded border-gray-300 pe-8 shadow-sm sm:text-sm"
            />
            <span
              class="absolute inset-y-0 right-0 grid w-8 place-content-center text-gray-700"
            >
              px
            </span>
          </div>
        </label>
        <label for="link-dimensions" class="flex items-center gap-2">
          <input
            type="checkbox"
            id="link-dimensions"
            bind:checked={linkDimensions}
          />
          <span class="text-sm font-medium text-gray-700">Link dimensions</span>
        </label>
        <label for="duration" class="flex flex-col w-3/4">
          <span class="text-sm font-medium text-gray-700">Duration</span>
          <div class="relative">
            <input
              id="duration"
              name="width"
              type="number"
              min="1"
              bind:value={duration}
              class="mt-0.5 w-full rounded border-gray-300 pe-8 shadow-sm sm:text-sm"
            />
            <span
              class="absolute inset-y-0 right-0 grid w-8 place-content-center text-gray-700"
            >
              ms
            </span>
          </div>
        </label>
        <label for="framerate" class="flex flex-col w-3/4">
          <span class="text-sm font-medium text-gray-700">Framerate</span>
          <div class="relative">
            <input
              id="framerate"
              name="width"
              type="number"
              min="1"
              bind:value={framerate}
              class="mt-0.5 w-full rounded border-gray-300 pe-8 shadow-sm sm:text-sm"
            />
            <span
              class="absolute inset-y-0 right-0 grid w-8 place-content-center text-gray-700"
            >
              FPS
            </span>
          </div>
        </label>
        <label for="background" class="flex flex-col w-3/4">
          <span class="text-sm font-medium text-gray-700">Background color</span
          >
          <input
            id="background"
            name="background"
            type="color"
            required
            bind:value={background}
            class="w-full rounded shadow-sm"
          />
        </label>
        <label for="output-format" class="flex flex-col w-3/4">
          <span class="text-sm font-medium text-gray-700">Output format</span>
          <select
            id="output-format"
            name="output-format"
            bind:value={outputFormat}
            class="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
          >
            {#each supportedFormats as format}
              <option value={format}>{format}</option>
            {/each}
          </select>
        </label>
        <button
          type="button"
          onclick={handleConvert}
          disabled={workflowState === "CONVERTING"}
          aria-disabled={workflowState === "CONVERTING"}
          class="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
        >
          Convert
        </button>
      </div>
    </form>

    {#if workflowState === "FILE_SELECTION"}
      <PromotionalContent />
    {/if}

    {#if workflowState === "CONVERTING" || workflowState === "OPTIONS_SELECTION"}
      <!-- svelte-ignore a11y_missing_attribute -->
      <img bind:this={imgEl} class="opacity-0" />
      <canvas bind:this={canvasEl} class="hidden"></canvas>
    {/if}
  </div>
</main>
