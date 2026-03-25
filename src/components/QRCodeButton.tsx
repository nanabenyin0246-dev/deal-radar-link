import { useState } from "react";
import { QrCode, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QRCodeButtonProps {
  url: string;
  productName: string;
  size?: number;
}

export const getQRCodeUrl = (url: string, size = 200): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&format=png&margin=10`;
};

const QRCodeButton = ({ url, productName, size = 250 }: QRCodeButtonProps) => {
  const [open, setOpen] = useState(false);
  const qrUrl = getQRCodeUrl(url, size);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `robcompare-${productName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const res = await fetch(qrUrl);
        const blob = await res.blob();
        const file = new File([blob], `${productName}-qr.png`, { type: "image/png" });
        await navigator.share({
          title: `${productName} — RobCompare`,
          text: `Scan to compare prices for ${productName}`,
          files: [file],
        });
      } catch {
        navigator.clipboard.writeText(url);
      }
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <QrCode className="w-4 h-4" />
        QR Code
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xs text-center">
          <DialogHeader>
            <DialogTitle>Share via QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-3 rounded-xl border border-border">
              <img
                src={qrUrl}
                alt={`QR code for ${productName}`}
                width={size}
                height={size}
                className="rounded"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Scan to compare prices for <strong>{productName}</strong>
            </p>
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1 gap-1.5" onClick={handleDownload}>
                <Download className="w-4 h-4" /> Download
              </Button>
              <Button className="flex-1 gap-1.5" onClick={handleShare}>
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodeButton;
