import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

AdminSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
AdminSchema.set('toJSON', { virtuals: true });
AdminSchema.set('toObject', { virtuals: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
