import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    upiId: {
        type: String,
        default: ""
    },
    supportPhone: {
        type: String,
        default: "+91 98765 43210"
    },
    supportEmail: {
        type: String,
        default: "support@flashfit.com"
    }
}, {
    timestamps: true
});

const SettingsModel = mongoose.model("settings", settingsSchema);

export default SettingsModel;
