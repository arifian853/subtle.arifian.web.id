import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { SettingsForm } from "./SettingsForm";

export function OverlayDemo() {
  return (
    <div className="overlay-demo">
      <div className="inspector-preview">
        <span className="context-capsule">Floating Inspector</span>
        <h3>
          One surface.
          <br />A clear purpose.
        </h3>
        <dl className="token-list">
          <div>
            <dt>Surface</dt>
            <dd>Floating</dd>
          </div>
          <div>
            <dt>Shape</dt>
            <dd>24 px</dd>
          </div>
          <div>
            <dt>Elevation</dt>
            <dd>Level 2</dd>
          </div>
        </dl>
        <Dialog>
          <DialogTrigger render={<Button variant="secondary" />}>
            Open inspector
          </DialogTrigger>
          <DialogContent variant="sheet">
            <DialogTitle>Surface inspector</DialogTitle>
            <DialogDescription>
              Adjust a synthetic workspace. On mobile, the inspector becomes a
              bottom sheet.
            </DialogDescription>
            <SettingsForm />
          </DialogContent>
        </Dialog>
      </div>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Open dialog
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>A moment to consider</DialogTitle>
          <DialogDescription>
            Dialogs hold a focused decision. This specimen keeps its state in
            your browser.
          </DialogDescription>
          <div className="tonal-card">
            <p>
              Use a layered sheet for longer tasks. Keep a dialog focused on one
              decision.
            </p>
          </div>
          <DialogClose render={<Button />}>Understood</DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
