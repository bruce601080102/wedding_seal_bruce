(() => {
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const imageTargets = isMobile ? ".album-photo img" : ".album-photo img, .carousel-slide img";

  gsap.utils.toArray(imageTargets).forEach((img) => {
    gsap.fromTo(img,
      { scale: isMobile ? 0.98 : 0.92, opacity: isMobile ? 0.86 : 0.72, filter: "saturate(0.86) contrast(1.02)" },
      {
        scale: 1,
        opacity: 1,
        filter: "saturate(1) contrast(1.06)",
        ease: "none",
        scrollTrigger: {
          trigger: img,
          start: "top 88%",
          end: "bottom 18%",
          scrub: true,
        },
      }
    );
  });

  gsap.utils.toArray(".bento-card").forEach((card, index) => {
    gsap.from(card, {
      y: isMobile ? 18 : 34,
      opacity: 0,
      duration: isMobile ? 0.55 : 0.85,
      ease: "power3.out",
      delay: isMobile ? 0 : (index % 3) * 0.06,
      scrollTrigger: {
        trigger: card,
        start: isMobile ? "top 92%" : "top 86%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  });

  const scrubText = document.querySelector("[data-scrub-text]");
  if (scrubText && !scrubText.dataset.motionReady) {
    scrubText.dataset.motionReady = "true";
    const text = scrubText.textContent.trim();
    scrubText.textContent = "";

    Array.from(text).forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = char.trim() ? "0.18" : "1";
      scrubText.appendChild(span);
    });

    gsap.to(scrubText.querySelectorAll("span"), {
      opacity: 1,
      stagger: 0.018,
      ease: "none",
      scrollTrigger: {
        trigger: scrubText,
        start: "top 78%",
        end: "bottom 42%",
        scrub: true,
      },
    });
  }

  if (window.matchMedia("(min-width: 1024px)").matches) {
    gsap.utils.toArray(".album-page").forEach((page, index) => {
      gsap.fromTo(page,
        { y: 42, scale: 0.965 },
        {
          y: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: page,
            start: "top 84%",
            end: "top 34%",
            scrub: true,
          },
        }
      );

      if (index > 0) {
        gsap.from(page, {
          rotate: index % 2 ? -1.2 : 1.2,
          scrollTrigger: {
            trigger: page,
            start: "top 88%",
            end: "top 46%",
            scrub: true,
          },
        });
      }
    });
  }
})();
