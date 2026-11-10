import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    pan: { type: String, default: '' },
    purpose: { type: String, default: 'For Education' },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    status: { type: String, default: 'completed' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

DonationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
DonationSchema.set('toJSON', { virtuals: true });
DonationSchema.set('toObject', { virtuals: true });

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
