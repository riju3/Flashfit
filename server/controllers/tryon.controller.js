import { Client, handle_file } from "@gradio/client";

export const virtualTryOnController = async (request, response) => {
    try {
        const { personImage, garmentImage, category = "Upper Garment" } = request.body;

        if (!personImage || !garmentImage) {
            return response.status(400).json({
                message: "Please provide both your photo and product garment image.",
                error: true,
                success: false
            });
        }

        console.log("👗 Starting FlashFit AI Virtual Try-On with Hugging Face IDM-VTON...");

        let resultImage = null;
        const token = process.env.HF_TOKEN;

        // Helper with timeout to prevent hanging forever on busy HF queues
        const callWithTimeout = (promise, ms = 14000) => {
            return Promise.race([
                promise,
                new Promise((_, reject) => setTimeout(() => reject(new Error("HF API Timeout")), ms))
            ]);
        };

        // Try Space 1: yisol/IDM-VTON
        try {
            console.log("Connecting to yisol/IDM-VTON...");
            const app = await Client.connect("yisol/IDM-VTON", { token });
            const predictPromise = app.predict("/tryon", {
                dict: {
                    background: handle_file(personImage),
                    layers: [],
                    composite: handle_file(personImage)
                },
                garm_img: handle_file(garmentImage),
                garment_des: category || "Fashion clothing item",
                is_checked: true,
                is_checked_crop: false,
                denoise_steps: 25,
                seed: 42
            });

            const result = await callWithTimeout(predictPromise, 15000);
            if (result?.data?.[0]) {
                resultImage = typeof result.data[0] === 'string' ? result.data[0] : result.data[0]?.url;
            }
        } catch (err1) {
            console.warn("yisol/IDM-VTON error or timeout:", err1.message);
        }

        // Try Space 2: Nymbo/Virtual-Try-On if Space 1 failed
        if (!resultImage) {
            try {
                console.log("Connecting to Nymbo/Virtual-Try-On...");
                const app2 = await Client.connect("Nymbo/Virtual-Try-On", { token });
                const predictPromise2 = app2.predict("/process_hd", [
                    handle_file(personImage),
                    handle_file(garmentImage),
                    category || "upper_body",
                    25,
                    42,
                    true
                ]);

                const result2 = await callWithTimeout(predictPromise2, 15000);
                if (result2?.data?.[0]) {
                    resultImage = typeof result2.data[0] === 'string' ? result2.data[0] : result2.data[0]?.url;
                }
            } catch (err2) {
                console.warn("Nymbo/Virtual-Try-On error or timeout:", err2.message);
            }
        }

        return response.json({
            message: resultImage ? "AI Virtual Try-On completed successfully!" : "Using Face-Swap Fitting Compositor fallback",
            error: false,
            success: true,
            data: {
                resultImage: resultImage || null,
                isAIFitted: Boolean(resultImage)
            }
        });

    } catch (error) {
        console.error("Virtual Try-On Controller Error:", error);
        return response.status(500).json({
            message: error.message || "Failed to process Virtual Try-On",
            error: true,
            success: false
        });
    }
};
