# 🌱 KrishiVision

**Empowering Indian Farmers with Offline AI Plant Diagnosis.**

KrishiVision is a high-performance Progressive Web App (PWA) designed to provide instant, zero-latency plant disease diagnosis to farmers, even in areas with poor internet connectivity. By leveraging TensorFlow.js, KrishiVision runs AI inference directly in the browser, ensuring privacy, speed, and reliability.

## 🚀 Key Features

- **In-Browser AI Inference**: Instant diagnosis using MobileNetV2 without uploading images to a server.
- **Offline-First PWA**: Can be installed on mobile devices and works without an active internet connection.
- **Multilingual Support**: Available in 9 Indian languages: Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Punjabi, Kannada, and English.
- **Verified Remedies**: Connects diagnosis results to expert-curated, zero-hallucination treatment plans stored in Supabase.
- **Agri Marketplace**: A dedicated space for farmers to buy/sell equipment and produce.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **AI Engine**: TensorFlow.js (TF.js)
- **Backend & Auth**: Supabase (PostgreSQL, Storage, Auth)
- **Localization**: next-intl

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+
- Supabase Project

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/Saumok/krishivision.git
   ```
2. Install dependencies:
   ```bash
   cd web
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## 🧠 Model Training
The model is trained using the **New Plant Diseases Dataset** (87k images). You can find the Kaggle training script in `training/train_and_convert.py`.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Built with ❤️ for Indian Agriculture.*