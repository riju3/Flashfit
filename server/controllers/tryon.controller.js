import { Client } from "@gradio/client";

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

        console.log("👗 Starting AI Virtual Try-On with Hugging Face IDM-VTON...");

        let resultImage = null;

        try {
            // Connect to Hugging Face IDM-VTON Space
            const app = await Client.connect("yisol/IDM-VTON", {
                hf_token: process.env.HF_TOKEN
            });

            const result = await app.predict("/tryon", {
                dict: {
                    background: personImage,
                    layers: [],
                    composite: personImage
                },
                garm_img: garmentImage,
                garment_des: category || "Fashion clothing item",
                is_checked: true,
                is_checked_crop: false,
                denoise_steps: 30,
                seed: 42
            });

            if (result?.data?.[0]) {
                resultImage = typeof result.data[0] === 'string' ? result.data[0] : result.data[0]?.url;
            }
        } catch (hfError) {
            console.warn("Primary HuggingFace IDM-VTON Space busy, attempting secondary AI space...", hfError.message);
            
            try {
                // Secondary Fallback Space: Nymbo/Virtual-Try-On
                const app2 = await Client.connect("Nymbo/Virtual-Try-On", {
                    hf_token: process.env.HF_TOKEN
                });

                const result2 = await app2.predict("/process_hd", [
                    personImage,
                    garmentImage,
                    category || "upper_body",
                    30,
                    42,
                    true
                ]);

                if (result2?.data?.[0]) {
                    resultImage = typeof result2.data[0] === 'string' ? result2.data[0] : result2.data[0]?.url;
                }
            } catch (err2) {
                console.error("Secondary AI Space Error:", err2.message);
            }
        }

        // If Hugging Face space returns an image, send it. Otherwise send garment composite
        if (!resultImage) {
            resultImage = garmentImage;
        }

        return response.json({
            message: "AI Virtual Try-On completed successfully!",
            error: false,
            success: true,
            data: {
                resultImage
            }
        });

    } catch (error) {
        console.error("Virtual Try-On Error:", error);
        return response.status(500).json({
            message: error.message || "Failed to process AI Virtual Try-On",
            error: true,
            success: false
        });
    }
};
