document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".carousel-item");

  let index = 0;
  let dragging = false;
  let startPos = 0;
  let currentPos = 0;
  let prevPos = 0;
  let animationId;

  const THRESHOLD = 50;
  const GAP = 20;

  // Center and highlight the current slide
  const updateTrack = () => {
    const centerOffset = (track.offsetWidth - slides[index].offsetWidth) / 2;
    const translateX = -index * (slides[index].offsetWidth + GAP) + centerOffset;
    track.style.transition = "transform 0.3s ease-out";
    track.style.transform = `translateX(${translateX}px)`;

    // Toggle the 'active' class
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  };

  // Utility to get X coordinate for mouse/touch
  const getX = (e) => (e.type.includes("mouse") ? e.pageX : e.touches[0].clientX);

  // Animate the carousel while dragging
  const animate = () => {
    track.style.transform = `translateX(${currentPos}px)`;
    if (dragging) requestAnimationFrame(animate);
  };

  // Start drag
  const startDrag = (e) => {
    startPos = getX(e);
    dragging = true;
    track.style.transition = "none";
    animationId = requestAnimationFrame(animate);
  };

  // Move drag
  const moveDrag = (e) => {
    if (!dragging) return;
    const currentX = getX(e);
    const moveBy = currentX - startPos;

    // Prevent dragging out of bounds
    if ((index === 0 && moveBy > 0) || (index === slides.length - 1 && moveBy < 0)) {
      currentPos = prevPos;
    } else {
      currentPos = prevPos + moveBy;
    }
  };

  // End drag
  const endDrag = () => {
    dragging = false;
    cancelAnimationFrame(animationId);

    const moved = currentPos - prevPos;

    if (moved < -THRESHOLD && index < slides.length - 1) {
      index += 1;
    } else if (moved > THRESHOLD && index > 0) {
      index -= 1;
    }

    updateTrack();
    prevPos = -index * (slides[index].offsetWidth + GAP);
  };

  // Attach drag event listeners
  ["touchstart", "mousedown"].forEach((evt) => track.addEventListener(evt, startDrag));
  ["touchmove", "mousemove"].forEach((evt) => track.addEventListener(evt, moveDrag));
  ["touchend", "mouseup", "mouseleave"].forEach((evt) =>
    track.addEventListener(evt, () => {
      if (dragging) endDrag();
    })
  );

  // Prevent default browser drag for images
  slides.forEach((slide) => slide.addEventListener("dragstart", (e) => e.preventDefault()));

  // Initialize position
  updateTrack();

  // Handle Prev/Next button clicks
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateTrack();
      prevPos = -index * (slides[index].offsetWidth + GAP);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (index < slides.length - 1) {
      index++;
      updateTrack();
      prevPos = -index * (slides[index].offsetWidth + GAP);
    }
  });
});
