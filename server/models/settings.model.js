import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    upiId: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const SettingsModel = mongoose.model("settings", settingsSchema);

export default SettingsModel;
