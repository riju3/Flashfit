import SettingsModel from "../models/settings.model.js";

export const getSettingsController = async (request, response) => {
    try {
        let settings = await SettingsModel.findOne();
        if (!settings) {
            settings = await SettingsModel.create({ upiId: "", supportPhone: "+91 98765 43210", supportEmail: "support@flashfit.com" });
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
        const { upiId, supportPhone, supportEmail } = request.body;
        let settings = await SettingsModel.findOne();
        if (!settings) {
            settings = new SettingsModel({ upiId, supportPhone, supportEmail });
        } else {
            if (upiId !== undefined) settings.upiId = upiId;
            if (supportPhone !== undefined) settings.supportPhone = supportPhone;
            if (supportEmail !== undefined) settings.supportEmail = supportEmail;
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
