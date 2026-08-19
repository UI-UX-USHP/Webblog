import { getSettings } from "@/lib/settings";
import IntegrationsForm from "@/components/admin/IntegrationsForm";

export default async function IntegrationsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tích hợp</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cắm thêm công cụ ngoài mà không cần sửa code hay deploy lại.
        </p>
      </div>
      <IntegrationsForm initial={settings} />
    </div>
  );
}
