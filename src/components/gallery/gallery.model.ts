import type { Document, Model } from 'mongoose';
import { model, Schema } from 'mongoose';

interface Image {
  name: string;
  filePath: string;
  timestamp: Date;
}

interface Gallery extends Document {
  userEmail: string;
  images: Image[];
}

const GallerySchema = new Schema<Gallery>(
  {
    userEmail: {
      type: String,
      required: true,
    },
    images: [
      {
        name: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);
const GalleryModel: Model<Gallery> = model<Gallery>('Gallery', GallerySchema);
export default GalleryModel;
