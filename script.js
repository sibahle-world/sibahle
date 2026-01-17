 // --- 1. Intersection Observer for Animations ---
        const observerOptions = { threshold: 0.3 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.message-block, .the-question').forEach(el => observer.observe(el));

        // --- 2. Petal Rain Logic ---
        const canvas = document.getElementById('petal-canvas');
        const ctx = canvas.getContext('2d');
        let petals = [];

        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', initCanvas);
        initCanvas();

        class Petal {
            constructor() { this.init(); }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * -canvas.height;
                this.w = Math.random() * 15 + 5;
                this.h = this.w * 0.8;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.speed = Math.random() * 1 + 0.5;
                this.rotation = Math.random() * 360;
                this.spin = Math.random() * 2 - 1;
            }
            draw() {
                this.y += this.speed;
                this.rotation += this.spin;
                if (this.y > canvas.height) this.init();
                
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                ctx.beginPath();
                ctx.ellipse(0, 0, this.w, this.h, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(226, 182, 177, ${this.opacity})`;
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < 50; i++) petals.push(new Petal());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(p => p.draw());
            requestAnimationFrame(animate);
        }
        animate();

        // --- 3. Interaction Logic ---
        function celebrate() {
            const overlay = document.getElementById('overlay');
            overlay.style.display = 'flex';
            setTimeout(() => overlay.style.opacity = '1', 50);
            
            // Add a burst of petals
            for (let i = 0; i < 100; i++) petals.push(new Petal());
        }

        // Fun interaction for the "No" button replacement
        const moveBtn = document.getElementById('btn-move');
        moveBtn.addEventListener('mouseover', () => {
            if (window.innerWidth > 768) {
                moveBtn.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
            }
        });
        moveBtn.addEventListener('click', celebrate);
