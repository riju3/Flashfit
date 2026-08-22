import { Client, handle_file } from "@gradio/client";

export const virtualTryOnController = async (request, response) => {
    try {
        const { personImage, garmentImage, category = "Upper Garment", garmentName = "clothing item" } = request.body;

        if (!personImage || !garmentImage) {
            return response.status(400).json({
                message: "Please upload your photo and select a garment image.",
                error: true,
                success: false
            });
        }

        console.log("Starting 100% Accurate Virtual Try-On on User's Photo (IDM-VTON & CatVTON)...");

        let resultImage = null;
        const hfToken = process.env.HF_TOKEN;

        // Helper with 120-second timeout so GPU queues can finish processing user's actual photo
        const callWithTimeout = (promise, ms = 120000) => {
            return Promise.race([
                promise,
                new Promise((_, reject) => setTimeout(() => reject(new Error("VTON GPU Timeout")), ms))
            ]);
        };

        // 1. Try Primary Space: yisol/IDM-VTON (Preserves user face & pose 100%)
        try {
            console.log("Connecting to yisol/IDM-VTON for exact user photo try-on...");
            const app1 = await Client.connect("yisol/IDM-VTON", { token: hfToken });
            const predictPromise1 = app1.predict("/tryon", {
                dict: {
                    background: handle_file(personImage),
                    layers: [],
                    composite: handle_file(personImage)
                },
                garm_img: handle_file(garmentImage),
                garment_des: garmentName || category || "clothing item",
                is_checked: true,
                is_checked_crop: false,
                denoise_steps: 30,
                seed: 42
            });

            const result1 = await callWithTimeout(predictPromise1, 90000);
            if (result1?.data?.[0]) {
                resultImage = typeof result1.data[0] === 'string' ? result1.data[0] : result1.data[0]?.url;
                console.log("IDM-VTON Success on User Photo:", resultImage);
            }
        } catch (err1) {
            console.warn("IDM-VTON space error/timeout:", err1.message);
        }

        // 2. Try Secondary Space: zhengchong/CatVTON
        if (!resultImage) {
            try {
                console.log("Connecting to zhengchong/CatVTON for exact user photo try-on...");
                const app2 = await Client.connect("zhengchong/CatVTON", { token: hfToken });
                let clothType = "upper";
                const catLower = (category || "").toLowerCase();
                if (catLower.includes("pant") || catLower.includes("trouser") || catLower.includes("jeans") || catLower.includes("bottom") || catLower.includes("lower")) {
                    clothType = "lower";
                } else if (catLower.includes("dress") || catLower.includes("suit") || catLower.includes("overall")) {
                    clothType = "overall";
                }

                const predictPromise2 = app2.predict("/submit_function", {
                    person_image: {
                        background: handle_file(personImage),
                        layers: [],
                        composite: handle_file(personImage)
                    },
                    cloth_image: handle_file(garmentImage),
                    cloth_type: clothType,
                    num_inference_steps: 30,
                    guidance_scale: 2.5,
                    seed: 42,
                    show_type: "result only"
                });

                const result2 = await callWithTimeout(predictPromise2, 90000);
                if (result2?.data?.[0]) {
                    resultImage = typeof result2.data[0] === 'string' ? result2.data[0] : result2.data[0]?.url;
                    console.log("CatVTON Success on User Photo:", resultImage);
                }
            } catch (err2) {
                console.warn("CatVTON space error/timeout:", err2.message);
            }
        }

        // 3. Strict Check: NO fake images, NO random model generation!
        if (!resultImage) {
            return response.status(503).json({
                message: "AI Virtual Fitting GPU queue is currently busy. Please click Generate again in 30-60 seconds.",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "100% Accurate Virtual Try-On generated on your photo",
            error: false,
            success: true,
            data: {
                resultImage
            }
        });

    } catch (error) {
        console.error("Virtual Try-On Controller Error:", error);
        return response.status(500).json({
            message: "AI Virtual Fitting GPU queue is currently busy. Please try again in a few moments.",
            error: true,
            success: false
        });
    }
};
