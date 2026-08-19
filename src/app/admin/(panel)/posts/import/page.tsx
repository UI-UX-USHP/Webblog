import ImportForm from "@/components/admin/ImportForm";

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import Markdown</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dán nội dung hoặc chọn file <code>.md</code> để tạo nhanh một bản nháp.
        </p>
      </div>
      <ImportForm />
    </div>
  );
}
