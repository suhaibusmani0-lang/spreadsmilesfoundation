export const metadata = {
  title: 'Admin Portal | Spread Smiles Foundation',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-slate-900">{children}</div>;
}
