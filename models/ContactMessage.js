import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ContactMessageSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
ContactMessageSchema.set('toJSON', { virtuals: true });
ContactMessageSchema.set('toObject', { virtuals: true });

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
