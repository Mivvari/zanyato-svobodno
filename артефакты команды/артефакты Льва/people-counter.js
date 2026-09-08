(() => {
    "use strict";

    const IMAGE_URL = "https://7.132.46.130:8080/shot.jpg";
    const REFRESH_MS = 30000;
    const MIN_CONFIDENCE = 0.5;
    const TF_URL = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js";
    const COCO_URL = "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js";
    let model;
    let busy = false;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error("Не удалось загрузить скрипт"));
            document.head.appendChild(script);
        });
    }

    function loadFrame() {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            const timer = setTimeout(() => reject(new Error("Камера не ответила")), 12000);
            image.onload = () => {
                clearTimeout(timer);
                resolve(image);
            };
            image.onerror = () => {
                clearTimeout(timer);
                reject(new Error("Изображение недоступно"));
            };
            image.src = IMAGE_URL + "?t=" + Date.now();
        });
    }

    async function initialize() {
        try {
            if (!window.tf) await loadScript(TF_URL);
            if (!window.cocoSsd) await loadScript(COCO_URL);
            try {
                await window.tf.setBackend("webgl");
            } catch (_) {
                await window.tf.setBackend("cpu");
            }
            await window.tf.ready();
            model = await window.cocoSsd.load({ base: "mobilenet_v2" });
            await updateCount();
            setInterval(updateCount, REFRESH_MS);
        } catch (error) {
            console.warn(error);
        }
    }

    async function updateCount() {
        if (busy || !model) return;
        busy = true;
        try {
            const frame = await loadFrame();
            const predictions = await model.detect(frame, 100, MIN_CONFIDENCE);
            const people = predictions.filter(item => item.class === "person" && item.score >= MIN_CONFIDENCE);
            const atrium = coworkings.find(item => item.name === "Атриум А1");
            if (atrium) {
                atrium.people = people.length;
                const load = atrium.people / atrium.capacity;
                atrium.occupancy = load <= 0.4 ? "low" : load <= 0.7 ? "medium" : "high";
                render();
            }
            document.getElementById("last-update-text").textContent =
                "Последнее обновление: " + new Date().toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
        } catch (error) {
            console.warn(error);
        } finally {
            busy = false;
        }
    }

    initialize();
})();
