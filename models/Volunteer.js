import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    message: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VolunteerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
VolunteerSchema.set('toJSON', { virtuals: true });
VolunteerSchema.set('toObject', { virtuals: true });

export default mongoose.models.Volunteer || mongoose.model('Volunteer', VolunteerSchema);
