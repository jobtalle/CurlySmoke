import {Vector3} from "./math/vector3.js";

class SmokeParticle {
    position;
    velocity;
    decay;
    life = 1;

    constructor(
        position,
        velocity,
        decay = .01) {
        this.position = position;
        this.velocity = velocity;
        this.decay = decay;
    }

    update() {
        this.position.add(this.velocity);

        return (this.life -= this.decay) < 0;
    }
}

export class SmokeParticles {
    #renderable;
    #particles = [];
    #countdown = 1;
    #frequency;

    constructor(renderable, frequency = 4) {
        this.#renderable = renderable;
        this.#frequency = frequency;
    }

    spawn() {
        this.#particles.push(new SmokeParticle(new Vector3(), new Vector3(0, .1, 0)));
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