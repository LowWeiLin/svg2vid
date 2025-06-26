<script lang="ts">
  type WorkflowState =
    | "FILE_SELECTION"
    | "OPTIONS_SELECTION"
    | "CONVERTING"
    | "COMPLETED"
    | "ERROR";
  let workflowState = $state<WorkflowState>("FILE_SELECTION");
  let svgFile = $state<FileList | null>(null);
  let width = $state(800);
  let height = $state(600);
  let linkDimensions = $state(true);
  let aspectRatio = $state<number | null>(null);
  let duration = $state(5000);
  let framerate = $state(30);
  let background = $state("#FFFFFF");

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
      console.log("Video conversion completed", videoBlob);
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
      const recorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
      initTime = null;
      recorder.ondataavailable = (event) => {
        const blob = event.data;
        if (blob && blob.size) {
          chunks.push(blob);
        }
      };
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: "video/mp4" }));
      };

      canvasEl.width = width;
      canvasEl.height = height;
      imgEl.width = width;
      imgEl.height = height;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(imgEl, 0, 0, width, height);

      const renderLoop = (time?: number) => {
        render();
        if (initTime == null) {
          if (!time) recorder.start();
          else initTime = time;
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

      imgEl.onload = () => {
        renderLoop();
      };
      imgEl.src = URL.createObjectURL(getFile()!);
    });

  const downloadVideo = (blob: Blob) => {
    const generatedFile = new File(
      [new Blob([blob], { type: "application/octet-stream" })],
      getFile()!.name.replace(/\.svgz?$/i, ".mp4")
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
  <div class="flex flex-col items-center">
    <h1 class="m-8 text-5xl text-gray-900">Animated SVG to Video</h1>
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
      {/if}
      {#if workflowState === "COMPLETED"}
        <div class="mt-4 flex flex-col items-center">
          <p class="text-green-600 font-medium mb-4">
            ✓ Conversion completed! Video downloaded.
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span class="font-medium text-gray-600">
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
        <button
          type="button"
          onclick={handleConvert}
          disabled={workflowState === "CONVERTING"}
          aria-disabled={workflowState === "CONVERTING"}
          class="inline-block rounded-sm bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:ring-3 focus:outline-hidden"
        >
          Convert to Video
        </button>
      </div>
    </form>
    <!-- svelte-ignore a11y_missing_attribute -->
    <img bind:this={imgEl} class="opacity-0" />
    <canvas bind:this={canvasEl} class="hidden"></canvas>
  </div>
</main>
