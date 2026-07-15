// D:\ams projects\denuri\customer\customer\app\service\[id]\page.tsx
import ServiceDetails from "@/components/custom/service/ServiceDetails";
import ServiceBooking from "@/components/custom/service/ServicBooking";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">
        <ServiceDetails id={id} />
        <ServiceBooking id={id} />
      </div>
    </div>
  );
}