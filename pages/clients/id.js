import { useRouter } from 'next/router';

export default function ClientDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Client Details</h1>
      <p>Client ID: {id}</p>
      {/* Add more client details here */}
    </div>
  );
}
