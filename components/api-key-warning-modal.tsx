import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ApiKeyWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyWarningModal({ isOpen, onClose }: ApiKeyWarningModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GLOBAL API Key Required"
      description="To perform operations in this app, an GLOBAL API key is required."
    >
      <div className="py-6 space-y-4">
        <p>
          If you have an GLOBAL API key, please go to settings and enter it there. If you do not have an GLOBAL API key, please note that as this is an MVP 1 application, access keys are restricted and limited. You need to contact the developer by sending an email to suporte@tonilab.cloud.
        </p>
        <p>
          If you are running this project on your own host, please create and insert your own credentials.
        </p>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
} 