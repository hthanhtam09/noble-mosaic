import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const SecretImageSchema = new mongoose.Schema({
    secretBook: { type: mongoose.Schema.Types.ObjectId, ref: 'SecretBook' },
    order: Number,
    colorImageUrl: String,
    uncolorImageUrl: String,
    createdAt: Date,
});

const SecretImage = mongoose.models.SecretImage || mongoose.model('SecretImage', SecretImageSchema);

async function listSecrets() {
    try {
        await mongoose.connect(MONGODB_URI);
        const secrets = await SecretImage.find().sort({ order: 1 });
        
        console.log(`Order | Created At | Color URL`);
        console.log(`------|------------|----------`);
        secrets.forEach(s => {
            console.log(`${s.order} | ${s.createdAt.toISOString()} | ${s.colorImageUrl.substring(0, 50)}...`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

listSecrets();
