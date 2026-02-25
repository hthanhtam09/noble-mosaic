import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const SecretBookSchema = new mongoose.Schema({
    title: String,
    slug: String,
});

const SecretImageSchema = new mongoose.Schema({
    secretBook: { type: mongoose.Schema.Types.ObjectId, ref: 'SecretBook' },
    order: Number,
});

const SecretBook = mongoose.models.SecretBook || mongoose.model('SecretBook', SecretBookSchema);
const SecretImage = mongoose.models.SecretImage || mongoose.model('SecretImage', SecretImageSchema);

async function checkCounts() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const books = await SecretBook.find();
        console.log(`Found ${books.length} books`);

        for (const book of books) {
            const count = await SecretImage.countDocuments({ secretBook: book._id });
            console.log(`Book: ${book.title} (${book.slug}) - Total Secrets: ${count}`);
            
            if (count > 0) {
                const maxOrder = await SecretImage.find({ secretBook: book._id }).sort({ order: -1 }).limit(1);
                console.log(`  Max order: ${maxOrder[0].order}`);
            }
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCounts();
