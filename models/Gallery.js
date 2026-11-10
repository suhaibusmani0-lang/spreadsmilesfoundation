import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image_url: { type: String, required: true },
    category: { type: String, default: 'General' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

GallerySchema.virtual('id').get(function () {
  return this._id.toHexString();
});
GallerySchema.set('toJSON', { virtuals: true });
GallerySchema.set('toObject', { virtuals: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
