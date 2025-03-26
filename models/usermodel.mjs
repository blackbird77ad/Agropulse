import { Schema, model, Types } from 'mongoose';
import { toJSON } from '@reis/mongoose-to-json';

const userSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    resetToken: { type: String, default: null }, // For forgot password
    name: { type: String },
    dateOfBirth: { type: Date, default: Date.now },
    profilePicture: { type: String },
    role: { type: String, enum: ['site-visitor', 'farmers', 'district-officer', 'admin'], default: 'site-visitor', required: true }
}, {
    timestamps: true,
});

// Add the toJSON plugin
userSchema.plugin(toJSON);

export const UserModel = model('User', userSchema);