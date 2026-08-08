import SettingsModel from "../models/settings.model.js";

export const getSettingsController = async (request, response) => {
    try {
        let settings = await SettingsModel.findOne();
        if (!settings) {
            settings = await SettingsModel.create({ upiId: "" });
        }
        return response.json({
            message: "Settings fetched successfully",
            error: false,
            success: true,
            data: settings
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateSettingsController = async (request, response) => {
    try {
        const { upiId } = request.body;
        let settings = await SettingsModel.findOne();
        if (!settings) {
            settings = new SettingsModel({ upiId });
        } else {
            settings.upiId = upiId !== undefined ? upiId : settings.upiId;
        }
        await settings.save();

        return response.json({
            message: "Settings updated successfully",
            error: false,
            success: true,
            data: settings
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
