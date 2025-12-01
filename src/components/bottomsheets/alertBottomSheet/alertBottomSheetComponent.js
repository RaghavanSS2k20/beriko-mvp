import { Sheet } from "react-modal-sheet";
import styles from "./alertSheetStyles.module.css";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";

export default function AlertBottomSheet({
  open,
  onClose,
  children,
  onCloseEnd,
}) {
  return (
    <Sheet
      isOpen={open}
      onClose={onClose}
      onCloseEnd={onCloseEnd}
      detent="content"
    >
      <Sheet.Container className={styles.sheetContainer}>
        <Sheet.Header className={styles.header}>
          <h3 className={styles.heading}>send flowers</h3>
        </Sheet.Header>

        <Sheet.Content>
          {children || (
            <div className={styles.container}>
              <div className={styles.iconWrapper}>
                <TriangleAlert className={styles.alertIcon} />
              </div>

              <p className={styles.title}>
                You can't send Again To Same Person!
              </p>

              <p className={styles.subtitle}>
                Respect thier space and send back after 72hrs
              </p>
              <button className={styles.ctaButton} onClick={onClose}>
                I Understand!
              </button>
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
