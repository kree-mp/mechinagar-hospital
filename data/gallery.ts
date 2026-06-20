export interface GalleryItem {
  label: string;
  col: string;
  row: string;
}

export const gallery: GalleryItem[] = [
  { label: "BUILDING", col: "span 2", row: "span 2" },
  { label: "OPD", col: "span 1", row: "span 1" },
  { label: "LAB", col: "span 1", row: "span 1" },
  { label: "WARD", col: "span 1", row: "span 1" },
  { label: "STAFF", col: "span 1", row: "span 1" },
  { label: "AMBULANCE", col: "span 2", row: "span 1" },
  { label: "CAMP", col: "span 2", row: "span 1" },
];
