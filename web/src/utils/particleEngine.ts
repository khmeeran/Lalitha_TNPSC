// TNPSC Quest - Advanced Canvas Particle & Ambient Atmosphere Engine
// Zero-dependency, 60fps hardware-accelerated particle system.
// Features: Confetti Bursts, Coin Rain, Magic Sparkles, Sanctuary Fireflies, and Temple Dust.

export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
}

export interface ParticleOptions {
  count?: number;
  originX?: number;
  originY?: number;
  colors?: string[];
  type?: "COIN" | "STAR" | "CONFETTI" | "SPARKLE";
}

let activeCanvas: HTMLCanvasElement | null = null;
let activeCtx: CanvasRenderingContext2D | null = null;

function getOrCreateParticleCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  if (typeof window === "undefined") return null;

  if (!activeCanvas || !document.body.contains(activeCanvas)) {
    activeCanvas = document.createElement("canvas");
    activeCanvas.id = "reward-particle-canvas";
    activeCanvas.style.position = "fixed";
    activeCanvas.style.top = "0";
    activeCanvas.style.left = "0";
    activeCanvas.style.width = "100vw";
    activeCanvas.style.height = "100vh";
    activeCanvas.style.pointerEvents = "none";
    activeCanvas.style.zIndex = "99999";
    document.body.appendChild(activeCanvas);
  }

  activeCanvas.width = window.innerWidth;
  activeCanvas.height = window.innerHeight;

  if (!activeCtx) {
    activeCtx = activeCanvas.getContext("2d");
  }
  return activeCtx ? { canvas: activeCanvas, ctx: activeCtx } : null;
}

/**
 * Standard celebratory confetti burst (canvas-confetti compatible signature)
 */
export function confetti(options: ConfettiOptions = {}): void {
  const {
    particleCount = 100,
    spread = 70,
    origin = { x: 0.5, y: 0.6 },
    colors = ["#FFD700", "#FFA500", "#FF6347", "#10B981", "#6366F1"],
  } = options;

  const targetX = (origin.x ?? 0.5) * (typeof window !== "undefined" ? window.innerWidth : 800);
  const targetY = (origin.y ?? 0.6) * (typeof window !== "undefined" ? window.innerHeight : 600);

  triggerRewardParticles({
    count: particleCount,
    originX: targetX,
    originY: targetY,
    colors,
    type: "CONFETTI",
  });
}

/**
 * Golden Coin Rain Shower (Celebrates Quest Victory / Level Mastered)
 */
export function triggerCoinRain(durationMs: number = 2400): void {
  if (typeof window === "undefined") return;

  const handle = getOrCreateParticleCanvas();
  if (!handle) return;
  const { canvas, ctx } = handle;

  interface RainCoin {
    x: number;
    y: number;
    vy: number;
    vx: number;
    size: number;
    rotation: number;
    vRot: number;
    alpha: number;
  }

  const coins: RainCoin[] = [];
  const startTime = performance.now();
  let animId: number;

  function spawnCoins() {
    const elapsed = performance.now() - startTime;
    if (elapsed < durationMs) {
      for (let i = 0; i < 3; i++) {
        coins.push({
          x: Math.random() * canvas.width,
          y: -20,
          vy: Math.random() * 4 + 4,
          vx: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 6 + 10,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 8,
          alpha: 1,
        });
      }
    }
  }

  function loop() {
    spawnCoins();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let living = 0;
    for (let i = 0; i < coins.length; i++) {
      const c = coins[i];
      if (c.y > canvas.height + 40) continue;

      living++;
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.vRot;

      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);

      // Gold coin outer disc
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(0, 0, c.size, 0, Math.PI * 2);
      ctx.fill();

      // Gold coin rim highlight
      ctx.strokeStyle = "#FDE68A";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner embossed coin ring
      ctx.beginPath();
      ctx.arc(0, 0, c.size * 0.65, 0, Math.PI * 2);
      ctx.fillStyle = "#D97706";
      ctx.fill();

      ctx.restore();
    }

    if (living > 0 || performance.now() - startTime < durationMs) {
      animId = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
    }
  }

  loop();
}

/**
 * Magic Sparkle Shower (For Level Ups & Correct Answers)
 */
export function triggerMagicSparkles(originX: number, originY: number, count: number = 36): void {
  triggerRewardParticles({
    count,
    originX,
    originY,
    type: "STAR",
    colors: ["#FDE047", "#F59E0B", "#F43F5E", "#34D399", "#A78BFA"],
  });
}

/**
 * Universal particle burst dispatcher
 */
export function triggerRewardParticles(options: ParticleOptions = {}): void {
  const handle = getOrCreateParticleCanvas();
  if (!handle) return;
  const { canvas, ctx } = handle;

  const {
    count = 28,
    originX = canvas.width / 2,
    originY = canvas.height / 2,
    type = "CONFETTI",
  } = options;

  const defaultColors =
    type === "COIN"
      ? ["#FBBF24", "#F59E0B", "#D97706", "#FEF3C7"]
      : type === "STAR"
      ? ["#FDE047", "#F59E0B", "#F43F5E", "#60A5FA", "#34D399"]
      : ["#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#3B82F6", "#F97316"];

  const colors = options.colors || defaultColors;

  interface BurstParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vRot: number;
    alpha: number;
    decay: number;
    type: "COIN" | "STAR" | "CONFETTI" | "SPARKLE";
  }

  const particles: BurstParticle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.016,
      type,
    });
  }

  let animationFrameId: number;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeParticles = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;

      activeParticles++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      ctx.fillStyle = p.color;

      if (p.type === "COIN") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#78350F";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (p.type === "STAR") {
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          ctx.lineTo(
            Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
            -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
          );
          ctx.lineTo(
            Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2),
            -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2)
          );
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Confetti ribbon
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6);
      }

      ctx.restore();
    }

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrameId);
    }
  }

  animationFrameId = requestAnimationFrame(render);
}

/**
 * Continuous Ambient Atmospheric Particles
 * Handles:
 *  - "FIREFLIES": Glowing, wandering night bioluminescent fireflies in the Sanctuary
 *  - "DUST": Floating ancient temple dust motes drifting in sunbeams/torches
 * Returns cleanup function to stop animation.
 */
export function startAmbientAtmosphere(
  canvas: HTMLCanvasElement,
  type: "FIREFLIES" | "DUST" = "FIREFLIES"
): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const renderCtx: CanvasRenderingContext2D = ctx;

  let isRunning = true;
  let animId: number;

  const count = type === "FIREFLIES" ? 24 : 35;

  interface AmbientParticle {
    x: number;
    y: number;
    baseY: number;
    radius: number;
    speedX: number;
    speedY: number;
    phase: number;
    pulseSpeed: number;
    color: string;
    glowColor: string;
  }

  const particles: AmbientParticle[] = [];

  function initParticles() {
    particles.length = 0;
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < count; i++) {
      if (type === "FIREFLIES") {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseY: Math.random() * h,
          radius: Math.random() * 2.2 + 1.2,
          speedX: (Math.random() - 0.5) * 0.6,
          speedY: (Math.random() - 0.5) * 0.35,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.04 + 0.02,
          color: Math.random() > 0.4 ? "#34D399" : "#FDE047", // emerald green or gold
          glowColor: Math.random() > 0.4 ? "rgba(52, 211, 153, 0.45)" : "rgba(253, 224, 71, 0.45)",
        });
      } else {
        // Ancient temple dust motes
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseY: Math.random() * h,
          radius: Math.random() * 1.5 + 0.8,
          speedX: (Math.random() - 0.5) * 0.25,
          speedY: -Math.random() * 0.25 - 0.08, // gentle upward drift
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          color: "#FEF08A",
          glowColor: "rgba(254, 240, 138, 0.25)",
        });
      }
    }
  }

  initParticles();

  function loop() {
    if (!isRunning) return;

    renderCtx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.phase += p.pulseSpeed;
      p.x += p.speedX + Math.sin(p.phase) * 0.3;
      p.y += p.speedY + Math.cos(p.phase * 0.7) * 0.2;

      // Wrap-around screen bounds
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Glow intensity oscillation
      const alpha = type === "FIREFLIES"
        ? 0.35 + 0.55 * Math.sin(p.phase)
        : 0.2 + 0.4 * Math.sin(p.phase);

      if (alpha <= 0.05) continue;

      renderCtx.save();
      renderCtx.globalAlpha = Math.max(0.05, Math.min(1, alpha));

      // Outer radial glow
      const grad = renderCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
      grad.addColorStop(0, p.color);
      grad.addColorStop(0.5, p.glowColor);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      renderCtx.fillStyle = grad;
      renderCtx.beginPath();
      renderCtx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
      renderCtx.fill();

      // Sharp central core
      renderCtx.fillStyle = "#FFFFFF";
      renderCtx.beginPath();
      renderCtx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
      renderCtx.fill();

      renderCtx.restore();
    }

    animId = requestAnimationFrame(loop);
  }

  animId = requestAnimationFrame(loop);

  return () => {
    isRunning = false;
    cancelAnimationFrame(animId);
  };
}
