import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogHeader,
    useId,
  } from "@salt-ds/core";
  import { type ReactElement, useState, type ComponentType } from "react";
  
  interface DialogProps {
    title: string;
    openButtonLabel: string;
    onAccept?: () => void;
    onCancel?: () => void;
    acceptButtonLabel?: string;
    cancelButtonLabel?: string;
  }
  
  const withDialog = <P extends object>(
    WrappedComponent: ComponentType<P>
  ) => {
    const WithDialog = (props: P & DialogProps): ReactElement => {
      const [open, setOpen] = useState(false);
      const id = useId();
  
      const handleRequestOpen = () => {
        setOpen(true);
      };
  
      const onOpenChange = (value: boolean) => {
        setOpen(value);
      };
  
      const handleClose = () => {
        setOpen(false);
        if (props.onCancel) {
          props.onCancel();
        }
      };
  
      const handleAccept = () => {
        setOpen(false);
        if (props.onAccept) {
          props.onAccept();
        }
      };
  
      return (
        <>
          <Button data-testid="dialog-button" onClick={handleRequestOpen}>
            {props.openButtonLabel}
          </Button>
          <Dialog open={open} onOpenChange={onOpenChange} id={id}>
            {props.title && <DialogHeader header={props.title} />}
            <DialogContent style={{ maxHeight: 400, overflowY: "auto" }}>
              <WrappedComponent {...(props as P)} />
            </DialogContent>
            <DialogActions>
               {props.cancelButtonLabel && (
                <Button
                  sentiment="accented"
                  appearance="bordered"
                  onClick={handleClose}
                >
                  {props.cancelButtonLabel}
                </Button>
              )}
              {props.acceptButtonLabel && (
                <Button sentiment="accented" onClick={handleAccept}>
                  {props.acceptButtonLabel}
                </Button>
              )}
              {!props.cancelButtonLabel && !props.acceptButtonLabel && (
                <Button sentiment="accented" onClick={handleClose}>
                  Close
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </>
      );
    };
  
    // Set a helpful display name for the wrapped component
    WithDialog.displayName = `withDialog(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;
  
    return WithDialog;
  };

  export default withDialog;