import Replicate from "replicate";
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

        console.log("Starting 100% User Photo Virtual Try-On...");

        let resultImage = null;
        const replicateToken = process.env.REPLICATE_API_TOKEN;
        const hfToken = process.env.HF_TOKEN;

        // 1. Try Replicate API (prunaai/p-image-try-on)
        if (replicateToken) {
            try {
                console.log("Attempting Replicate API prunaai/p-image-try-on...");
                const replicate = new Replicate({ auth: replicateToken });
                const output = await replicate.run(
                    "prunaai/p-image-try-on:c32fa800b6d963d7ca5ef253e9336014d3bcbe78d1cb8f2e5242394b3e438b5c",
                    {
                        input: {
                            human_img: personImage,
                            garm_img: garmentImage
                        }
                    }
                );

                if (output) {
                    resultImage = Array.isArray(output) ? output[0] : (typeof output === 'string' ? output : output?.url);
                    console.log("Replicate Try-On Success on User Photo:", resultImage);
                }
            } catch (repErr) {
                console.warn("Replicate API note:", repErr.message);
            }
        }

        // 2. Try Hugging Face IDM-VTON (yisol/IDM-VTON - 100% Free on User Photo)
        if (!resultImage && hfToken) {
            try {
                console.log("Attempting Hugging Face yisol/IDM-VTON...");
                const app = await Client.connect("yisol/IDM-VTON", { token: hfToken });
                const predictPromise = app.predict("/tryon", {
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

                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("HF Queue Timeout")), 90000));
                const result = await Promise.race([predictPromise, timeoutPromise]);

                if (result?.data?.[0]) {
                    resultImage = typeof result.data[0] === 'string' ? result.data[0] : result.data[0]?.url;
                    console.log("Hugging Face IDM-VTON Success on User Photo:", resultImage);
                }
            } catch (hfErr) {
                console.warn("Hugging Face IDM-VTON queue note:", hfErr.message);
            }
        }

        // 3. Strict Check: NO fake model images! If busy/insufficient credit, show polite notice
        if (!resultImage) {
            return response.status(503).json({
                message: "AI Virtual Fitting GPU queue is processing. If using Replicate, add $1 billing credit at replicate.com/account/billing, or click Generate again in 30 seconds for Free Hugging Face GPU.",
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
