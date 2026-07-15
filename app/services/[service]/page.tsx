import ServiceList from '@/components/custom/service/ServiceList';

type Props = {
  params: Promise<{ service: string }>;
};

const serviceNames: Record<string, string> = { /* your existing mapping */ };

export default async function ServicePage({ params }: Props) {
  const { service } = await params;
  
  const serviceName = serviceNames[service] || 
    service.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      

      {/* Services Section */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <ServiceList service={service} serviceDisplayName={serviceName} />
      </div>
    </div>
  );
}