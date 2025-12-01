import { Sheet } from "react-modal-sheet";
import styles from "./describeBottomSheet.module.css";
import Image from "next/image";

export default function DescribeBottomSheet({
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
              <img
                src="/assets/DescribeFlowersComponent/send_flowers.svg"
                alt="Flowers"
                className={styles.illustration}
              />

              <p className={styles.title}>
                Make your interest stand out with a Flower and a note!
              </p>

              <p className={styles.subtitle}>
                You can send flowers to 3 people a day.
              </p>

              <button className={styles.ctaButton} onClick={onClose}>
                Got It!
              </button>

              <p className={styles.footerNote}>your flower lasts 24hrs!</p>
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
}
