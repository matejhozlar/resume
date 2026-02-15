import { useEffect, useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PDFPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfBlob: Blob | null;
  generating: boolean;
  filename: string;
}

export function PDFPreviewModal({
  open,
  onOpenChange,
  pdfBlob,
  generating,
  filename,
}: PDFPreviewModalProps) {
  const { t } = useLocale();
  const [failedBlob, setFailedBlob] = useState<Blob | null>(null);
  const iframeFailed = failedBlob !== null && failedBlob === pdfBlob;

  const objectUrl = useMemo(() => {
    if (pdfBlob) {
      return URL.createObjectURL(pdfBlob);
    }
    return null;
  }, [pdfBlob]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  function handleDownload() {
    if (!objectUrl) return;
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.click();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex w-[95vw] max-w-6xl sm:max-w-6xl h-[90vh] flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{t.actions.previewCV}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 px-6">
          {generating ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin" />
              <p>{t.actions.generatingPDF}</p>
            </div>
          ) : objectUrl && !iframeFailed ? (
            <iframe
              src={objectUrl}
              title={t.actions.previewCV}
              className="w-full h-full rounded border"
              onError={() => setFailedBlob(pdfBlob)}
            />
          ) : objectUrl && iframeFailed ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <p>{t.actions.pdfPreviewUnavailable}</p>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="size-4 mr-2" />
                {t.actions.downloadInstead}
              </Button>
            </div>
          ) : null}
        </div>

        <DialogFooter className="px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.actions.close}
          </Button>
          <Button onClick={handleDownload} disabled={!objectUrl}>
            <Download className="size-4 mr-2" />
            {t.actions.download}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
