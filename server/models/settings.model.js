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
    },
    storeAddress: {
        type: String,
        default: "42 Fashion Street, Mumbai, MH 400001"
    }
}, {
    timestamps: true
});

const SettingsModel = mongoose.model("settings", settingsSchema);

export default SettingsModel;
