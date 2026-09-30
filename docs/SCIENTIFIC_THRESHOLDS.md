# 🔬 AgriFarmAssistant: Scientific Thresholds & Protocols Matrix

> **Authoritative Baseline**: Derived from peer-reviewed publications and manuals of the **Indian Council of Agricultural Research (ICAR)**, specifically:
> - **ICAR-CIFA** (Central Institute of Freshwater Aquaculture, Bhubaneswar, Odisha)
> - **ICAR-CARI** (Central Avian Research Institute, Izatnagar, Uttar Pradesh)
> 
> *Used by the Stage-2 Verification Layer and the 4-Agent AI Core to eliminate hallucinated advice.*

---

## 1. ICAR-CIFA Fisheries Standards

### 1.1 Indian Major Carp (IMC) Polyculture Ratio

In traditional and semi-intensive freshwater fisheries, ecological niche stratification maximizes feed efficiency and natural pond productivity:

| Species | Ecological Niche | Feeding Zone | Standard Stocking Ratio | Optimal Stocking Density |
| :--- | :--- | :--- | :---: | :---: |
| **Catla** (*Gibelion catla*) | Surface feeder | Phytoplankton & Zooplankton | **30% – 35%** | 1,500 – 2,000 fingerlings/acre |
| **Rohu** (*Labeo rohita*) | Column feeder | Periphyton & Decaying debris | **35% – 40%** | 2,000 – 2,500 fingerlings/acre |
| **Mrigal** (*Cirrhinus mrigala*) | Bottom dweller | Benthic detritus & microfauna | **25% – 30%** | 1,000 – 1,500 fingerlings/acre |

#### Alternative Polyculture Additions:
- **Grass Carp** (*Ctenopharyngodon idella*): 5% - 10% (where aquatic weeds are present).
- **Silver Carp** (*Hypophthalmichthys molitrix*): 10% (surface competitor with Catla; avoid over-stocking).
- **Freshwater Giant Prawn** (*Macrobrachium rosenbergii*): Bottom niche companion (1,000 - 2,000 post-larvae/acre).

---

## 2. Water Quality Critical Threshold Matrix

The following threshold matrix governs automated in-app alerts and overrides AI-generated advice.

| Telemetry Parameter | Unit | Lethal Minimum | Critical Stress | Optimal Range | Warning High | Lethal Maximum | Action Required on Breach |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Dissolved Oxygen (DO)** | $\text{mg/L}$ | $< 1.0$ | $1.0 - 2.9$ | **$5.0 - 8.5$** | $> 12.0$ *(gas bubble risk)* | — | Turn on mechanical aerators immediately; suspend all feeding; pump fresh water. |
| **Water pH** | scale | $< 4.5$ | $4.5 - 6.4$ | **$6.8 - 8.2$** | $8.5 - 9.2$ | $> 10.5$ | If acidic: apply agricultural lime ($\text{CaCO}_3$) at $200-400\text{ kg/ha}$. If basic: apply gypsum or alum. |
| **Un-ionized Ammonia ($\text{NH}_3$)** | $\text{mg/L}$ | — | $> 0.05$ | **$0.00 - 0.02$** | $0.05 - 0.10$ | $> 0.20$ | Water exchange (20-30%); reduce protein content in feed; add zeolite/probiotics. |
| **Nitrite ($\text{NO}_2^-$)** | $\text{mg/L}$ | — | $> 0.20$ | **$< 0.05$** | $0.10 - 0.50$ | $> 1.00$ | Brown blood disease prevention: broadcast non-iodized raw rock salt ($\text{NaCl}$) at $50-100\text{ kg/acre}$. |
| **Water Temperature** | $^\circ\text{C}$ | $< 12.0$ | $12.0 - 20.0$ | **$26.0 - 32.0$** | $33.0 - 36.0$ | $> 38.0$ | Hot weather: increase pond depth to $\ge 5\text{ ft}$; run fountain aerators at night. |
| **Transparency (Secchi Disk)**| $\text{cm}$ | $< 15$ | $15 - 24$ | **$30 - 45$** | $50 - 65$ | $> 75$ | $< 20\text{ cm}$: Algal bloom risk, halt manure/fertilizer. $> 50\text{ cm}$: Nutrient poor, fertilize with cow dung + SSP. |

---

## 3. ICAR-CARI Poultry Standards

### 3.1 Commercial Broiler Performance Targets (Cobb 500 / Ross 308)

| Age (Days) | Cumulative Feed Consumed (g/bird) | Target Body Weight (g/bird) | Daily Weight Gain (DWG) (g/day) | Target Cumulative FCR |
| :---: | :---: | :---: | :---: | :---: |
| **Day 1** | $12\text{ g}$ | $42\text{ g}$ | — | — |
| **Day 7** | $160\text{ g}$ | $190\text{ g}$ | $21.1\text{ g}$ | **0.84** |
| **Day 14** | $510\text{ g}$ | $480\text{ g}$ | $41.4\text{ g}$ | **1.06** |
| **Day 21** | $1,120\text{ g}$ | $950\text{ g}$ | $67.1\text{ g}$ | **1.18** |
| **Day 28** | $1,980\text{ g}$ | $1,550\text{ g}$ | $85.7\text{ g}$ | **1.28** |
| **Day 35** | $3,050\text{ g}$ | $2,250\text{ g}$ | $100.0\text{ g}$ | **1.36** |
| **Day 42** | $4,350\text{ g}$ | $2,850\text{ g}$ | $85.7\text{ g}$ | **1.53** |

### 3.2 Desi & Kadaknath (Indigenous Breed) Performance

| Age (Weeks) | Kadaknath Target Weight (g) | Aseel / Desi Target Weight (g) | Expected FCR Range |
| :---: | :---: | :---: | :---: |
| **Week 4** | $180 - 220\text{ g}$ | $220 - 260\text{ g}$ | $2.2 - 2.5$ |
| **Week 8** | $500 - 600\text{ g}$ | $650 - 750\text{ g}$ | $2.6 - 2.9$ |
| **Week 12** | $850 - 950\text{ g}$ | $1,100 - 1,250\text{ g}$ | $3.0 - 3.4$ |
| **Week 16 (Market)** | $1,100 - 1,300\text{ g}$ | $1,400 - 1,600\text{ g}$ | $3.2 - 3.7$ |

---

## 4. Poultry Heat Stress & Thermal Comfort Index (THI)

Heat stress in Indian sheds (especially open-sided structures) causes sudden spikes in mortality and drop in egg production.

### The Temperature-Humidity Index Formula
$$\text{THI} = 0.8 \times T_{\text{ambient}} + \left(\frac{\text{RH}\%}{100}\right) \times (T_{\text{ambient}} - 14.4) + 46.4$$

where $T_{\text{ambient}}$ is dry bulb temperature in $^\circ\text{C}$ and $\text{RH}\%$ is relative humidity.

| THI Range | Alert Status | Impact on Poultry | Automated Interventions Triggered |
| :---: | :---: | :--- | :--- |
| **$< 70$** | 🟢 **Comfort Zone** | Optimal feed intake and growth. | Normal feeding schedules. |
| **$70 - 75$** | 🟡 **Alert** | Slight panting, increased water intake. | Ensure continuous cool water, activate fans. |
| **$76 - 81$** | 🟠 **Danger** | Severe panting, feed intake drops by 15-20%. | Turn on roof sprinklers and foggers; add Vitamin C & electrolytes ($\text{KCl}, \text{NaHCO}_3$) to water. |
| **$\ge 82$** | 🔴 **Emergency** | High mortality from prostration & respiratory alkalosis. | Withdraw feed during hottest hours (11:00 AM - 04:00 PM); emergency notification sent to farmer. |

---

## 5. National Poultry Vaccination Protocol (India Standard)

Adheres strictly to the guidelines of the Department of Animal Husbandry and Dairying (DAHD) and ICAR-CARI:

| Age of Bird | Disease Prevented | Vaccine Strain | Route of Administration | Minimum Mandatory Withdrawal Period |
| :---: | :--- | :--- | :--- | :---: |
| **Day 1 (Hatchery)** | Marek's Disease | HVT (Herpesvirus of Turkeys) | Subcutaneous (0.2 ml neck) | 0 days |
| **Day 5 – 7** | Ranikhet / Newcastle (ND) | F-1 or LaSota Strain | Eye drop / Nasal drop (1 drop) | 0 days |
| **Day 12 – 14** | Infectious Bursal Disease (IBD) | Georgia / Intermediate Strain | Eye drop or oral drinking water | 0 days |
| **Day 21 – 24** | Ranikhet Booster | LaSota Strain | Drinking water (with skimmed milk powder stabilizer) | 0 days |
| **Day 28 – 30** | IBD Booster | Intermediate Plus Strain | Drinking water | 0 days |
| **Week 6 – 8** | Fowl Pox | Live attenuated fowl pox virus | Wing-web puncture (special dual-needle applicator) | 21 days |
| **Week 16 – 18 (Layers)**| Egg Drop Syndrome (EDS-76) | Inactivated oil adjuvant | Intramuscular (breast muscle) | 28 days |

---

## 6. Growth & Feed Mathematical Formulas

Implemented in `GrowthCalculationService.java` and `FeedingEngineService.java`:

### 6.1 Daily Weight Gain (DWG)
$$\text{DWG (g/day)} = \frac{\overline{W}_t - \overline{W}_0}{\Delta t \text{ (days)}}$$

### 6.2 Specific Growth Rate (SGR)
$$\text{SGR (\%/day)} = \frac{\ln(\overline{W}_t) - \ln(\overline{W}_0)}{\Delta t \text{ (days)}} \times 100$$

### 6.3 Feed Conversion Ratio (FCR)
$$\text{FCR} = \frac{\text{Total Cumulative Feed Ingested (kg)}}{\text{Total Biomass Gained (kg)}}$$

$$\text{Biomass Gained (kg)} = (\text{Current Stock} \times \overline{W}_t) - (\text{Initial Stock} \times \overline{W}_0)$$

### 6.4 10-Day Forward Feed Demand Model
$$\text{Daily Ration (kg)} = \text{Estimated Biomass (kg)} \times \text{Feeding Rate (\% of Body Weight)} \times K_{\text{temp}} \times K_{\text{DO}}$$

where:
- $K_{\text{temp}}$: Temperature correction coefficient:
  - If $T < 20^\circ\text{C} \implies K_{\text{temp}} = 0.60$
  - If $26^\circ\text{C} \le T \le 31^\circ\text{C} \implies K_{\text{temp}} = 1.00$
  - If $T > 34^\circ\text{C} \implies K_{\text{temp}} = 0.70$
- $K_{\text{DO}}$: Oxygen correction factor:
  - If $\text{DO} < 3.0\text{ mg/L} \implies K_{\text{DO}} = 0.00$ *(Complete feed suspension)*
  - If $3.0 \le \text{DO} < 5.0\text{ mg/L} \implies K_{\text{DO}} = 0.50$
  - If $\text{DO} \ge 5.0\text{ mg/L} \implies K_{\text{DO}} = 1.00$
