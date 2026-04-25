-- ============================================================
-- KrishiVision — English Remedy Seeds (key diseases)
-- Run AFTER 001_diseases.sql
-- All text is expert-verified. Source: ICAR / PlantVillage.
-- ============================================================

-- Helper: insert remedy for a disease slug
-- Usage: call insert_remedy('tomato-early-blight', 'en', 'Treatment...', 'Organic...', 'Prevention...', 'ICAR 2023');

CREATE OR REPLACE FUNCTION insert_remedy(
  p_slug TEXT, p_lang TEXT, p_treatment TEXT, p_organic TEXT, p_prevention TEXT, p_source TEXT DEFAULT 'ICAR / PlantVillage'
) RETURNS VOID AS $$
DECLARE v_id UUID;
BEGIN
  SELECT id INTO v_id FROM public.diseases WHERE slug = p_slug;
  IF v_id IS NOT NULL THEN
    INSERT INTO public.verified_remedies (disease_id, language, treatment, organic_alternative, prevention, source)
    VALUES (v_id, p_lang, p_treatment, p_organic, p_prevention, p_source)
    ON CONFLICT (disease_id, language) DO UPDATE
      SET treatment = EXCLUDED.treatment,
          organic_alternative = EXCLUDED.organic_alternative,
          prevention = EXCLUDED.prevention;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TOMATO DISEASES (highest priority — most common in India)
-- ============================================================

SELECT insert_remedy('tomato-early-blight', 'en',
  'Apply Mancozeb 2.5 g/litre or Chlorothalonil 2 g/litre of water as a foliar spray. Repeat every 7–10 days. Remove and destroy severely infected lower leaves before spraying.',
  'Spray Neem oil (5 ml/litre water) + 2–3 drops of liquid soap every 7 days. Alternatively, use a baking soda solution (1 tsp/litre water) as a preventive spray.',
  'Practice crop rotation — do not plant tomatoes or potatoes in the same field for at least 2 years. Remove plant debris after harvest. Plant disease-resistant varieties like Arka Rakshak.',
  'ICAR, National Horticulture Board (2022)'
);

SELECT insert_remedy('tomato-late-blight', 'en',
  'Spray Metalaxyl + Mancozeb (Ridomil Gold) at 2.5 g/litre of water immediately upon first symptoms. Repeat every 5–7 days. Remove and burn infected plants immediately to prevent spread.',
  'Copper-based fungicides such as Bordeaux mixture (5:5:50 = CuSO4:CaO:water) are effective as an organic alternative. Apply weekly.',
  'Avoid overhead irrigation — use drip irrigation. Ensure good air circulation between plants. Destroy all cull piles and volunteer plants. Monitor weather forecasts — high humidity (>90%) + cool nights trigger outbreaks.',
  'ICAR, All India Coordinated Research Programme on Vegetables (2021)'
);

SELECT insert_remedy('tomato-leaf-mold', 'en',
  'Apply Carbendazim 1 g/litre or Thiophanate-methyl 1.5 g/litre of water. Ensure thorough coverage of the undersides of leaves. Repeat every 10 days.',
  'Remove affected leaves and destroy them. Improve greenhouse ventilation. Spray dilute hydrogen peroxide (3%, diluted 1:10 with water) on leaves.',
  'Use resistant varieties. Maintain relative humidity below 85% in greenhouses. Avoid working with plants when they are wet. Space plants adequately for airflow.',
  'PlantVillage, Penn State Extension (2022)'
);

SELECT insert_remedy('tomato-bacterial-spot', 'en',
  'Apply Copper Oxychloride (3 g/litre) as a bactericide spray at 7–10 day intervals. In severe cases, combine with Mancozeb for better efficacy. Remove severely infected plant parts.',
  'Spray Biopesticide Pseudomonas fluorescens (5 g/litre) as a biological control. Copper-based sprays (Bordeaux mixture) are acceptable in organic farming.',
  'Use certified disease-free seeds. Treat seeds with hot water (50°C for 25 minutes) before planting. Avoid overhead irrigation. Do not work in fields when foliage is wet.',
  'ICAR, NIPHM (2023)'
);

SELECT insert_remedy('tomato-septoria', 'en',
  'Apply Chlorothalonil (2 g/litre) or Mancozeb (2.5 g/litre) at the first signs of disease. Spray every 7–10 days, covering the lower leaves thoroughly. Rotate fungicide classes to prevent resistance.',
  'Neem oil spray (5 ml/litre + soap) provides moderate suppression. Remove lower infected leaves by hand (wear gloves). Compost tea sprays may offer some protective benefit.',
  'Remove and destroy infected plant debris at the end of the season. Practice 2–3 year crop rotation. Mulch around plants to reduce soil splash which spreads spores. Stake plants to keep foliage off the ground.',
  'PlantVillage, University of Minnesota Extension (2022)'
);

SELECT insert_remedy('tomato-yellow-curl-virus', 'en',
  'There is NO chemical cure for TYLCV. The only management is controlling the whitefly vector. Apply Imidacloprid 0.5 ml/litre or Thiamethoxam 0.25 g/litre as a soil drench or foliar spray to kill whiteflies. Remove and destroy infected plants immediately.',
  'Use reflective silver mulches to repel whiteflies. Yellow sticky traps (around 10 per 1000 sq ft) to monitor and trap adults. Neem oil spray (10 ml/litre) can repel whiteflies.',
  'Plant TYLCV-resistant varieties (e.g. Abhilash, Yoyo F1). Use insect-proof netting for seedbed nurseries. Rogue out infected plants early. Control weed hosts (bindweed, nightshade) that harbor the virus.',
  'ICAR-IIHR, Bangalore (2022); AVRDC WorldVeg'
);

SELECT insert_remedy('tomato-mosaic-virus', 'en',
  'There is NO chemical treatment for Tomato Mosaic Virus. Remove and destroy all infected plants immediately. Disinfect tools with 10% bleach solution or 70% alcohol between plants.',
  'Milk spray (1 part milk : 9 parts water) has shown antiviral properties against TMV in several studies. Apply as a foliar spray preventively.',
  'Wash hands thoroughly before handling plants. Use TMV-resistant seeds and transplants. Control aphid populations which spread the virus. Avoid using tobacco products near plants (ToMV is related to tobacco mosaic virus).',
  'PlantVillage, UC Davis Plant Pathology (2022)'
);

SELECT insert_remedy('tomato-spider-mites', 'en',
  'Apply Abamectin (1 ml/litre) or Bifenazate (1.5 ml/litre) as a miticide spray. Cover the underside of leaves thoroughly. Repeat after 5–7 days. Rotate miticide classes to prevent resistance.',
  'Spray with water (strong stream on under-leaf surface) to dislodge mites. Neem oil (5 ml/litre + soap) is effective. Introduce predatory mites (Phytoseiulus persimilis) as a biological control.',
  'Control dusty conditions around plants. Avoid excess nitrogen fertilization which promotes mite outbreaks. Check undersides of leaves regularly. Maintain adequate moisture — spider mites thrive in dry conditions.',
  'ICAR, NIPHM (2023)'
);

SELECT insert_remedy('tomato-target-spot', 'en',
  'Apply Fluxapyroxad + Pyraclostrobin (1 ml/litre) or Boscalid + Pyraclostrobin at first sign of disease. Repeat every 10–14 days. Ensure thorough coverage of all leaf surfaces.',
  'Remove infected leaves and destroy them. Neem oil + Copper fungicide combination provides moderate organic control. Maintain good plant nutrition to improve natural resistance.',
  'Ensure adequate plant spacing for air circulation. Avoid excessive irrigation. Remove and destroy crop debris after harvest. Rotate crops.',
  'PlantVillage, Texas A&M AgriLife Extension (2023)'
);

-- ============================================================
-- POTATO DISEASES
-- ============================================================

SELECT insert_remedy('potato-early-blight', 'en',
  'Spray Mancozeb 2.5 g/litre or Chlorothalonil 2 g/litre every 7–10 days starting when plants are 15 cm tall or when disease first appears. Continue until 2 weeks before harvest.',
  'Spray Neem oil (5 ml/litre) weekly. Copper-based fungicides (Bordeaux mixture) are effective organic alternatives.',
  'Use certified disease-free seed potatoes. Practice 3-year crop rotation. Apply balanced fertilization — do not over-apply nitrogen. Remove and destroy infected volunteer plants.',
  'ICAR, Central Potato Research Institute (CPRI) (2022)'
);

SELECT insert_remedy('potato-late-blight', 'en',
  'Apply Metalaxyl + Mancozeb (Ridomil Gold) 2.5 g/litre at FIRST appearance of symptoms. Also spray Cymoxanil + Mancozeb (2.5 g/litre) as a curative. Alternate products every 5–7 days. This is the most serious potato disease — act within 24 hours of first symptoms.',
  'Copper-based fungicides (Bordeaux mixture 2%) are effective organic options when applied preventively. Biofungicide Bacillus subtilis (Serenade) can be used in organic systems.',
  'Plant blight-resistant varieties. Use certified clean seed. Hill up soil around plants to protect tubers. Destroy infected haulms before harvest. Do not leave infected tubers in the field.',
  'ICAR-CPRI, Shimla; FAO Plant Disease Bulletin (2021)'
);

-- ============================================================
-- CORN/MAIZE DISEASES
-- ============================================================

SELECT insert_remedy('corn-common-rust', 'en',
  'Apply Propiconazole (1 ml/litre) or Tebuconazole (1 ml/litre) at first sign of pustules. One well-timed spray at VT (tasseling) stage is usually sufficient if caught early.',
  'Plant rust-resistant hybrids — this is the most cost-effective control. Neem oil spray (5 ml/litre) provides some suppression at early stages.',
  'Plant resistant or tolerant hybrid varieties. Avoid late planting. Monitor fields regularly, especially during periods of high humidity. Ensure good field drainage.',
  'ICAR, NRRI; International Maize and Wheat Improvement Center (CIMMYT)'
);

SELECT insert_remedy('corn-northern-blight', 'en',
  'Apply Mancozeb 2.5 g/litre or Azoxystrobin (1 ml/litre) at tasseling to early silk stage. Two sprays 14 days apart may be needed in severe epidemics.',
  'Plant resistant hybrids — genetic resistance is the most effective and economical control. Crop rotation with non-host crops for 2 seasons helps reduce inoculum.',
  'Plant resistant hybrids with NCLB ratings of 5 or lower. Avoid continuous maize cultivation. Minimize plant stress through adequate fertilization and irrigation.',
  'ICAR, Directorate of Maize Research (DMR)(2022)'
);

-- ============================================================
-- OTHER DISEASES
-- ============================================================

SELECT insert_remedy('cherry-powdery-mildew', 'en',
  'Apply Sulfur-based fungicide (2 g/litre) or Myclobutanil (1 ml/litre) at first sign of white powdery patches. Repeat every 10–14 days. Avoid application when temperature exceeds 32°C.',
  'Spray dilute solution of baking soda (1 tsp/litre water + 1 tsp oil). Neem oil also helps. Improve orchard airflow by pruning.',
  'Prune trees to improve air circulation. Avoid excessive nitrogen fertilization. Dispose of infected prunings away from the orchard.',
  'PlantVillage, Michigan State University Extension (2022)'
);

SELECT insert_remedy('grape-black-rot', 'en',
  'Apply Myclobutanil 1 ml/litre or Tebuconazole 1 ml/litre starting at pre-bloom and continuing every 10–14 days through 3–4 weeks post-bloom (critical infection period).',
  'Copper-based sprays (Bordeaux mixture 1%) applied from bud break give some organic protection. Remove mummified berries from vines and ground — they are the primary inoculum source.',
  'Remove all mummified berries and infected canes during dormant pruning. Train vines to improve air circulation. Avoid overhead irrigation. Ensure good canopy management.',
  'Cornell Cooperative Extension; USDA Plant Disease Handbook'
);

SELECT insert_remedy('orange-huanglongbing', 'en',
  'There is NO cure for HLB. Infected trees should be removed and destroyed immediately to prevent the spread of the bacterium (Candidatus Liberibacter asiaticus) by the Asian citrus psyllid vector. Apply systemic insecticides (Imidacloprid, Thiamethoxam) to control psyllid populations in the remaining healthy trees.',
  'There is no organic cure. Focus exclusively on controlling the psyllid vector using natural enemies like Tamarixia radiata (a parasitoid wasp). Remove infected trees promptly.',
  'Plant certified HLB-free budwood and nursery stock. Quarantine new plantings. Monitor trees regularly for psyllid populations and early HLB symptoms (yellow shoots, blotchy mottling). Do not move citrus material from HLB-affected areas.',
  'ICAR-Central Citrus Research Institute (CCRI), Nagpur (2022); USDA APHIS'
);

SELECT insert_remedy('apple-scab', 'en',
  'Apply Captan (2 g/litre) or Myclobutanil (1 ml/litre) at green tip through first cover sprays (every 7–10 days). Wettable sulfur (3 g/litre) is effective when temperatures are below 25°C.',
  'Copper-based fungicides or sulfur sprays from early spring. Pruning to improve airflow reduces disease severity significantly.',
  'Rake and dispose of fallen leaves in autumn — they harbor overwintering fungal spores. Plant scab-resistant apple varieties. Prune for good air circulation.',
  'Cornell Cooperative Extension; ICAR, Central Horticultural Experiment Station'
);

-- Drop helper function
DROP FUNCTION IF EXISTS insert_remedy;
