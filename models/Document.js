import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    file_url: { type: String, required: true },
    category: { type: String, default: 'Reports' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

DocumentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
DocumentSchema.set('toJSON', { virtuals: true });
DocumentSchema.set('toObject', { virtuals: true });

export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);
