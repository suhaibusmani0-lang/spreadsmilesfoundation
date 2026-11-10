import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image_urls: { type: [String], default: [] },
    category: { type: String, default: 'Community Project' },
    location: { type: String, default: 'Delhi, India' },
    status: { type: String, default: 'In Progress' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Virtual property so .id returns the _id string as in Supabase
ProjectSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
