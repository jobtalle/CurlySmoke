export function boot(smoke, fps = 20) {
    const updateRate = 1 / fps;
    let lastTime = performance.now();
    let updateTime = 0;

    const loop = time => {
        const elapsedTime = Math.max(10, time - lastTime);

        updateTime += .001 * elapsedTime;

        while (updateTime > updateRate) {
            smoke.update();

            updateTime -= updateRate * Math.floor(updateTime / updateRate);
        }

        lastTime = time;

        smoke.render(updateTime / updateRate);

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
}