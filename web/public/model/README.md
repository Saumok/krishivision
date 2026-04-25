# KrishiVision — Model Placeholder

This directory (`/public/model/`) is where your trained TF.js model files go.

## Files needed here:
```
model/
├── model.json              ← TF.js model topology
├── group1-shard1of8.bin    ← Model weights (split into shards)
├── group1-shard2of8.bin
├── ...                     ← (number of shards depends on model size)
└── class_labels.json       ← Class index → disease slug mapping
```

## How to get these files:

1. Go to Kaggle and open this dataset:
   https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset

2. Create a new Kaggle Notebook in that dataset

3. Copy the contents of `training/train_and_convert.py` into the notebook

4. Enable **GPU Accelerator** (Settings → Accelerator → GPU P100)

5. Run all cells (~30–40 minutes)

6. Go to the **Output** tab → Download `tfjs_model.zip`

7. Extract the zip and copy all files here

8. Commit and push → Vercel will serve them from CDN

## Model specs:
- Architecture: MobileNetV2 + GlobalAvgPool + Dense(512) + Dense(38)
- Input: 224 × 224 × 3 (RGB, normalized [0, 1])
- Output: 38 class probabilities (softmax)
- Expected size: ~15–20 MB
- Inference time: ~200–500ms on modern phone browser

## The model will be cached by the browser after first load — farmers get instant inference on all subsequent scans!
