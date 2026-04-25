"""
KrishiVision — Plant Disease Model Training + TF.js Conversion
================================================================
Dataset: New Plant Diseases Dataset (vipoooool/new-plant-diseases-dataset)
         87K images, 38 classes, 80/20 train/val split
Model:   MobileNetV2 (transfer learning)
Output:  TF.js LayersModel for browser inference

HOW TO RUN:
1. Upload this file as a Kaggle notebook in the dataset:
   https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset
2. Enable GPU Accelerator (Settings → Accelerator → GPU P100)
3. Run all cells
4. Download the output 'tfjs_model.zip' from the Output tab
5. Extract and paste contents into web/public/model/
"""

# ================================================================
# CELL 1: Install dependencies
# ================================================================
import subprocess
subprocess.run(["pip", "install", "tensorflowjs", "-q"])

# ================================================================
# CELL 2: Imports & Configuration
# ================================================================
import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import tensorflowjs as tfjs
import shutil

print(f"TensorFlow version: {tf.__version__}")
print(f"GPU available: {len(tf.config.list_physical_devices('GPU')) > 0}")

# ================================================================
# CELL 3: Dataset Configuration
# ================================================================
DATASET_PATH = "/kaggle/input/new-plant-diseases-dataset/New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)"
TRAIN_DIR = os.path.join(DATASET_PATH, "train")
VAL_DIR   = os.path.join(DATASET_PATH, "valid")

IMG_SIZE    = 224
BATCH_SIZE  = 64
EPOCHS_WARM = 10   # Phase 1: train only new head (base frozen)
EPOCHS_FINE = 15   # Phase 2: fine-tune top layers
NUM_CLASSES = 38

# Verify dataset
train_classes = sorted(os.listdir(TRAIN_DIR))
print(f"Number of classes: {len(train_classes)}")
print(f"Classes: {train_classes[:5]}...")

# ================================================================
# CELL 4: Data Generators
# ================================================================
# Training: with augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.1,
    zoom_range=0.15,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],
    fill_mode='nearest'
)

# Validation: only rescale
val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=True
)

val_generator = val_datagen.flow_from_directory(
    VAL_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

print(f"\nTraining samples: {train_generator.samples}")
print(f"Validation samples: {val_generator.samples}")
print(f"Class indices: {list(train_generator.class_indices.items())[:5]}...")

# Save class indices mapping
class_indices = train_generator.class_indices
# Invert to get index → class name
index_to_class = {v: k for k, v in class_indices.items()}

# ================================================================
# CELL 5: Build Model (Phase 1 — Frozen base)
# ================================================================
def build_model(num_classes: int, trainable_base: bool = False):
    """Build MobileNetV2 transfer learning model."""
    base_model = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = trainable_base

    inputs = keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model(inputs, training=trainable_base)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(512, activation='relu')(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = keras.Model(inputs, outputs)
    return model, base_model

model, base_model = build_model(NUM_CLASSES, trainable_base=False)
model.summary()

# ================================================================
# CELL 6: Phase 1 — Train head only (warm-up)
# ================================================================
model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-3),
    loss='categorical_crossentropy',
    metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3, name='top3_accuracy')]
)

callbacks_warmup = [
    ModelCheckpoint('best_model_warmup.keras', monitor='val_top3_accuracy',
                    save_best_only=True, verbose=1),
    EarlyStopping(monitor='val_top3_accuracy', patience=5, restore_best_weights=True),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6, verbose=1)
]

print("\n=== Phase 1: Training head (base frozen) ===")
history_warmup = model.fit(
    train_generator,
    epochs=EPOCHS_WARM,
    validation_data=val_generator,
    callbacks=callbacks_warmup,
    verbose=1
)

print(f"\nBest warm-up val Top-3 accuracy: "
      f"{max(history_warmup.history['val_top3_accuracy']):.4f}")

# ================================================================
# CELL 7: Phase 2 — Fine-tune (unfreeze top layers)
# ================================================================
# Unfreeze top 30 layers of MobileNetV2
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-4),
    loss='categorical_crossentropy',
    metrics=['accuracy', keras.metrics.TopKCategoricalAccuracy(k=3, name='top3_accuracy')]
)

callbacks_fine = [
    ModelCheckpoint('best_model_final.keras', monitor='val_top3_accuracy',
                    save_best_only=True, verbose=1),
    EarlyStopping(monitor='val_top3_accuracy', patience=7, restore_best_weights=True),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=4, min_lr=1e-7, verbose=1)
]

print("\n=== Phase 2: Fine-tuning top 30 base layers ===")
history_fine = model.fit(
    train_generator,
    epochs=EPOCHS_FINE,
    validation_data=val_generator,
    callbacks=callbacks_fine,
    verbose=1
)

best_top3 = max(history_fine.history['val_top3_accuracy'])
best_top1 = max(history_fine.history['val_accuracy'])
print(f"\n✓ Final Best — Top-1: {best_top1:.4f}, Top-3: {best_top3:.4f}")

# ================================================================
# CELL 8: Final Evaluation
# ================================================================
model.load_weights('best_model_final.keras')
loss, acc, top3 = model.evaluate(val_generator, verbose=1)
print(f"\n=== Final Evaluation ===")
print(f"Top-1 Accuracy: {acc*100:.2f}%")
print(f"Top-3 Accuracy: {top3*100:.2f}%")
print(f"Loss:           {loss:.4f}")

# ================================================================
# CELL 9: Convert to TF.js format
# ================================================================
TFJS_OUTPUT_DIR = "/kaggle/working/tfjs_model"
os.makedirs(TFJS_OUTPUT_DIR, exist_ok=True)

print("\n=== Converting to TF.js LayersModel ===")
tfjs.converters.save_keras_model(model, TFJS_OUTPUT_DIR)
print(f"✓ TF.js model saved to: {TFJS_OUTPUT_DIR}")

# List output files
tfjs_files = os.listdir(TFJS_OUTPUT_DIR)
print(f"Files created: {tfjs_files}")

# ================================================================
# CELL 10: Save class labels mapping (CRITICAL for frontend)
# ================================================================
# This maps TF.js output index to disease slug
# Must match lib/classLabels.ts in the frontend

CLASS_SLUG_MAP = {
    0:  "apple-scab",
    1:  "apple-black-rot",
    2:  "apple-cedar-rust",
    3:  "apple-healthy",
    4:  "blueberry-healthy",
    5:  "cherry-powdery-mildew",
    6:  "cherry-healthy",
    7:  "corn-cercospora",
    8:  "corn-common-rust",
    9:  "corn-northern-blight",
    10: "corn-healthy",
    11: "grape-black-rot",
    12: "grape-esca",
    13: "grape-leaf-blight",
    14: "grape-healthy",
    15: "orange-huanglongbing",
    16: "peach-bacterial-spot",
    17: "peach-healthy",
    18: "pepper-bacterial-spot",
    19: "pepper-healthy",
    20: "potato-early-blight",
    21: "potato-late-blight",
    22: "potato-healthy",
    23: "raspberry-healthy",
    24: "soybean-healthy",
    25: "squash-powdery-mildew",
    26: "strawberry-leaf-scorch",
    27: "strawberry-healthy",
    28: "tomato-bacterial-spot",
    29: "tomato-early-blight",
    30: "tomato-late-blight",
    31: "tomato-leaf-mold",
    32: "tomato-septoria",
    33: "tomato-spider-mites",
    34: "tomato-target-spot",
    35: "tomato-yellow-curl-virus",
    36: "tomato-mosaic-virus",
    37: "tomato-healthy",
}

# Verify: model class_indices should match our map
print("\n=== Verifying class order ===")
for idx, folder_name in sorted(index_to_class.items()):
    expected_slug = CLASS_SLUG_MAP.get(idx, "UNKNOWN")
    # Just print mapping for manual verification
    print(f"  [{idx:2d}] Dataset folder: {folder_name:<50} → Our slug: {expected_slug}")

# Save class_labels.json to model output dir
class_labels_json = {
    "num_classes": NUM_CLASSES,
    "image_size": IMG_SIZE,
    "confidence_threshold": 0.60,
    "labels": [
        {"index": idx, "slug": slug}
        for idx, slug in CLASS_SLUG_MAP.items()
    ],
    "dataset_folder_order": index_to_class  # Keep for reference
}

with open(os.path.join(TFJS_OUTPUT_DIR, "class_labels.json"), "w") as f:
    json.dump(class_labels_json, f, indent=2)
print("\n✓ class_labels.json saved")

# ================================================================
# CELL 11: Package everything as ZIP
# ================================================================
ZIP_PATH = "/kaggle/working/tfjs_model"
shutil.make_archive(ZIP_PATH, "zip", TFJS_OUTPUT_DIR)
print(f"\n✓ ZIP created: {ZIP_PATH}.zip")
print(f"   Size: {os.path.getsize(ZIP_PATH + '.zip') / 1024 / 1024:.1f} MB")

print("""
================================================================
DONE! Next steps:
================================================================
1. Go to your Kaggle notebook → Output tab
2. Download 'tfjs_model.zip'
3. Extract the zip
4. Copy ALL files (model.json + *.bin + class_labels.json) into:
   krishivision-main/web/public/model/
5. Commit and push to GitHub
6. Deploy to Vercel — the model will be served from CDN
   and cached by the service worker

The TF.js model runs 100% in the browser.
No server needed for AI inference!
================================================================
""")
