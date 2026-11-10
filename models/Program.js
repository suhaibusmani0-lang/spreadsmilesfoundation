import mongoose from 'mongoose';

const ProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image_urls: { type: [String], default: [] },
    category: { type: String, default: 'Social Initiative' },
    location: { type: String, default: 'Delhi, India' },
    status: { type: String, default: 'Active & Ongoing' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProgramSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
ProgramSchema.set('toJSON', { virtuals: true });
ProgramSchema.set('toObject', { virtuals: true });

export default mongoose.models.Program || mongoose.model('Program', ProgramSchema);
