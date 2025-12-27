 function enterPortal() {
            document.getElementById('portal').classList.add('portal-exit');
            setTimeout(() => {
                document.getElementById('portal').style.display = 'none';
                revealElements();
                startPetals();
            }, 1800);
        }

        function revealElements() {
            const observerOptions = { threshold: 0.1 };
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        }

        function createPetal() {
            const container = document.getElementById('petal-container');
            if (!container) return;

            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // Randomize size
            const sizeNum = Math.random() * 20 + 12;
            petal.style.width = sizeNum + 'px';
            petal.style.height = (sizeNum * 0.8) + 'px';
            
            // Randomize position
            petal.style.left = Math.random() * 100 + 'vw';
            
            // Subtle color variations (warmer vs cooler pinks)
            const variations = ['#d4a5a5', '#c99494', '#bd8585'];
            petal.style.backgroundColor = variations[Math.floor(Math.random() * variations.length)];

            // Randomize animation duration and delay
            const duration = Math.random() * 5 + 8 + 's';
            petal.style.animationDuration = duration;
            
            container.appendChild(petal);
            
            // Cleanup petal after animation
            setTimeout(() => {
                petal.remove();
            }, parseFloat(duration) * 1000);
        }

        function startPetals() {
            // Initial burst
            for(let i = 0; i < 20; i++) {
                setTimeout(createPetal, Math.random() * 4000);
            }
            // Continuous flow
            setInterval(createPetal, 700);
        }

        window.addEventListener('scroll', revealElements);