// 38 classes from New Plant Diseases Dataset (vipoooool/new-plant-diseases-dataset)
// Index matches the alphabetical folder order used during training

export interface DiseaseClass {
  index: number;
  slug: string;
  cropEn: string;
  diseaseEn: string;
  isHealthy: boolean;
  severity: "none" | "low" | "medium" | "high";
}

export const CLASS_LABELS: DiseaseClass[] = [
  { index: 0,  slug: "apple-scab",                cropEn: "Apple",        diseaseEn: "Apple Scab",                              isHealthy: false, severity: "high"   },
  { index: 1,  slug: "apple-black-rot",            cropEn: "Apple",        diseaseEn: "Black Rot",                               isHealthy: false, severity: "high"   },
  { index: 2,  slug: "apple-cedar-rust",           cropEn: "Apple",        diseaseEn: "Cedar Apple Rust",                        isHealthy: false, severity: "medium" },
  { index: 3,  slug: "apple-healthy",              cropEn: "Apple",        diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 4,  slug: "blueberry-healthy",          cropEn: "Blueberry",    diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 5,  slug: "cherry-powdery-mildew",      cropEn: "Cherry",       diseaseEn: "Powdery Mildew",                          isHealthy: false, severity: "medium" },
  { index: 6,  slug: "cherry-healthy",             cropEn: "Cherry",       diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 7,  slug: "corn-cercospora",            cropEn: "Corn",         diseaseEn: "Cercospora Leaf Spot / Gray Leaf Spot",   isHealthy: false, severity: "medium" },
  { index: 8,  slug: "corn-common-rust",           cropEn: "Corn",         diseaseEn: "Common Rust",                             isHealthy: false, severity: "medium" },
  { index: 9,  slug: "corn-northern-blight",       cropEn: "Corn",         diseaseEn: "Northern Leaf Blight",                   isHealthy: false, severity: "high"   },
  { index: 10, slug: "corn-healthy",               cropEn: "Corn",         diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 11, slug: "grape-black-rot",            cropEn: "Grape",        diseaseEn: "Black Rot",                               isHealthy: false, severity: "high"   },
  { index: 12, slug: "grape-esca",                 cropEn: "Grape",        diseaseEn: "Esca (Black Measles)",                    isHealthy: false, severity: "high"   },
  { index: 13, slug: "grape-leaf-blight",          cropEn: "Grape",        diseaseEn: "Leaf Blight (Isariopsis Leaf Spot)",      isHealthy: false, severity: "medium" },
  { index: 14, slug: "grape-healthy",              cropEn: "Grape",        diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 15, slug: "orange-huanglongbing",       cropEn: "Orange",       diseaseEn: "Huanglongbing (Citrus Greening)",         isHealthy: false, severity: "high"   },
  { index: 16, slug: "peach-bacterial-spot",       cropEn: "Peach",        diseaseEn: "Bacterial Spot",                          isHealthy: false, severity: "medium" },
  { index: 17, slug: "peach-healthy",              cropEn: "Peach",        diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 18, slug: "pepper-bacterial-spot",      cropEn: "Bell Pepper",  diseaseEn: "Bacterial Spot",                          isHealthy: false, severity: "medium" },
  { index: 19, slug: "pepper-healthy",             cropEn: "Bell Pepper",  diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 20, slug: "potato-early-blight",        cropEn: "Potato",       diseaseEn: "Early Blight",                            isHealthy: false, severity: "medium" },
  { index: 21, slug: "potato-late-blight",         cropEn: "Potato",       diseaseEn: "Late Blight",                             isHealthy: false, severity: "high"   },
  { index: 22, slug: "potato-healthy",             cropEn: "Potato",       diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 23, slug: "raspberry-healthy",          cropEn: "Raspberry",    diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 24, slug: "soybean-healthy",            cropEn: "Soybean",      diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 25, slug: "squash-powdery-mildew",      cropEn: "Squash",       diseaseEn: "Powdery Mildew",                          isHealthy: false, severity: "medium" },
  { index: 26, slug: "strawberry-leaf-scorch",     cropEn: "Strawberry",   diseaseEn: "Leaf Scorch",                             isHealthy: false, severity: "medium" },
  { index: 27, slug: "strawberry-healthy",         cropEn: "Strawberry",   diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
  { index: 28, slug: "tomato-bacterial-spot",      cropEn: "Tomato",       diseaseEn: "Bacterial Spot",                          isHealthy: false, severity: "medium" },
  { index: 29, slug: "tomato-early-blight",        cropEn: "Tomato",       diseaseEn: "Early Blight",                            isHealthy: false, severity: "medium" },
  { index: 30, slug: "tomato-late-blight",         cropEn: "Tomato",       diseaseEn: "Late Blight",                             isHealthy: false, severity: "high"   },
  { index: 31, slug: "tomato-leaf-mold",           cropEn: "Tomato",       diseaseEn: "Leaf Mold",                               isHealthy: false, severity: "medium" },
  { index: 32, slug: "tomato-septoria",            cropEn: "Tomato",       diseaseEn: "Septoria Leaf Spot",                      isHealthy: false, severity: "medium" },
  { index: 33, slug: "tomato-spider-mites",        cropEn: "Tomato",       diseaseEn: "Spider Mites",                            isHealthy: false, severity: "medium" },
  { index: 34, slug: "tomato-target-spot",         cropEn: "Tomato",       diseaseEn: "Target Spot",                             isHealthy: false, severity: "medium" },
  { index: 35, slug: "tomato-yellow-curl-virus",   cropEn: "Tomato",       diseaseEn: "Yellow Leaf Curl Virus",                  isHealthy: false, severity: "high"   },
  { index: 36, slug: "tomato-mosaic-virus",        cropEn: "Tomato",       diseaseEn: "Mosaic Virus",                            isHealthy: false, severity: "high"   },
  { index: 37, slug: "tomato-healthy",             cropEn: "Tomato",       diseaseEn: "Healthy",                                 isHealthy: true,  severity: "none"   },
];

export function getClassByIndex(index: number): DiseaseClass | undefined {
  return CLASS_LABELS.find((c) => c.index === index);
}

export function getClassBySlug(slug: string): DiseaseClass | undefined {
  return CLASS_LABELS.find((c) => c.slug === slug);
}
