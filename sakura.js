// Sakura Bloom Petals Animation Engine
// Lightweight, zero-dependency canvas particle system

(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'sakura-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const TOTAL_PETALS = Math.min(45, Math.floor(window.innerWidth / 28));

  // Color palette matching Sakura Bloom
  const PETAL_COLORS = [
    { start: 'rgba(255, 182, 217, 0.85)', end: 'rgba(244, 114, 182, 0.65)' },
    { start: 'rgba(249, 168, 212, 0.8)', end: 'rgba(216, 180, 254, 0.6)' },
    { start: 'rgba(251, 207, 232, 0.9)', end: 'rgba(244, 114, 182, 0.7)' },
    { start: 'rgba(244, 114, 182, 0.75)', end: 'rgba(192, 132, 252, 0.55)' }
  ];

  class Petal {
    constructor(initial = false) {
      this.reset(initial);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20 - Math.random() * 30;
      this.size = 11 + Math.random() * 14;
      this.speedY = 1.0 + Math.random() * 1.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.8;
      this.flip = Math.random() * 360;
      this.flipSpeed = 0.8 + Math.random() * 1.6;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.02 + Math.random() * 0.025;
      this.swayDistance = 0.8 + Math.random() * 1.5;
      this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      this.opacity = 0.65 + Math.random() * 0.35;
    }

    update(windX) {
      this.swayAngle += this.swaySpeed;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      this.x += this.speedX + Math.sin(this.swayAngle) * this.swayDistance + windX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.y > height + 25 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin((this.flip * Math.PI) / 180));
      ctx.globalAlpha = this.opacity;

      // Draw stylized sakura petal curve
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 2);
      ctx.bezierCurveTo(
        this.size / 2, -this.size / 2,
        this.size / 1.5, this.size / 3,
        0, this.size
      );
      ctx.bezierCurveTo(
        -this.size / 1.5, this.size / 3,
        -this.size / 2, -this.size / 2,
        0, -this.size / 2
      );

      const grad = ctx.createLinearGradient(0, -this.size / 2, 0, this.size);
      grad.addColorStop(0, this.color.start);
      grad.addColorStop(1, this.color.end);
      ctx.fillStyle = grad;
      ctx.fill();

      // Delicate petal crease highlight
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 3);
      ctx.lineTo(0, this.size * 0.6);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }
  }

  // Populate initial petals
  for (let i = 0; i < TOTAL_PETALS; i++) {
    petals.push(new Petal(true));
  }

  // Mouse breeze interaction
  let windX = 0;
  let targetWindX = 0;
  window.addEventListener('mousemove', (e) => {
    const centerDist = (e.clientX - width / 2) / (width / 2);
    targetWindX = centerDist * 0.6;
  });

  // Main animation loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    windX += (targetWindX - windX) * 0.04;

    for (let i = 0; i < petals.length; i++) {
      petals[i].update(windX);
      petals[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
