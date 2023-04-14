import {Vector3} from "./math/vector3.js";
import {RenderableSmoke} from "./renderable/renderableSmoke.js";

class SmokeParticle {
    position;
    velocity;
    decay;
    scale;
    noiseOffsetDirection = new Vector3().randomDirection();
    noiseOffset;
    rotation;
    life = 1;

    constructor(
        position,
        velocity,
        decay,
        scale,
        noiseOffset,
        rotation) {
        this.position = position;
        this.velocity = velocity;
        this.decay = decay;
        this.scale = scale;
        this.noiseOffset = noiseOffset;
        this.rotation = rotation / scale;
    }

    update() {
        this.position.add(this.velocity);

        this.velocity.y += .005 * this.scale;
        this.velocity.x -= .01 * this.scale * (1 - this.life) * (1 - this.life);
        this.velocity.multiply(.9);

        return (this.life -= this.decay) < 0;
    }
}

export class SmokeParticles {
    #renderable;
    #particles = [];
    #countdown = 1;
    #frequency;

    constructor(renderable, frequency = 2) {
        this.#renderable = renderable;
        this.#frequency = frequency;
    }

    spawn() {
        if (this.#particles.length === RenderableSmoke.CAPACITY)
            return;

        this.#particles.push(new SmokeParticle(
            new Vector3(),
            new Vector3(
                Math.random() - .5,
                Math.random() - .5,
                0).multiply(Math.random() * .03),
                .006 + Math.random() * .007,
                .2 + .2 * Math.random(),
                Math.random() * 128,
                1 + .8 * Math.random()
            ));
    }

    update() {
        if (--this.#countdown === 0) {
            this.#countdown = this.#frequency;

            this.spawn();
        }

        for (let particle = this.#particles.length; particle-- > 0;)
            if (this.#particles[particle].update())
                this.#particles.splice(particle, 1);
    }

    stream(time) {
        this.#renderable.stream(this.#particles, time);
    }
}