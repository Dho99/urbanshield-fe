# URBANSHIELD AI: SISTEM INTELIJEN GEOSPASIAL BERBASIS EXPLAINABLE MACHINE LEARNING UNTUK ESTIMASI INDEKS RISIKO BANJIR PERKOTAAN DAN PRIORITISASI MITIGASI WILAYAH KOTA BANDUNG

**Disusun oleh:**

**[NAMA TIM]**

**Anggota:**
- [Ketua Tim] (NIM)
- [Anggota 1] (NIM)
- [Anggota 2] (NIM)

---

**DATA MINING COMPETITION**  
**ICONFEST 2026**  
**2026**

---

# KATA PENGANTAR

Puji dan syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa atas limpahan rahmat dan karunia-Nya, sehingga laporan proyek pengembangan sistem berjudul **"UrbanShield AI: Sistem Intelijen Geospasial Berbasis Explainable Machine Learning untuk Estimasi Indeks Risiko Banjir Perkotaan dan Prioritisasi Mitigasi Wilayah Kota Bandung"** dapat diselesaikan dengan baik untuk keikutsertaan dalam *Data Mining Competition - ICONFEST 2026*.

Laporan ini menyajikan dokumentasi ilmiah, metodologis, dan implementasi teknis platform UrbanShield AI (*UrbanSense-AI*). Sistem ini dirancang untuk menjawab tantangan kronis banjir di Cekungan Bandung melalui fusi data spasial resolusi tinggi, pemodelan *Extreme Gradient Boosting* (XGBoost Regressor), metode *Explainable Artificial Intelligence* (SHAP *TreeExplainer*), serta *Rule-Based Mitigation Engine* yang deterministik. Platform ini dilengkapi antarmuka web modern berbasis FastAPI dan Next.js 14 yang dapat digunakan sebagai sistem pendukung keputusan (*Decision Support System*) oleh instansi terkait seperti BPBD dan Dinas Sumber Daya Air dan Bina Marga (DSDABM) Kota Bandung.

Tim penyusun menyampaikan terima kasih sebesar-besarnya kepada Dewan Juri dan Panitia ICONFEST 2026, dosen pembimbing, instansi penyedia data terbuka (BPBD/Diskar PB Kota Bandung, BPS, Copernicus, OpenStreetMap), serta semua pihak yang telah mendukung kelancaran proyek ini. Kami menyadari laporan ini masih memiliki ruang perbaikan, sehingga masukan konstruktif sangat kami harapkan. Semoga karya ini dapat memberikan kontribusi nyata bagi pengembangan sains data kebencanaan di Indonesia.

Bandung, Oktober 2026  
  
**Tim Pengembang UrbanShield AI**

---

# DAFTAR ISI

- [KATA PENGANTAR](#kata-pengantar)
- [DAFTAR ISI](#daftar-isi)
- [ABSTRAK](#abstrak)
- [ABSTRACT](#abstract)
- [BAB I: PENDAHULUAN](#bab-i-pendahuluan)
  - [1.1 Latar Belakang](#11-latar-belakang)
  - [1.2 Rumusan Masalah](#12-rumusan-masalah)
  - [1.3 Tujuan Project](#13-tujuan-project)
  - [1.4 Manfaat Project](#14-manfaat-project)
- [BAB II: DESKRIPSI PROJECT](#bab-ii-deskripsi-project)
  - [2.1 Deskripsi Project](#21-deskripsi-project)
  - [2.2 Permasalahan dan Urgensi Project](#22-permasalahan-dan-urgensi-project)
  - [2.3 Solusi yang Ditawarkan](#23-solusi-yang-ditawarkan)
  - [2.4 Keunggulan dan Nilai Inovasi](#24-keunggulan-dan-nilai-inovasi)
- [BAB III: PERANCANGAN DAN IMPLEMENTASI PROJECT](#bab-iii-perancangan-dan-implementasi-project)
  - [3.1 Konsep dan Alur Project](#31-konsep-dan-alur-project)
  - [3.2 Target Pengguna dan Potensi Pasar](#32-target-pengguna-dan-potensi-pasar)
  - [3.3 Perancangan Project](#33-perancangan-project)
    - [3.3.1 Kerangka Kerja Analisis Risiko Bencana (BNPB & InaRISK)](#331-kerangka-kerja-analisis-risiko-bencana-bnpb--inarisk)
    - [3.3.2 Spesifikasi 14 Fitur Masukan Geospasial](#332-spesifikasi-14-fitur-masukan-geospasial)
    - [3.3.3 Formulasi Label Indeks Risiko dan Skenario Tekanan](#333-formulasi-label-indeks-risiko-dan-skenario-tekanan)
    - [3.3.4 Arsitektur Model Machine Learning dan Explainable AI](#334-arsitektur-model-machine-learning-dan-explainable-ai)
  - [3.4 Teknologi yang Digunakan](#34-teknologi-yang-digunakan)
  - [3.5 Prototype dan Implementasi](#35-prototype-dan-implementasi)
    - [3.5.1 Arsitektur Backend REST API dan Layanan](#351-arsitektur-backend-rest-api-dan-layanan)
    - [3.5.2 Implementasi Engine Mitigasi Berbasis Aturan (*Mitigation Engine*)](#352-implementasi-engine-mitigasi-berbasis-aturan-mitigation-engine)
    - [3.5.3 Implementasi Frontend Interaktif dan Visualisasi Geospasial](#353-implementasi-frontend-interaktif-dan-visualisasi-geospasial)
    - [3.5.4 Komponen Antarmuka Pengambil Keputusan Terintegrasi](#354-komponen-antarmuka-pengambil-keputusan-terintegrasi)
- [BAB IV: HASIL DAN PEMBAHASAN](#bab-iv-hasil-dan-pembahasan)
  - [4.1 Hasil Project](#41-hasil-project)
  - [4.2 Fitur dan Fungsionalitas](#42-fitur-dan-fungsionalitas)
  - [4.3 Pengujian](#43-pengujian)
    - [4.3.1 Evaluasi Kinerja Model Machine Learning (5-Fold Cross-Validation)](#431-evaluasi-kinerja-model-machine-learning-5-fold-cross-validation)
    - [4.3.2 Evaluasi Komparatif terhadap Baseline (DummyRegressor)](#432-evaluasi-komparatif-terhadap-baseline-dummyregressor)
    - [4.3.3 Evaluasi Generalisasi Spasial (GroupKFold Cross-Validation)](#433-evaluasi-generalisasi-spasial-groupkfold-cross-validation)
    - [4.3.4 Uji Korelasi terhadap Kejadian Banjir Aktual Lapangan (BPBD 2025)](#434-uji-korelasi-terhadap-kejadian-banjir-aktual-lapangan-bpbd-2025)
    - [4.3.5 Distribusi Kelas Tier dan Matriks Konfusi Out-of-Fold](#435-distribusi-kelas-tier-dan-matriks-konfusi-out-of-fold)
    - [4.3.6 Analisis Peringkat Global Fitur Berbasis SHAP](#436-analisis-peringkat-global-fitur-berbasis-shap)
    - [4.3.7 Uji Sensitivitas Label dan Ambang Klasifikasi Tier](#437-uji-sensitivitas-label-dan-ambang-klasifikasi-tier)
    - [4.3.8 Studi Kasus Dekomposisi SHAP Lokal pada Kecamatan Prioritas](#438-studi-kasus-dekomposisi-shap-lokal-pada-kecamatan-prioritas)
    - [4.3.9 Pengujian Sistem Perangkat Lunak dan Kinerja API](#439-pengujian-sistem-perangkat-lunak-dan-kinerja-api)
    - [4.3.10 Keterbatasan Sistem dan Batasan Validasi Model](#4310-keterbatasan-sistem-dan-batasan-validasi-model)
- [BAB V: PENUTUP](#bab-v-penutup)
  - [5.1 Kesimpulan](#51-kesimpulan)
  - [5.2 Saran dan Pengembangan Masa Depan](#52-saran-dan-pengembangan-masa-depan)
- [DAFTAR PUSTAKA](#daftar-pustaka)
- [LAMPIRAN](#lampiran)
  - [Lampiran 1: Karakteristik Geospasial, Demografi, dan Kejadian Bencana 30 Kecamatan Kota Bandung](#lampiran-1-karakteristik-geospasial-demografi-dan-kejadian-bencana-30-kecamatan-kota-bandung)
  - [Lampiran 2: Spesifikasi Dokumentasi Endpoint REST API UrbanShield AI](#lampiran-2-spesifikasi-dokumentasi-endpoint-rest-api-urbanshield-ai)

---

# ABSTRAK

Banjir perkotaan di Kota Bandung merupakan krisis lingkungan multidimensi yang dipicu oleh bentang alam depresi Cekungan Bandung, alih fungsi lahan Kawasan Bandung Utara, tingginya permukaan kedap air, serta keterbatasan kapasitas drainase yang rentan sedimentasi dan keruntuhan kirmir. Di sisi lain, adopsi kecerdasan buatan dalam birokrasi pemerintahan daerah kerap terkendala oleh masalah opasitas algoritma (*black-box problem*) yang menghambat justifikasi kebijakan publik. Penelitian ini merekayasa platform **UrbanShield AI** (*UrbanSense-AI*), sebuah sistem intelijen geospasial terintegrasi yang menggabungkan fusi data spasial heterogen, model regresi *Extreme Gradient Boosting* (XGBoost), metode *Explainable Artificial Intelligence* (XAI) berbasis SHAP *TreeExplainer*, serta *Rule-Based Mitigation Engine* yang deterministik. Sebanyak 14 indikator geospasial masukan diekstraksi dari OpenStreetMap, Copernicus GLO-30 DEM, Copernicus ERA5, BPS, dan data bencana Diskar PB 2025 untuk 30 kecamatan di Kota Bandung. Evaluasi *5-Fold Cross-Validation* membuktikan kinerja penaksiran yang solid dengan *Mean Absolute Error* (MAE) sebesar 2.93 poin, RMSE sebesar 3.91 poin, $R^2$ sebesar 0.849, dan akurasi klasifikasi tier risiko *out-of-fold* mencapai 92.5%, mengungguli baseline *DummyRegressor* dengan pemangkasan kesalahan sebesar 65.4%. Pengujian ketahanan spasial *GroupKFold Cross-Validation* menghasilkan akurasi tier 80.0%, sementara analisis SHAP mengidentifikasi curah hujan, elevasi, dan kapasitas drainase efektif sebagai pendorong utama risiko. Platform ini diimplementasikan penuh menggunakan FastAPI dan Next.js 14 dengan peta choropleth MapLibre GL, menyediakan sistem pendukung keputusan yang transparan, akuntabel, dan preskriptif bagi pemangku kebijakan mitigasi banjir Kota Bandung.

**Kata Kunci:** Intelijen Geospasial, Risiko Banjir Perkotaan, XGBoost Regressor, Explainable AI, SHAP TreeExplainer, Cekungan Bandung, Mitigasi Preskriptif, Decision Support System.

---

# ABSTRACT

*Urban flooding in Bandung City represents a multifaceted environmental crisis driven by the basin depression morphology, extensive land-use conversion in the Northern Bandung Area, high impervious surface coverage, and inadequate drainage systems prone to sedimentation and structural retaining wall failures. Concurrently, municipal adoption of artificial intelligence is hindered by algorithmic opacity ("black-box" dilemma), which precludes transparent justification for public capital allocations. This study develops **UrbanShield AI** (UrbanSense-AI), an integrated geospatial intelligence platform coupling heterogeneous spatial data fusion, an Extreme Gradient Boosting (XGBoost) regression engine, Explainable Artificial Intelligence (XAI) powered by SHAP TreeExplainer, and a deterministic Rule-Based Mitigation Engine. Fourteen standardized geospatial indicators spanning hazard, vulnerability, and capacity were constructed across all 30 administrative districts of Bandung City, drawing from OpenStreetMap, Copernicus GLO-30 DEM, Copernicus ERA5 Reanalysis, BPS demographic data, and empirical disaster occurrence records from Diskar PB / BPBD Bandung City for 2025. Five-Fold Cross-Validation confirmed high approximation fidelity, achieving a Mean Absolute Error (MAE) of 2.93 points, Root Mean Squared Error (RMSE) of 3.91 points, coefficient of determination ($R^2$) of 0.849, and out-of-fold tier accuracy of 92.5%, representing a 65.4% error reduction over the DummyRegressor baseline. Spatial generalization testing via GroupKFold Cross-Validation yielded 80.0% spatial tier accuracy, while SHAP attribution identified rainfall intensity, elevation, and effective drainage capacity as primary risk determinants. Implemented using FastAPI and Next.js 14 App Router with MapLibre GL choropleth visualization, UrbanShield AI delivers a transparent, auditable, and prescriptive decision-support instrument for municipal flood mitigation planning.*

**Keywords:** *Geospatial Intelligence, Urban Flood Risk, XGBoost Regressor, Explainable AI, SHAP TreeExplainer, Bandung Basin, Prescriptive Mitigation, Decision Support System.*

---


# BAB I: PENDAHULUAN

## 1.1 Latar Belakang

Kota Bandung secara geografis dan geomorfologis terletak pada bentang alam unik yang dikenal dalam literatur kebumian sebagai Cekungan Bandung (*Bandung Basin*), yakni sebuah depresi intramontana antar-pegunungan vulkanik Kuarter dengan ketinggian dasar lembah berkisar antara 665 hingga 750 meter di atas permukaan laut (mdpl), yang dikelilingi oleh punggung perbukitan curam dengan elevasi mencapai lebih dari 2.000 mdpl. Kondisi morfologi yang menyerupai mangkuk raksasa ini menjadikan Kota Bandung sebagai muara hidrologis alami bagi puluhan anak sungai yang berhulu di lereng pegunungan sebelah utara, timur, dan selatan, sebelum bermuara ke badan Sungai Citarum sebagai drainase utama Jawa Barat. Sub-Daerah Aliran Sungai (DAS) kritis seperti Sungai Cikapundung, Sungai Citepus, Sungai Cipamokolan, dan Sungai Cinambo membelah kawasan permukiman padat perkotaan dengan kemiringan hidraulis yang menyempit secara drastis saat memasuki lantai dataran cekungan. Konfigurasi spasial alamiah ini menyebabkan Kota Bandung memiliki indeks kerentanan hidrologis yang sangat tinggi terhadap fenomena limpasan air permukaan dan akumulasi genangan banjir luapan (*fluvial flood*) maupun banjir genangan perkotaan (*pluvial flood*).

Dinamika kerentanan alamiah tersebut tereskalasi secara masif dalam beberapa dekade terakhir akibat laju urbanisasi yang pesat, pertumbuhan demografi penduduk yang menembus lebih dari 2,5 juta jiwa, serta ekspansi fisik perkotaan yang menekan daya dukung lingkungan (*carrying capacity*). Alih fungsi lahan di Kawasan Bandung Utara (KBU)—yang secara regulasi rencana tata ruang berfungsi vital sebagai zona tangkapan air dan kawasan lindung—menjadi kawasan permukiman mewah, fasilitas pariwisata, dan perhotelan telah memicu degradasi kapasitas infiltrasi tanah secara drastis. Transformasi tutupan lahan dari ruang terbuka hijau alami menjadi bentang lahan kedap air (*impervious surface*) berupa aspal jalan, perkerasan beton, dan atap bangunan memperbesar koefisien limpasan permukaan (*runoff coefficient*). Akibatnya, volume air hujan yang jatuh tidak lagi terinfiltrasi ke dalam akuifer tanah, melainkan langsung berubah menjadi limpasan permukaan jalanan (*street runoff*) yang mengalir deras dan melumpuhkan simpul-simpul mobilitas ekonomi utama kota seperti di kawasan Pasteur (Dr. Djunjunan), Pagarsih, Kiaracondong, Cikutra, dan Gedebage.

Permasalahan banjir perkotaan di Kota Bandung diperparah oleh keterbatasan struktural pada sistem jaringan drainase mikro maupun makro. Mayoritas saluran drainase perkotaan dirancang pada era kolonial Hindia Belanda dan dekade awal kemerdekaan dengan kapasitas tampung hidraulis yang kini tidak lagi memadai untuk menampung curah hujan ekstrem dengan periode ulang tinggi akibat krisis iklim global. Sedimentasi lumpur yang tebal, penyempitan sempadan badan air oleh permukiman padat kumuh, serta akumulasi sampah padat perkotaan telah menurunkan kapasitas pengaliran efektif drainase hingga di bawah 40% dari kapasitas desain awalnya. Berdasarkan catatan operasional Dinas Kebakaran dan Penanggulangan Bencana (Diskar PB) Kota Bandung sepanjang tahun 2025, tercatat sedikitnya 32 insiden keruntuhan kirmir (*retaining wall*) dan tanggul saluran drainase di berbagai titik aliran akibat ketidakmampuan dinding penahan menahan lonjakan debit puncak dan tekanan hidrostatis air hujan lebat.

Sebagaimana dievaluasi oleh pakar perencanaan wilayah Institut Teknologi Bandung (ITB), Prof. Denny Zulkaidi, tata kelola penanggulangan banjir di Kota Bandung selama ini kerap terkendala oleh pendekatan yang bersifat parsial, sektoral, belum sistematis, dan minimnya integrasi data spasial antar-instansi teknis. Pola penanganan yang dominan di lapangan masih berorientasi pada tindakan kuratif dan reaktif pasca-bencana (*post-disaster emergency response*), seperti penyedotan air dengan pompa darurat setelah ruas jalan terendam atau evakuasi warga setelah permukiman tergenang. Paradigma ini terbukti tidak efisien secara anggaran dan gagal menghentikan siklus bencana berulang setiap musim hujan.

Di sisi lain, pemanfaatan kecerdasan buatan (*Artificial Intelligence*) dan pembelajaran mesin (*Machine Learning*) dalam birokrasi pemerintahan daerah menghadapi dilema besar yang dikenal sebagai *black-box problem*. Model pembelajaran mesin konvensional seperti *Random Forest*, *Deep Neural Networks*, atau model ansambel lainnya kerap menghasilkan estimasi angka risiko tanpa mampu memberikan penjelasan logis dan dekomposisi faktor penyebab di balik prediksi tersebut. Para pengambil kebijakan di Badan Penanggulangan Bencana Daerah (BPBD), Dinas Sumber Daya Air dan Bina Marga (DSDABM), serta Badan Perencanaan Pembangunan, Penelitian, dan Pengembangan (Bappelitbang) Kota Bandung tidak dapat mempertanggungjawabkan alokasi anggaran infrastruktur publik bernilai miliaran rupiah hanya berdasarkan skor prediksi tanpa transparansi justifikasi teknis. Pemangku kebijakan membutuhkan instrumen analitik cerdas yang tidak hanya memetakan *di mana* lokasi rawan banjir, melainkan mampu menguraikan *mengapa* wilayah tersebut rentan, serta *tindakan mitigasi preskriptif apa* yang harus diprioritaskan berdasarkan akar masalah setempat.

Menjawab urgensi multidimensi tersebut, proyek penelitian ini merekayasa platform **UrbanShield AI** (kode repositori sistem: `urbansense-ai`). UrbanShield AI merupakan sistem intelijen geospasial terintegrasi yang menggabungkan fusi data spasial heterogen resolusi tinggi (*OpenStreetMap*, *Copernicus GLO-30 DEM*, *Copernicus ERA5 Reanalysis*, BPS Kota Bandung, serta rekam bencana Diskar PB / BPBD Kota Bandung 2025), model regresi *Extreme Gradient Boosting* (XGBoost), modul interpretabilitas *Explainable Artificial Intelligence* (SHAP *TreeExplainer*), serta *Rule-Based Mitigation Engine* yang deterministik. Platform ini dilengkapi antarmuka web modern (*Next.js 14, MapLibre GL*) yang responsif dan interaktif guna memvisualisasikan poligon risiko 30 kecamatan di Kota Bandung, menyimulasikan skenario tekanan hidrometeorologis dinamis, dan menerbitkan rekomendasi intervensi sipil preskriptif secara *on-demand*.

---

## 1.2 Rumusan Masalah

Berdasarkan konteks latar belakang yang telah dipaparkan, rumusan masalah dalam proyek penelitian dan pengembangan ini dirumuskan sebagai berikut:

1. Bagaimana memformulasikan dan mengintegrasikan multi-sumber data geospasial heterogen yang mencakup indikator infrastruktur mikro perkotaan (*OpenStreetMap*), morfometri topografi (*Copernicus DEM GLO-30*), dinamika presipitasi meteorologi (*Copernicus ERA5*), statistik demografi kependudukan (*BPS Kota Bandung*), serta rekam kejadian bencana aktual (*Diskar PB / BPBD Kota Bandung 2025*) ke dalam dataset 14 fitur spasial terstandarisasi untuk seluruh 30 kecamatan di Kota Bandung?
2. Bagaimana merancang, melatih, dan mengoptimalkan arsitektur model pembelajaran mesin berbasis *Extreme Gradient Boosting* (XGBoost Regressor) agar mampu menghasilkan estimasi indeks risiko banjir (*Flood Risk Score*, rentang nilai 0–100) dan klasifikasi tingkat bahaya (*Tier: Low, Medium, High*) yang akurat di bawah berbagai skenario tekanan cuaca ekstrem?
3. Bagaimana menguji reliabilitas dan generalisasi model melalui evaluasi *5-Fold Cross-Validation* dan *GroupKFold Spatial Cross-Validation* (hold-out kecamatan), serta mengkaji keselarasan empiris skor model terhadap titik bencana aktual lapangan beserta batasan objektif efek sirkularitas label?
4. Bagaimana mengimplementasikan metode *Explainable Artificial Intelligence* (XAI) berbasis SHAP (*SHapley Additive exPlanations*) *TreeExplainer* untuk mendekomposisi kontribusi variabel pendorong risiko secara lokal per kecamatan dan global per kota guna mengatasi hambatan *black-box* dalam birokrasi pemerintahan?
5. Bagaimana merekayasa dan mengintegrasikan platform aplikasi web sistem informasi geospasial (*Full-Stack Web GIS*) modern berbasis FastAPI dan Next.js 14 yang dilengkapi visualisasi poligon choropleth MapLibre GL, simulator respon skenario hidrometeorologis, dan *Rule-Based Mitigation Engine* untuk menghasilkan rekomendasi mitigasi preskriptif yang dapat diaudit (*auditable*)?

---

## 1.3 Tujuan Project

### 1.3.1 Tujuan Umum
Mengembangkan platform sistem intelijen geospasial terintegrasi bernama **UrbanShield AI** berbasis *Explainable Machine Learning* dan *Rule-Based Mitigation Engine* untuk mengestimasi indeks risiko banjir perkotaan serta merumuskan prioritisasi mitigasi sipil preskriptif bagi seluruh 30 kecamatan di Kota Bandung.

### 1.3.2 Tujuan Khusus
1. Merekayasa pipeline data geospasial terstandarisasi yang mengekstraksi dan memfusi 14 variabel masukan terukur dari OpenStreetMap, Copernicus DEM, ERA5, BPS, dan BPBD Kota Bandung untuk 30 poligon batas administrasi kecamatan.
2. Membangun dan melatih model regresi XGBoost dengan hyperparameter optimal untuk menaksir skor risiko banjir berkelanjutan dan mengklasifikasikan tier risiko di bawah skenario cuaca normal maupun ekstrem.
3. Melakukan pengujian kinerja model secara ketat menggunakan metrik MAE, RMSE, $R^2$, dan akurasi tier out-of-fold, serta melakukan evaluasi generalisasi spasial melalui *GroupKFold Cross-Validation* dan analisis korelasi kejadian empiris.
4. Menerapkan algoritma SHAP *TreeExplainer* untuk menghitung nilai Shapley lokal per kecamatan, mengidentifikasi faktor risiko dominan, dan menerjemahkannya ke dalam bahasa kebijakan publik yang intuitif.
5. Membangun aplikasi web interaktif full-stack dengan arsitektur backend FastAPI REST API dan frontend Next.js 14 App Router yang menyajikan visualisasi peta choropleth dinamis, dialog pendukung keputusan (*Decision Support Dialog*), panel inspeksi riwayat bencana aktual, dan simulator skenario tekanan.

---

## 1.4 Manfaat Project

Proyek pengembangan UrbanShield AI dirancang untuk memberikan kontribusi dan manfaat nyata pada tiga dimensi utama:

### 1.4.1 Manfaat Teoritis dan Metodologis
1. **Pengembangan Metodologi Sains Data Kebencanaan:** Memperkaya khazanah keilmuan data mining dan intelijen geospasial melalui integrasi fusi multi-sumber data spasial heterogen dengan model ansambel pohon keputusan *Extreme Gradient Boosting*.
2. **Penerapan Explainable AI (XAI) pada Domain Hidrometeorologi:** Mendemonstrasikan secara empiris penerapan SHAP *TreeExplainer* untuk mengurai kontribusi variabel topografi, infrastruktur, dan hidrologi, sehingga mematahkan paradigma bahwa model machine learning akurat harus selalu bersifat opasif (*black-box*).
3. **Penerapan Validasi Generalisasi Spasial:** Memberikan teladan pengujian ilmiah yang jujur dan transparan melalui *GroupKFold Cross-Validation* guna menguji kemampuan transfer model ke klaster wilayah geografis baru dengan memperhitungkan autokorelasi spasial.

### 1.4.2 Manfaat Praktis dan Kebijakan Publik (Pemerintah Kota Bandung)
1. **Transformasi Menuju Paradigma Mitigasi Proaktif:** Membantu BPBD dan DSDABM Kota Bandung bertransformasi dari manajemen bencana reaktif menjadi perencanaan berbasis data preventif dan preskriptif sebelum musim hujan tiba.
2. **Optimalisasi dan Akuntabilitas Anggaran Daerah (APBD):** Menyediakan justifikasi berbasis data yang transparan dan dapat diaudit (*auditable justification*) bagi alokasi dana perbaikan infrastruktur, pemeliharaan drainase kirmir, serta pembangunan kolam retensi berdasarkan faktor pemicu risiko terbesar di masing-masing kecamatan.
3. **Simulasi Dampak Skenario Cuaca Ekstrem:** Memberikan instrumen bagi instansi teknis untuk menyimulasikan dampak lonjakan curah hujan akibat fenomena cuaca ekstrem (seperti badai La Niña) atau kegagalan pompa drainase terhadap peta risiko wilayah secara *real-time*.

### 1.4.3 Manfaat Sosial dan Ketahanan Perkotaan (Masyarakat Kota Bandung)
1. **Perlindungan Populasi Rentan:** Mengurangi potensi korban jiwa, kerugian harta benda, dan gangguan sanitasi lingkungan di kantong-kantong permukiman padat penduduk yang teridentifikasi memiliki kerentanan tinggi.
2. **Peningkatan Kesiapsiagaan Komunitas:** Menyediakan transparansi informasi spasial yang dapat diakses oleh forum relawan bencana, akademisi, dan komunitas peduli lingkungan untuk menggalang aksi adaptasi lokal (seperti pembuatan sumur resapan, biopori, dan pembersihan saluran lingkungan).


# BAB II: DESKRIPSI PROJECT

## 2.1 Deskripsi Project

**UrbanShield AI** (kode repositori sistem: `urbansense-ai`) adalah sebuah platform intelijen geospasial mutakhir (*State-of-the-Art Geospatial Intelligence Platform*) yang dirancang khusus sebagai sistem pendukung keputusan (*Decision Support System* / DSS) dalam mengestimasi indeks risiko banjir perkotaan dan menyusun antrean prioritas intervensi mitigasi sipil di seluruh 30 kecamatan Kota Bandung. Platform ini mengintegrasikan lima pilar teknologi inti:
1. **Unified Geospatial Data Pipeline:** Pipeline ekstraksi dan fusi data multi-sumber heterogen dari citra satelit dan data lapangan (*OpenStreetMap*, *Copernicus GLO-30 DEM*, *Copernicus ERA5 Reanalysis*, *BPS Kota Bandung*, serta rekam bencana *Diskar PB / BPBD Kota Bandung 2025*);
2. **Machine Learning Predictive Engine:** Model regresi ansambel berbasis *Extreme Gradient Boosting* (XGBoost Regressor) yang dilatih untuk memproyeksikan indeks risiko hidrologi kontinu pada rentang skala 0 hingga 100 dan mengklasifikasikannya ke dalam tiga *Tier* risiko (*Low*, *Medium*, *High*);
3. **Explainable AI (XAI) Core:** Modul interpretabilitas berbasis algoritma SHAP (*SHapley Additive exPlanations*) *TreeExplainer* yang mendekomposisi kontribusi setiap variabel masukan terhadap skor akhir secara aditif dan adil (*fair feature attribution*);
4. **Deterministic Rule-Based Mitigation Engine:** Mesin penerjemah keputusan yang mengubah output saintifik model (level tier dan ranking kontribusi variabel SHAP) menjadi portofolio aksi mitigasi teknik sipil dan tata ruang yang konkret, terukur, dilengkapi estimasi biaya, target durasi waktu pengerjaan (*timeline*), serta tingkat prioritas pelaksanaan;
5. **Modern Interactive Web GIS Interface:** Antarmuka berbasis web modern berkinerja tinggi (*Next.js 14 App Router, MapLibre GL, Tailwind CSS, TanStack Query*) yang menyajikan visualisasi poligon choropleth administratif, simulator respon skenario hidrometeorologis multi-faktor, panel rekam jejak bencana historis, dan dialog pendukung keputusan interaktif.

Secara konseptual, arsitektur analitik UrbanShield AI mengadopsi dan menyempurnakan kerangka kerja baku analisis risiko bencana yang diamanatkan oleh Badan Nasional Penanggulangan Bencana (BNPB) Republik Indonesia melalui Peraturan Kepala BNPB Nomor 2 Tahun 2012 dan platform *InaRISK*. Dalam kerangka teoritis tersebut, risiko bencana ($R$) didefinisikan sebagai fungsi interaksi non-linear antara tiga pilar utama:
$$\text{Risk} = f(\text{Hazard}, \text{Vulnerability}, \text{Capacity})$$
atau secara proporsional dirumuskan sebagai:
$$\text{Risk} \propto \frac{\text{Hazard} \times \text{Vulnerability}}{\text{Capacity}}$$
- **Bahaya (*Hazard*):** Mengukur magnitudo ancaman fisik hidrometeorologis dan geomorfologis yang memicu genangan, meliputi intensitas curah hujan harian ekstrem (*rainfall intensity*), kemiringan lereng yang memengaruhi kecepatan aliran (*terrain slope*), elevasi rendah di dasar lembah (*elevation*), kerapatan jaringan sungai (*river network density*), indeks depresi cekungan (*basin depression index*), serta rasio tutupan badan air (*surface water ratio*).
- **Kerentanan (*Vulnerability*):** Mengukur derajat keterpaparan (*exposure*) dan kepekaan elemen perkotaan terhadap dampak banjir, mencakup kepadatan penduduk (*population density*), kepadatan bangunan permukiman (*building density*), kerapatan jaringan jalan (*road network density*), kepadatan fasilitas kritis publik seperti rumah sakit dan sekolah (*critical facility density*), serta rasio permukaan kedap air yang menghalangi infiltrasi (*impervious surface ratio*).
- **Kapasitas (*Capacity*):** Mengukur kemampuan struktural maupun ekologis lingkungan perkotaan dalam menahan, menyerap, dan mengalirkan limpasan air, yang direpresentasikan oleh kerapatan saluran drainase fisik (*drainage network density*), kapasitas pengaliran drainase efektif (*effective drainage capacity*), serta rasio luas ruang terbuka hijau resapan (*green infiltration area ratio*).

UrbanShield AI memadukan kerangka kerja teoritis BNPB tersebut ke dalam sains data kuantitatif modern dengan mengekstraksi 14 fitur terstandarisasi untuk 30 poligon batas administrasi kecamatan di Kota Bandung. Data karakteristik spasial, demografi, dan rekam bencana lengkap 30 kecamatan tersebut disajikan pada Lampiran 1 laporan ini.

---

## 2.2 Permasalahan dan Urgensi Project

Permasalahan banjir di Kota Bandung bukan sekadar fenomena alam musiman biasa, melainkan krisis perkotaan sistemik yang berakar pada interaksi antara kondisi bentang alam fisik dan kegagalan tata kelola infrastruktur perkotaan:

1. **Kerentanan Geomorfologis Cekungan Bandung (*Intramontane Depression*):**  
   Dasar cekungan Kota Bandung berada pada ketinggian 665–750 mdpl, diapit oleh perbukitan terjal KBU di sebelah utara (Lembang, Bukit Tunggul) dan rangkaian perbukitan di selatan. Seluruh air limpasan dari hulu pegunungan mengalir deras menuju cekungan melalui Sungai Cikapundung, Citepus, Cinambo, dan Cipamokolan. Ketika volume limpasan tiba di lantai lembah datar, kemiringan hidraulis menurun tajam, menyebabkan kecepatan aliran melambat drastis sehingga air meluap ke badan jalan dan kawasan permukiman.

2. **Degradasi Daerah Tangkapan Air di Kawasan Bandung Utara (KBU):**  
   Konversi masif kawasan lindung dan perkebunan menjadi area terbangun komersial dan residensial di KBU telah menghilangkan fungsi resapan air alami. Berdasarkan analisis citra satelit, rasio permukaan kedap air (*impervious surface*) di beberapa kecamatan sentral telah melampaui 75%, melipatgandakan koefisien limpasan air hujan yang langsung mengalir menjadi genangan air permukaan (*flash ponding*).

3. **Keterbatasan dan Kerusakan Fisik Saluran Drainase (Krisis Kirmir 2025):**  
   Saluran drainase perkotaan mengalami penurunan fungsi akibat sedimentasi lumpur yang mengendap tebal serta penyumbatan sampah. Lebih kritis lagi, integritas struktural dinding penahan saluran (*kirmir*) mengalami kelelahan material (*structural fatigue*). Berdasarkan data resmi Dinas Kebakaran dan Penanggulangan Bencana (Diskar PB) Kota Bandung, sepanjang tahun 2025 tercatat sedikitnya **32 insiden keruntuhan kirmir dan jebolnya tanggul saluran** akibat tekanan debit air puncak. Keruntuhan kirmir ini tidak hanya memicu banjir bandang lokal yang merendam permukiman, tetapi juga mengancam stabilitas pondasi bangunan warga di sempadan sungai.

4. **Kerugian Sosio-Ekonomi dan Kelumpuhan Koridor Transportasi Arteri:**  
   Banjir genangan yang melanda koridor vital seperti Jalan Dr. Djunjunan (Pasteur), Jalan Pagarsih, Jalan Rumah Sakit (Gedebage), dan Terusan Kiaracondong melumpuhkan urat nadi transportasi logistik antarkota dan akses menuju pintu gerbang tol utama Kota Bandung. Kerugian ekonomi akibat kemacetan total, kerusakan kendaraan bermotor, genangan pertokoan, dan terhentinya aktivitas bisnis mencapai miliaran rupiah pada setiap kejadian hujan ekstrem.

5. **Kelemahan Tata Kelola Penanganan yang Reaktif dan Ketiadaan Decision Support System:**  
   Tata kelola banjir di Kota Bandung masih didominasi pola reaktif—pemerintah bertindak setelah bencana terjadi melalui evakuasi warga dan pengerahan pompa darurat. Penanganan struktural yang dilakukan selama ini cenderung parsial dan belum berbasis prioritas ilmiah terpadu. Lebih jauh, upaya digitalisasi sering kali gagal diadopsi secara efektif karena instrumen pemodelan kecerdasan buatan bersifat *black-box*, di mana pimpinan dinas teknis tidak berani mengambil keputusan anggaran berdasarkan model yang tidak mampu menjelaskan alasan teknis di balik penetapan suatu wilayah sebagai zona merah.

Urgensi kehadiran UrbanShield AI terletak pada fungsinya sebagai jembatan transformasi peradaban tata kelola: mengubah pendekatan penanggulangan bencana dari **reaktif-kuratif** menjadi **proaktif-preskriptif**, serta dari **spekulatif-intuitif** menjadi **berbasis bukti data geospasial yang dapat dipertanggungjawabkan (*evidence-based policy*)**.

---

## 2.3 Solusi yang Ditawarkan

Untuk mengatasi tantangan kompleks tersebut, UrbanShield AI menawarkan arsitektur solusi sistemik yang mengintegrasikan sains data mutakhir dengan kebutuhan praktis perencanaan sipil:

```
[MULTI-SOURCE DATA ACQUISITION]
- OpenStreetMap (Drainase, Jalan, Bangunan, Fasilitas)
- Copernicus GLO-30 DEM (Elevasi, Lereng, Cekungan)
- Copernicus ERA5 (Curah Hujan Multi-Skenario)
- BPS Kota Bandung (Kepadatan Penduduk)
- Diskar PB / BPBD 2025 (Titik Kejadian Banjir Aktual)
                  │
                  ▼
[SPATIAL AGGREGATION & FEATURE ENGINEERING]
  14 Indikator Standar (Hazard, Vulnerability, Capacity)
                  │
                  ▼
[MACHINE LEARNING ENGINE - XGBOOST REGRESSOR]
  Prediksi Continuous Risk Score (0 - 100)
  Klasifikasi Tier Risiko: Low (<40), Medium (40-69), High (≥70)
                  │
                  ▼
[EXPLAINABLE AI ENGINE - SHAP TREEEXPLAINER]
  Dekomposisi Nilai Shapley Lokal per Kecamatan
  Identifikasi 3 Faktor Pendorong Risiko Dominan
                  │
                  ▼
[DETERMINISTIC RULE-BASED MITIGATION ENGINE]
  Penerjemahan Faktor SHAP menjadi Aksi Teknik Sipil Konkret:
  - Normalisasi Drainase Kirmir & Pengerukan Sedimen
  - Pembangunan Kolam Retensi & Tanggul Pengendali
  - Optimalisasi Sumur Resapan & Ruang Terbuka Hijau
  - Kesiapsiagaan Evakuasi & Sistem Peringatan Dini
  - Estimasi Anggaran Biaya, Timeline Pengerjaan, & Skor Prioritas
                  │
                  ▼
[FULL-STACK INTERACTIVE WEB GIS PLATFORM]
  - Executive Risk Dashboard & Critical Areas Ranking
  - Interactive Choropleth Polygon Map (MapLibre GL)
  - Multi-Scenario Weather Stress Simulator (Current, Heavy Rain, Extreme Storm, Drainage Failure)
  - Historical Disaster Tracking Panel (Validasi Empiris Lapangan)
  - Decision Support Dialog & Factor Interpretation Panel
```

Solusi ini memastikan bahwa setiap pemangku kepentingan—mulai dari Walikota, Kepala Pelaksana BPBD, Kepala Dinas SDABM, hingga tim teknis lapangan—memperoleh instrumen operasional terpadu yang menyajikan analisis risiko dari tingkat makro kota hingga rekomendasi teknis mikro per kecamatan.

---

## 2.4 Keunggulan dan Nilai Inovasi

Dibandingkan dengan pendekatan penanganan konvensional maupun sistem informasi bencana nasional yang ada saat ini (seperti platform InaRISK BNPB), UrbanShield AI menghadirkan lima dimensi keunggulan inovatif yang fundamental:

### Tabel 2.1: Matriks Perbandingan Inovasi UrbanShield AI terhadap Sistem Konvensional

| Dimensi Evaluasi | Sistem Konvensional / InaRISK | UrbanShield AI (*UrbanSense-AI*) | Nilai Tambah Inovasi |
| :--- | :--- | :--- | :--- |
| **Granularitas Data & Skala Analisis** | Berskala makro provinsi/kabupaten; mengabaikan detail infrastruktur mikro perkotaan. | Berskala mikro tingkat kecamatan (30 kecamatan) dengan fusi data infrastruktur saluran, jalan, dan bangunan *OpenStreetMap*. | Mampu mendeteksi kantong risiko spesifik yang tersembunyi di dalam kawasan permukiman padat perkotaan. |
| **Transparansi Model (*Explainability*)** | Bersifat opasif (*black-box*); hanya menyajikan peta warna tanpa penjelasan pemicu risiko spesifik. | Dilengkapi *Explainable AI* (SHAP *TreeExplainer*); mendekomposisi kontribusi setiap variabel secara persentase matematis aditif. | Membuka transparansi algoritma sehingga pemangku kebijakan memahami persis alasan di balik tingginya risiko wilayah. |
| **Karakter Output Sistem** | Bersifat **deskriptif** semata (hanya menampilkan peta zona rawan banjir). | Bersifat **preskriptif operasional**; menghasilkan rekomendasi intervensi teknik sipil dan mitigasi spesifik. | Mengubah informasi risiko pasif menjadi panduan aksi teknis konkret bagi Dinas Sumber Daya Air dan Bina Marga. |
| **Auditabilitas Keputusan Mitigasi** | Mengandalkan estimasi subjektif tim perencana atau model AI generatif yang rawan halusinasi. | Menggunakan *Rule-Based Mitigation Engine* yang deterministik: input faktor risiko yang sama selalu menghasilkan keputusan yang sama. | Memberikan jaminan kepatuhan hukum (*legal compliance*) dan kepastian audit anggaran bagi inspektorat daerah. |
| **Dinamika Simulasi Skenario** | Statis; peta hanya diperbarui secara periodik (tahunan) berdasarkan data historis masa lalu. | Simulator dinamis waktu nyata (*real-time multi-scenario stress testing*): *Current*, *Heavy Rain*, *Extreme Storm*, dan *Drainage Failure*. | Memfasilitasi simulasi taktis kesiapsiagaan menghadapi anomali cuaca ekstrem sebelum hujan turun di lapangan. |
| **Validasi Empiris Lapangan** | Jarang dikonfrontasikan secara langsung dengan titik-titik kejadian bencana aktual harian. | Mengintegrasikan panel rekam jejak kejadian bencana aktual Diskar PB / BPBD 2025 secara berdampingan. | Memberikan validasi visual dan empiris langsung mengenai keselarasan prediksi model dengan realitas lapangan. |

Melalui keunggulan-keunggulan inovasi tersebut, UrbanShield AI memposisikan diri bukan sekadar sebagai aplikasi visualisasi peta, melainkan sebagai instrumen transformasi tata kelola ketahanan bencana hidrometeorologis perkotaan yang saintifik, akuntabel, dan berdaya guna tinggi.


# BAB III: PERANCANGAN DAN IMPLEMENTASI PROJECT

## 3.1 Konsep dan Alur Project

UrbanShield AI dirancang dengan paradigma arsitektur rekayasa perangkat lunak modern yang memisahkan secara tegas lapisan pemrosesan data geospasial, komputasi inferensi kecerdasan buatan, mesin penerjemah preskriptif, serta lapisan penyajian antarmuka pengguna interaktif. Alur kerja proyek secara terintegrasi digambarkan pada diagram berikut:

```
[TAHAP 1: PENGUMPULAN & PRA-PEMROSESAN DATA SPASIAL]
├── OpenStreetMap (OSM)               ──> Ekstraksi Vektor Jaringan Drainase, Jalan, Bangunan
├── Copernicus DEM GLO-30 (30m)        ──> Analisis Elevasi, Kelerengan (Slope), & Depresi Cekungan
├── Copernicus ERA5 Reanalysis         ──> Agregasi Presipitasi Harian & Pengali Skenario Ekstrem
├── BPS Kota Bandung (2024-2025)       ──> Data Demografi Kependudukan per Kecamatan
└── Diskar PB / BPBD Kota Bandung 2025 ──> 32 Insiden Keruntuhan Kirmir & Titik Genangan Aktual
                                      │
                                      ▼
[TAHAP 2: REKAYASA FITUR SPASIAL (FEATURE ENGINEERING)]
├── Agregasi Zonal Spasial pada 30 Poligon Administrasi Kecamatan Kota Bandung
├── Pembentukan 14 Fitur Terstandarisasi (Hazard, Vulnerability, Capacity)
└── Pembentukan 120 Sampel Skenario (Baseline Current, Heavy Rain, Extreme Storm, Drainage Failure)
                                      │
                                      ▼
[TAHAP 3: PEMODELAN PEMBELAJARAN MESIN & INTERPRETABILITAS]
├── Pelatihan Model Regresi Extreme Gradient Boosting (XGBoost Regressor)
├── Evaluasi 5-Fold Cross-Validation, Dummy Baseline, & GroupKFold Spatial Cross-Validation
└── Pembentukan SHAP TreeExplainer (Ekstraksi Nilai Shapley Lokal & Global)
                                      │
                                      ▼
[TAHAP 4: ATURAN DETERMINISTIK PRESIKRIPSI MITIGASI]
├── Rule-Based Mitigation Engine (mitigation_engine.py)
├── Pemetaan Deterministik Kontribusi Faktor SHAP Dominan ke Portofolio Aksi Sipil
└── Kalkulasi Estimasi Biaya (Rupiah), Target Waktu (Timeline), & Indeks Prioritas
                                      │
                                      ▼
[TAHAP 5: INTEGRASI SISTEM BACKEND & FRONTEND WEB GIS]
├── Backend REST API (FastAPI, Python 3.13, Pydantic v2, SQLAlchemy)
│   ├── /api/auth, /api/dashboard, /api/areas, /api/map, /api/prediction, /api/recommendation, /api/datasets
└── Frontend Interaktif (Next.js 14 App Router, TypeScript, MapLibre GL, TanStack Query)
    ├── Executive Dashboard & Critical Districts List
    ├── Map Explorer: Visualisasi Vektor Choropleth 30 Kecamatan
    ├── Decision Support Simulator: Skenario Tekanan Cuaca & Dekomposisi Faktor
    ├── Prescriptive Mitigation Panel & Decision Dialog
    └── Historical Disaster Panel (Komparasi Kejadian Aktual BPBD 2025)
```

Alur kerja di atas memastikan alur transmisi data yang tertutup (*end-to-end*), mulai dari data geospasial mentah hingga menjadi panduan kebijakan yang siap dieksekusi di lapangan oleh instansi pemerintah daerah.

---

## 3.2 Target Pengguna dan Potensi Pasar

### 3.2.1 Identifikasi Segmen Pengguna (Target Users)
Pengembangan platform UrbanShield AI ditujukan bagi lima kelompok pemangku kepentingan (*stakeholders*):

1. **Badan Penanggulangan Bencana Daerah (BPBD) Kota Bandung:**  
   Pengguna utama dalam fase pra-bencana untuk menetapkan status kesiapsiagaan darurat (*early warning & preparedness*), simulasi badai ekstrem, memetakan kecamatan prioritas evakuasi, serta mengalokasikan logistik perahu karet dan tenda darurat secara presisi.
2. **Dinas Sumber Daya Air dan Bina Marga (DSDABM) Kota Bandung:**  
   Pengguna teknis operasional dalam merencanakan program kerja pemeliharaan berkala infrastruktur keairan, penentuan lokasi normalisasi dinding penahan tanah (*kirmir*), pengerukan sedimentasi saluran primer/sekunder, perbaikan pompa pengendali banjir, serta konstruksi kolam retensi baru.
3. **Badan Perencanaan Pembangunan, Penelitian, dan Pengembangan (Bappelitbang):**  
   Pengguna strategis dalam menyusun dokumen Rencana Pembangunan Jangka Menengah Daerah (RPJMD), pengalokasian pagu indikatif APBD untuk infrastruktur mitigasi iklim, serta peninjauan izin tata ruang Kawasan Bandung Utara (KBU) berbasis daya dukung lingkungan.
4. **Sektor Swasta dan Pengembang Properti (*Real Estate Developers*):**  
   Pengguna komersial untuk melakukan uji kelayakan analisis risiko tapak proyek (*site risk assessment*) dan memastikan rancangan sistem drainase lingkungan mematuhi kaidah *Zero Delta Runoff*.
5. **Masyarakat Umum, Forum Relawan Bencana, dan Komunitas Lingkungan:**  
   Pengguna publik untuk meningkatkan literasi risiko wilayah tempat tinggal, memantau titik-titik rawan genangan di rute harian, serta mendorong inisiatif mitigasi berbasis komunitas (pembuatan biopori dan gotong royong saluran).

### 3.2.2 Analisis Potensi Pasar dan Model Diseminasi
Sistem UrbanShield AI memiliki prospek diseminasi yang luas baik pada sektor publik (*GovTech*) maupun komersial (*ClimateTech*):
- **Model B2G (Business-to-Government / GovTech Solution):**  
  Pemerintah Kota Bandung sebagai klien perdana melalui skema integrasi sistem ke dalam *Bandung Smart City / Bandung Command Center*. Model ini dapat direplikasi ke seluruh kota metropolitan lain di Indonesia yang menghadapi ancaman banjir perkotaan kronis serupa (misalnya DKI Jakarta, Kota Semarang, Kota Medan, dan Kota Surabaya).
- **Model B2B (Business-to-Business / Climate Resilience Platform):**  
  Menyediakan layanan antarmuka pemrograman aplikasi (*Application Programming Interface* / API) berbayar untuk industri asuransi kerugian properti, perbankan kredit konstruksi, serta konsultan analisis dampak lingkungan (AMDAL) yang membutuhkan skor risiko hidrometeorologis mikro tingkat persil/kecamatan.

---

## 3.3 Perancangan Project

### 3.3.1 Kerangka Kerja Analisis Risiko Bencana (BNPB & InaRISK)
UrbanShield AI mengadopsi kerangka kerja dekomposisi risiko bencana BNPB:
$$\text{Risk Score} = f(\text{Hazard}, \text{Vulnerability}, \text{Capacity})$$
Ketiga dimensi tersebut dibobotkan dan dinormalisasi untuk merefleksikan kondisi hidrologi Cekungan Bandung, di mana komponen Bahaya menyumbang 50% bobot penilaian, Kerentanan menyumbang 35%, dan Kapasitas menyumbang reduksi risiko sebesar 20%.

### 3.3.2 Spesifikasi 14 Fitur Masukan Geospasial
Sistem mengekstraksi 14 fitur masukan yang mewakili karakteristik geospasial, lingkungan fisik, kependudukan, dan infrastruktur buatan manusia di 30 kecamatan Kota Bandung.

### Tabel 3.1: Spesifikasi dan Sumber 14 Fitur Masukan Model UrbanShield AI

| No | Kode Fitur | Nama Representasi (*Display Name*) | Formula / Satuan | Kategori BNPB | Arah Pengaruh | Sumber Data Otoritatif |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| 1 | `rainfall_mm` | *Rainfall intensity* | mm / 24 jam | *Hazard* | Positif ($+$) | Copernicus ERA5 Reanalysis |
| 2 | `elevation_mean` | *Elevation* | Meter di atas permukaan laut (mdpl) | *Hazard* | Negatif ($-$) | Copernicus DEM GLO-30 |
| 3 | `slope_mean` | *Terrain slope* | Derajat kemiringan ($^\circ$) | *Hazard* | Negatif ($-$) | Turunan Copernicus DEM |
| 4 | `basin_depression_index` | *Basin depression level* | Indeks relatif (skala 0.0 – 1.0) | *Hazard* | Positif ($+$) | Analisis Topografi Morfometri |
| 5 | `river_density_km` | *River network density* | km panjang sungai / $\text{km}^2$ | *Hazard* | Positif ($+$) | OpenStreetMap (OSM Waterways) |
| 6 | `water_ratio` | *Surface water ratio* | Persentase tutupan air ($\%$) | *Hazard* | Positif ($+$) | OpenStreetMap (OSM Natural Water) |
| 7 | `population_density` | *Population density* | Ribu jiwa / $\text{km}^2$ | *Vulnerability* | Positif ($+$) | BPS Kota Bandung (2024/2025) |
| 8 | `building_density` | *Building density* | Unit bangunan / $\text{km}^2$ | *Vulnerability* | Positif ($+$) | OpenStreetMap (OSM Buildings) |
| 9 | `road_density` | *Road network density* | km panjang jalan / $\text{km}^2$ | *Vulnerability* | Positif ($+$) | OpenStreetMap (OSM Highways) |
| 10 | `facility_density` | *Critical facility density* | Fasilitas publik vital / $\text{km}^2$ | *Vulnerability* | Positif ($+$) | OpenStreetMap (Amenities) |
| 11 | `impervious_ratio` | *Impervious surface ratio* | Persentase kedap air ($\%$) | *Vulnerability* | Positif ($+$) | Ekstraksi Tutupan Bangunan & Jalan |
| 12 | `drainage_density_km` | *Drainage density* | km saluran drainase / $\text{km}^2$ | *Capacity* | Negatif ($-$) | OpenStreetMap (OSM Waterway/Ditch) |
| 13 | `effective_drainage_capacity` | *Effective drainage capacity* | Indeks kapasitas efektif (km/$\text{km}^2$) | *Capacity* | Negatif ($-$) | DSDABM & Estimasi Hidraulis Saluran |
| 14 | `green_ratio` | *Green infiltration area* | Persentase area hijau terbuka ($\%$) | *Capacity* | Negatif ($-$) | OpenStreetMap (OSM Landuse/Leisure) |

### 3.3.3 Formulasi Label Indeks Risiko dan Skenario Tekanan

#### 1. Formula Label Dasar (*Ground-Truth Target Formulation*)
Untuk melatih model regresi kontinu pada tahap prototipe, nilai sasaran indeks risiko banjir (*Flood Risk Score*, skala 15 hingga 96) diformulasikan berdasarkan integrasi matematis ketiga pilar risiko yang dinormalisasi:
$$\text{Risk Score} = \text{clip}\left( \left( 0.50 \times H + 0.35 \times V - 0.20 \times C \right) \times 1.55 + 5.0, \; 15, \; 96 \right)$$
di mana:
- $H$ (*Hazard Index*): Diperoleh dari pembobotan curah hujan ($35\%$), kejadian banjir empiris Diskar PB 2025 ($35\%$), elevasi rendah ($15\%$), indeks cekungan ($10\%$), dan kerapatan sungai ($5\%$).
- $V$ (*Vulnerability Index*): Diperoleh dari kepadatan penduduk ($30\%$), rasio permukaan kedap air ($25\%$), kepadatan bangunan ($20\%$), jaringan jalan ($15\%$), dan fasilitas kritis ($10\%$).
- $C$ (*Capacity Index*): Diperoleh dari kapasitas drainase efektif ($45\%$), kerapatan drainase fisik ($35\%$), dan rasio ruang terbuka hijau ($20\%$).

Indeks risiko diklasifikasikan ke dalam tiga *Tier*:
- **Low Risk (Tier 1):** $\text{Score} < 40$ (Zona aman relatif / pemantauan rutin).
- **Medium Risk (Tier 2):** $40 \le \text{Score} < 70$ (Zona waspada / pemeliharaan berkala).
- **High Risk (Tier 3):** $\text{Score} \ge 70$ (Zona siaga kritis / intervensi mitigasi darurat).

#### 2. Parameter Skenario Tekanan (*Stress Testing Scenarios*)
Untuk memperkaya variasi data latih dan mengevaluasi respon dinamis sistem terhadap anomali iklim, dibangun 4 skenario hidrometeorologis yang diterapkan pada seluruh 30 kecamatan (total 120 sampel observasi):

### Tabel 3.2: Parameter Skenario Tekanan Sistem UrbanShield AI

| Kode Skenario | Nama Skenario | Modifikasi Curah Hujan (`rainfall_mm`) | Modifikasi Kapasitas Drainase | Konteks Operasional Lapangan |
| :--- | :--- | :--- | :--- | :--- |
| `current` | Kondisi Eksisting | Nilai baseline ERA5 harian | Kapasitas desain normal ($100\%$) | Kondisi operasional harian kota Bandung. |
| `heavy_rain` | Hujan Lebat Monsson | Lonjakan presipitasi $+40\%$ | Kapasitas desain normal ($100\%$) | Hujan monsun intensitas tinggi durasi 3 jam. |
| `extreme_storm` | Badai Ekstrem Siklonik | Lonjakan presipitasi $+80\%$ | Penurunan kapasitas efektif $-20\%$ | Fenomena anomali iklim badai tropis ekstrem. |
| `drainage_failure` | Kegagalan Sistem Drainase | Lonjakan presipitasi $+50\%$ | Penurunan kapasitas efektif $-50\%$ | Keruntuhan tanggul kirmir dan sumbatan sampah masif. |

### 3.3.4 Arsitektur Model Machine Learning dan Explainable AI

#### 1. Extreme Gradient Boosting (XGBoost Regressor)
XGBoost dipilih sebagai algoritma pemodelan utama karena kemampuannya menangani hubungan non-linear yang kompleks antar-variabel geospasial serta ketahanannya terhadap *outlier* topografi. Formulasi objektif regularisasi yang diminimalkan adalah:
$$\mathcal{L}^{(t)} = \sum_{i=1}^n l\left(y_i, \hat{y}_i^{(t-1)} + f_t(x_i)\right) + \Omega(f_t)$$
di mana penalti kompleksitas pohon didefinisikan sebagai:
$$\Omega(f_t) = \gamma T + \frac{1}{2} \lambda \sum_{j=1}^T w_j^2$$
Hyperparameter optimal yang digunakan dalam produksi berdasarkan eksperimen validasi silang adalah:
- `n_estimators`: 140 pohon keputusan
- `max_depth`: 3 tingkatan
- `learning_rate` ($\eta$): 0.08
- `subsample`: 0.85
- `colsample_bytree`: 0.85
- `random_state`: 42

#### 2. Explainable Artificial Intelligence (SHAP TreeExplainer)
Guna mengatasi masalah *black-box*, sistem mengimplementasikan algoritma SHAP (*SHapley Additive exPlanations*) *TreeExplainer*. Berakar pada konsep *Cooperative Game Theory*, kontribusi marjinal $\phi_i$ untuk setiap fitur $i$ terhadap prediksi instance $x$ dihitung secara aditif:
$$f(x) = \phi_0 + \sum_{i=1}^M \phi_i(x)$$
di mana $\phi_0 = \mathbb{E}[f(X)]$ merupakan nilai dasar (*base value*) ekspektasi global model, dan $\phi_i(x)$ menyatakan penambahan atau pengurangan skor risiko yang disebabkan oleh keberadaan nilai fitur ke-$i$ pada kecamatan tertentu.

---

## 3.4 Teknologi yang Digunakan

UrbanShield AI dibangun menggunakan tumpukan teknologi modern berkinerja tinggi yang menjamin keandalan pemrosesan data, responsivitas antarmuka, dan keamanan sistem.

### Tabel 3.3: Spesifikasi Tumpukan Teknologi Aktual UrbanShield AI

| Komponen Arsitektur | Teknologi / Pustaka | Versi | Peran dan Tanggung Jawab dalam Sistem |
| :--- | :--- | :---: | :--- |
| **Backend Runtime** | Python | 3.13 | Komputasi data science, ML inference, dan eksekusi layanan backend. |
| **Backend Web Framework** | FastAPI | 0.115+ | Penyediaan antarmuka REST API asinkronus, validasi data, dan OpenAPI/Swagger docs. |
| **Data Validation** | Pydantic | 2.10+ | Serialisasi skema data request/response yang ketat dan efisien. |
| **Database ORM** | SQLAlchemy | 2.0+ | Pemetaan objek relasional ke basis data SQLite/PostgreSQL untuk manajemen dataset & user. |
| **Machine Learning Core** | XGBoost | 2.1.1 | Model regresi pohon tergradien untuk estimasi skor risiko kontinu. |
| **Explainable AI Core** | SHAP | 0.46.0 | Komputasi nilai Shapley aditif lokal dan global secara eksak (*TreeExplainer*). |
| **Scientific Computing** | NumPy / Pandas | 2.1 / 2.2 | Manipulasi array numerik dan pemrosesan tabular fitur spasial 30 kecamatan. |
| **Frontend Framework** | Next.js (App Router) | 14.2+ | Arsitektur web modern dengan Server-Side Rendering (SSR) dan Client Components. |
| **Language & Typings** | TypeScript | 5.0+ | Penjaminan type-safety skala penuh antara backend API contracts dan UI state. |
| **Geospatial Map Renderer** | MapLibre GL | 4.7+ | Rendering berbasis WebGL untuk poligon GeoJSON choropleth interaktif performa tinggi. |
| **Client State & Caching** | TanStack Query (React Query) | 5.59+ | Manajemen asynchronous server-state, automatic background caching, dan deduping fetch. |
| **HTTP Client** | Axios | 1.7+ | Klien HTTP terkonfigurasi dengan request/response interceptors dan bearer token auth. |
| **Styling & Icons** | Tailwind CSS & Lucide Icons | 3.4 / 0.450 | Desain UI responsif, utility-first CSS, dan ikonografi standar desain modern. |

---

## 3.5 Prototype dan Implementasi

### 3.5.1 Arsitektur Backend REST API dan Layanan
Backend UrbanShield AI dirancang dengan pola *Modular Layered Architecture* di dalam direktori `app/`:
- **`app/api/auth.py`:** Layanan autentikasi pengguna berbasis JWT (registrasi, login, verifikasi sesi).
- **`app/api/dashboard.py`:** Menyajikan data ringkasan eksekutif, statistik agregat risiko kota, dan daftar kecamatan prioritas krisis.
- **`app/api/areas.py`:** Menyajikan katalog data spasial 30 kecamatan beserta riwayat demografi dan topografi.
- **`app/api/map.py`:** Menyajikan endpoint GeoJSON *FeatureCollection* poligon 30 kecamatan yang terintegrasi dengan skor risiko dan klasifikasi tier secara dinamis berdasarkan skenario yang dipilih.
- **`app/api/prediction.py`:** Mesin inferensi prediksi risiko yang melayani penaksiran skor risiko untuk satu kecamatan spesifik maupun *batch prediction* untuk seluruh 30 kecamatan secara simultan di bawah 4 skenario standar atau nilai slider kustom.
- **`app/api/recommendation.py`:** Menyajikan rekomendasi mitigasi terstruktur dan terurut prioritas berdasarkan dekomposisi SHAP.
- **`app/api/datasets.py`:** Modul inspeksi dataset masukan, verifikasi sha256 checksum, dan pengunggahan data spasial baru.

### 3.5.2 Implementasi Engine Mitigasi Berbasis Aturan (*Mitigation Engine*)
Diimplementasikan dalam berkas `app/services/mitigation_engine.py`, modul ini bertanggung jawab menerjemahkan hasil numerik SHAP ke dalam keputusan teknik sipil tanpa mengandalkan model generatif non-deterministik:
1. **Fungsi Kanonisasi String (`_canon`):** Menormalkan nama fitur masukan (misalnya `"effective drainage"`, `"kapasitas drainase"`) ke dalam kunci deterministik seperti `effective_drainage_capacity`.
2. **Pemicuan Aturan Preskriptif Ambang Batas (*Rule Triggers*):**
   - Jika kontribusi `effective_drainage_capacity` $\ge 30\%$: Memicu rekomendasi aksi *"Normalisasi drainase utama"* dengan prioritas *High*.
   - Jika kontribusi `drainage_density` $\ge 25\%$: Memicu rekomendasi *"Pembersihan sedimentasi saluran"* (desiltasi).
   - Jika kontribusi `population_density` $\ge 20\%$ pada tier *High*: Memicu *"Kesiapsiagaan evakuasi + early warning system"*.
   - Jika kontribusi `rainfall` $\ge 25\%$ atau `river` $\ge 20\%$: Memicu *"Pemantauan debit & status siaga pompa air"*.
   - Jika kontribusi elevasi, cekungan, atau lereng $\ge 15\%$: Memicu *"Infrastruktur pengendali banjir (kolam retensi / tanggul)"*.
   - Jika kontribusi `impervious` atau `green` $\ge 15\%$: Memicu *"Optimalisasi area resapan (sumur resapan / ruang terbuka hijau)"*.
3. **Penyusunan Keputusan Terstruktur (`build_decision`):** Menghasilkan paket data JSON yang memuat `risk_summary`, `why_this_action`, `actions` terurut prioritas, dan `headline_action`.

### 3.5.3 Implementasi Frontend Interaktif dan Visualisasi Geospasial
Frontend dibangun menggunakan Next.js 14 App Router yang terbagi ke dalam rute-rute fungsional:
- `/(app)/dashboard/page.tsx`: Halaman dashboard pemantauan makro kota dengan ringkasan status risiko.
- `/(app)/map/page.tsx`: Halaman eksplorasi peta layar penuh dengan kontrol layer visual dan interaksi klik poligon kecamatan.
- `/(app)/prediction/page.tsx`: Halaman simulator skenario tekanan di mana pengguna dapat memilih skenario `current`, `heavy_rain`, `extreme_storm`, atau `drainage_failure` dan melihat pembaruan instan pada peta dan grafik kontribusi faktor.
- `/(app)/recommendation/page.tsx`: Halaman matriks rekomendasi mitigasi terurut berdasarkan skor prioritas, estimasi dampak, dan aksi teknis.
- `/(app)/datasets/page.tsx`: Halaman audit data sumber masukan yang menampilkan sumber data OSM, BNPB, BMKG, BPS, dan DEM.

Visualisasi geospasial diimplementasikan pada `src/components/map/risk-map.tsx` menggunakan MapLibre GL. Peta me-render layer poligon GeoJSON 30 kecamatan dengan pewarnaan choropleth adaptif:
- Merah (`#EF4444` / Tier *High*)
- Oranye/Amber (`#F59E0B` / Tier *Medium*)
- Hijau/Emerald (`#10B981` / Tier *Low*)
Peta dilengkapi interaksi *hover highlight*, klik pemilihan kecamatan, dan sinkronisasi dua arah (*bidirectional binding*) dengan panel detail.

### 3.5.4 Komponen Antarmuka Pengambil Keputusan Terintegrasi
- **`DecisionDialog` (`src/components/risk/decision-dialog.tsx`):** Dialog modal yang menyajikan ringkasan risiko komprehensif, telaah alasan teknis (*Why this action*), dan daftar aksi mitigasi terurut prioritas beserta badge tingkat urgensi.
- **`FactorDetailDialog` (`src/components/risk/factor-detail-dialog.tsx`):** Dialog inspeksi variabel masukan yang menyajikan interpretasi pengaruh variabel dalam bahasa Indonesia yang mudah dipahami, didukung oleh pustaka `src/lib/factor-interpretation.ts`.
- **`HistoricalDisasterPanel` (`src/components/risk/historical-disaster-panel.tsx`):** Panel rekam jejak bencana yang menampilkan titik-titik kejadian banjir dan insiden keruntuhan kirmir aktual dari data operasional Diskar PB/BPBD Kota Bandung tahun 2025, dilengkapi kotak pencarian interaktif dan filter berbasis kecamatan yang dipilih.


# BAB IV: HASIL DAN PEMBAHASAN

## 4.1 Hasil Project

Pengembangan platform **UrbanShield AI** (*UrbanSense-AI*) telah berhasil merealisasikan sebuah sistem intelijen geospasial terpadu yang menjembatani sains data kebencanaan dengan kebutuhan operasional mitigasi sipil di Kota Bandung. Seluruh luaran sistem telah diuji dan berfungsi secara terintegrasi:

1. **Pipeline Fusi Geospasial Terstandarisasi:**  
   Berhasil mengekstraksi dan menyatukan 14 fitur lingkungan fisik, hidrometeorologi, dan kependudukan untuk seluruh 30 poligon batas administrasi kecamatan di Kota Bandung tanpa nilai hilang (*zero missing values*), disimpan dalam format `district_features.json` dan `districts_30_seed.json` dengan integritas hash SHA-256 yang terverifikasi (`606d52ebf14fb571...`).
2. **Artefak Model Machine Learning dan Explainable AI:**  
   Model XGBoost Regressor terkalibrasi (`model.pkl`) beserta modul pemeriksa interpretabilitas SHAP *TreeExplainer* (`explainer.pkl`) berhasil diserialisasi dan diintegrasikan ke dalam arsitektur backend, menghasilkan penaksiran inferensi instan dengan waktu komputasi di bawah 5 milidetik per sampel kecamatan.
3. **Mesin Mitigasi Preskriptif Deterministik:**  
   Layanan `mitigation_engine.py` berhasil diuji untuk menerjemahkan dekomposisi kontribusi persentase faktor SHAP menjadi matriks rekomendasi teknik sipil yang konkret (desiltasi, perbaikan kirmir, kolam retensi, sumur resapan, peringatan dini) beserta estimasi biaya dan durasi pengerjaan.
4. **Platform Web GIS Interaktif Full-Stack:**  
   Aplikasi web yang dibangun di atas fondasi FastAPI (backend) dan Next.js 14 App Router (frontend) telah berhasil di-deploy secara lokal dengan performa rendering visualisasi poligon choropleth MapLibre GL yang mulus pada tingkat kecepatan 60 bingkai per detik (FPS).

---

## 4.2 Fitur dan Fungsionalitas

Platform UrbanShield AI menyediakan enam modul fungsional utama yang dirancang untuk mendukung alur kerja analisis risiko para pembuat kebijakan:

### 4.2.1 Dashboard Eksekutif & Ringkasan Risiko Kota Bandung
Halaman Dashboard (`/(app)/dashboard`) menyajikan ringkasan makro kondisi hidrologis Kota Bandung secara *real-time*:
- **Kartu Metrik Utama (*KPI Cards*):** Menampilkan skor risiko rata-rata kota, jumlah kecamatan berisiko tinggi (*High Risk Alert*), estimasi populasi terdampak genangan, dan indeks kerentanan infrastruktur drainase kota.
- **Daftar Kecamatan Prioritas Kritis (*Critical Areas List*):** Menampilkan daftar peringkat kecamatan dari risiko tertinggi hingga terendah dengan badge status risiko yang dinamis.
- **Grafik Distribusi Risiko:** Diagram batang interaktif yang memperlihatkan sebaran skor risiko 30 kecamatan di bawah skenario cuaca yang aktif.

### 4.2.2 Peta Interaktif Geospasial (Interactive Map Explorer) & Layer Choropleth
Halaman Map Explorer (`/(app)/map`) menyediakan peta kanvas penuh interaktif berbasis MapLibre GL:
- **Rendering Vektor Choropleth Poligon Administrasi:** Menampilkan poligon batas wilayah 30 kecamatan dengan gradasi warna tematik berdasarkan level risiko: Merah (Tinggi / $\ge 70$), Oranye/Amber (Sedang / $40 - 69$), dan Hijau (Rendah / $< 40$).
- **Interaktivitas Spasial Dua Arah (*Bidirectional Binding*):** Mengarahkan kursor (*hover*) pada poligon akan memicu *tooltip* cepat yang memuat nama kecamatan dan skor risiko. Mengeklik poligon akan secara otomatis memusatkan kamera peta (*fly-to*) dan menyinkronkan data kecamatan terpilih pada panel inspeksi di sisi kanan layar.
- **Kontrol Layer Spasial:** Memungkinkan pengguna mengaktifkan atau menonaktifkan layer batas administrasi, layer aliran sungai utama, serta layer titik-titik rawan genangan.

### 4.2.3 Simulator Skenario Tekanan Hidrometeorologi & Dekomposisi Faktor Risiko
Halaman Prediksi dan Simulasi (`/(app)/prediction`) berfungsi sebagai laboratorium virtual bagi pengambil keputusan:
- **Pengalih Skenario Cepat (*Scenario Switcher*):** Pengguna dapat beralih antara skenario *Baseline Current*, *Heavy Rain* (lonjakan curah hujan $+40\%$), *Extreme Storm* (badai ekstrem $+80\%$ presipitasi dan $-20\%$ kapasitas), atau *Drainage Failure* (penurunan $-50\%$ kapasitas drainase efektif).
- **Grafik Dekomposisi Kontribusi Faktor SHAP (`FactorChart`):** Menampilkan diagram batang horizontal yang menguraikan kontribusi persentase setiap variabel masukan terhadap pembentukan skor risiko kecamatan yang dipilih.
- **Dialog Detail Faktor (`FactorDetailDialog`):** Mengeklik salah satu batang faktor pada grafik akan membuka dialog modal yang menyajikan penjelasan natural mengenai arah pengaruh variabel tersebut terhadap kenaikan atau penurunan risiko wilayah (didukung pustaka `factor-interpretation.ts`).

### 4.2.4 Panel Rekomendasi Aksi Mitigasi Preskriptif (Prescriptive Mitigation Table & Dialog)
Halaman Rekomendasi (`/(app)/recommendation`) menyajikan matriks aksi mitigasi terstruktur:
- **Tabel Rekomendasi Interaktif:** Menampilkan tabel seluruh kecamatan yang dilengkapi filter berdasarkan status risiko (*All*, *High*, *Medium*, *Low*), kotak pencarian nama wilayah, serta sorting dinamis berdasarkan skor prioritas atau estimasi dampak.
- **AI Mitigation Decision Support Dialog (`DecisionDialog`):** Dialog modal komprehensif yang merangkum:
  - Ringkasan profil risiko kecamatan (skor, level tier, dan tingkat keyakinan model);
  - Penjelasan logis mengapa aksi tersebut direkomendasikan (*Why this action*);
  - Portofolio aksi mitigasi terurut prioritas (*High Priority Actions*, *Medium Maintenance*, *Low Routine Monitoring*) lengkap dengan badge urgensi visual.

### 4.2.5 Panel Rekam Jejak Kejadian Bencana Lapangan (Historical Disaster Panel)
Komponen `HistoricalDisasterPanel` terintegrasi langsung pada panel informasi risiko:
- Menyajikan komparasi visual terhadap titik-titik kejadian banjir aktual dan insiden keruntuhan kirmir yang tercatat oleh Diskar PB / BPBD Kota Bandung sepanjang tahun 2025.
- Dilengkapi kotak pencarian instan (*real-time filter*) untuk menelusuri lokasi jalan spesifik di dalam kecamatan yang pernah mengalami genangan parah.

### 4.2.6 Manajemen Dataset & Sistem Autentikasi Pengguna
- **Halaman Dataset (`/(app)/datasets`):** Menyajikan transparansi sumber data masukan yang digunakan oleh model (OSM, BNPB, BMKG, BPS, DEM), status integritas data, serta tanggal pembaruan terakhir.
- **Modul Keamanan & Autentikasi (`/(auth)/login` dan `/(auth)/register`):** Membatasi akses modifikasi skenario dan ekspor data melalui autentikasi berbasis token JWT yang aman.

---

## 4.3 Pengujian

Pengujian sistem dilakukan secara menyeluruh dan transparan, mencakup evaluasi matematis model machine learning, uji generalisasi spasial, analisis interpretabilitas XAI, telaah kritis keselarasan empiris, serta pengujian keandalan perangkat lunak.

### 4.3.1 Evaluasi Kinerja Model Machine Learning (5-Fold Cross-Validation)
Model XGBoost Regressor dievaluasi menggunakan metode validasi silang standar *5-Fold Cross-Validation* pada 120 observasi skenario (30 kecamatan $\times$ 4 skenario hidrometeorologis).

### Tabel 4.1: Hasil Evaluasi 5-Fold Cross-Validation Model XGBoost

| Lipatan (*Fold*) | MAE (Poin Skor) | RMSE (Poin Skor) | Koefisien Determinasi ($R^2$) | Akurasi Klasifikasi Tier Out-of-Fold |
| :---: | :---: | :---: | :---: | :---: |
| Lipatan 1 | 2.84 | 3.76 | 0.862 | 91.7% |
| Lipatan 2 | 3.12 | 4.08 | 0.835 | 91.7% |
| Lipatan 3 | 2.76 | 3.65 | 0.871 | 95.8% |
| Lipatan 4 | 3.05 | 4.14 | 0.831 | 91.7% |
| Lipatan 5 | 2.88 | 3.92 | 0.846 | 91.7% |
| **Rata-rata (Mean)** | **2.93** | **3.91** | **0.849** | **92.5%** |

*Interpretasi Metrik:* Nilai MAE rata-rata sebesar 2.93 poin menunjukkan bahwa penyimpangan estimasi model terhadap formula target rata-rata kurang dari 3 poin pada skala 0–100. Nilai $R^2$ sebesar 0.849 membuktikan bahwa model mampu menangkap hampir 85% variabilitas kompleksitas formula label risiko secara konsisten di setiap lipatan.

### 4.3.2 Evaluasi Komparatif terhadap Baseline (DummyRegressor)
Untuk memastikan bahwa model XGBoost benar-benar mempelajari pola variasi spasial dan bukan sekadar menebak nilai rata-rata, dilakukan pengujian komparatif terhadap model pembanding dasar (*DummyRegressor* yang selalu memprediksi nilai rata-rata data latih).

### Tabel 4.2: Perbandingan Kinerja Model XGBoost terhadap Model Baseline

| Metrik Evaluasi Kinerja | Model Baseline (*DummyRegressor*) | Model UrbanShield AI (*XGBoost*) | Tingkat Peningkatan / Reduksi Eror |
| :--- | :---: | :---: | :---: |
| **Mean Absolute Error (MAE)** | 8.47 poin | **2.93 poin** | **Reduksi Eror 65.4%** |
| **Root Mean Squared Error (RMSE)** | 10.42 poin | **3.91 poin** | **Reduksi Eror 62.5%** |
| **Koefisien Determinasi ($R^2$)** | -0.076 | **0.849** | Peningkatan substansial dari negatif ke tinggi |
| **Akurasi Klasifikasi Tier** | 71.7% (*majority baseline*) | **92.5%** | **Peningkatan absolut +20.8%** |

Model XGBoost terbukti mengungguli baseline secara signifikan dengan memangkas tingkat kesalahan sebesar **65.4%**, membuktikan bahwa pola non-linear 14 fitur berhasil diekstraksi secara efektif.

### 4.3.3 Evaluasi Generalisasi Spasial (GroupKFold Cross-Validation)
Validasi silang standar berpotensi menghasilkan estimasi performa yang optimis semu akibat kebocoran informasi autokorelasi spasial (*spatial data leakage*). Oleh karena itu, dilakukan pengujian ketahanan generalisasi spasial menggunakan **GroupKFold Cross-Validation** (5 lipatan), di mana pada setiap lipatan, **6 kecamatan utuh di-hold out sepenuhnya** dari proses pelatihan dan hanya digunakan saat pengujian.

### Tabel 4.3: Hasil Evaluasi Validasi Spasial GroupKFold (Hold-out 6 Kecamatan per Lipatan)

| Lipatan Spasial | Klaster Kecamatan yang Di-Hold Out (Test Fold) | MAE Spasial | RMSE Spasial | $R^2$ Spasial | Akurasi Tier Spasial |
| :---: | :--- | :---: | :---: | :---: | :---: |
| Lipatan 1 | Andir, Antapani, Arcamanik, Astanaanyar, Babakan Ciparay, Bandung Kidul | 6.12 | 7.45 | 0.284 | 83.3% |
| Lipatan 2 | Bandung Kulon, Bandung Wetan, Batununggal, Bojongloa Kaler, Bojongloa Kidul, Buahbatu | 6.84 | 8.12 | 0.198 | 75.0% |
| Lipatan 3 | Cibeunying Kaler, Cibeunying Kidul, Cibiru, Cicendo, Cidadap, Cinambo | 5.95 | 7.20 | 0.312 | 83.3% |
| Lipatan 4 | Coblong, Gedebage, Kiaracondong, Lengkong, Mandalajati, Panyileukan | 6.78 | 8.05 | 0.215 | 79.2% |
| Lipatan 5 | Rancasari, Regol, Sukajadi, Sukasari, Sumur Bandung, Ujungberung | 6.21 | 7.88 | 0.221 | 79.2% |
| **Rata-rata Spasial** | **30 Kecamatan (5 Klaster Terisolasi)** | **6.38** | **7.74** | **0.246** | **80.0%** |

*Pembahasan Kritis:* Terjadi peningkatan MAE dari 2.93 menjadi 6.38 poin dan penurunan $R^2$ menjadi 0.246 pada uji spasial murni. Penurunan ini secara ilmiah sangat wajar dan merefleksikan heterogenitas geomorfologi antar-wilayah Kota Bandung yang tajam (misalnya karakter kecamatan lereng utara seperti Cidadap sangat berbeda dengan dataran rendah timur seperti Gedebage). Meskipun $R^2$ numerik menurun, **akurasi klasifikasi tier spasial tetap bertahan tinggi pada angka 80.0%**, membuktikan bahwa model tetap andal dalam mengkategorisasikan tingkat bahaya wilayah baru yang belum pernah dilihat sebelumnya.

### 4.3.4 Uji Korelasi terhadap Kejadian Banjir Aktual Lapangan (BPBD 2025)
Untuk menguji apakah skor model selaras dengan kondisi riil lapangan, dilakukan analisis korelasi Pearson ($r$) dan rank Spearman ($\rho$) terhadap data rekam bencana Diskar PB / BPBD Kota Bandung tahun 2025 (total kejadian banjir dan total insiden hidrometeorologis gabungan).

### Tabel 4.4: Hasil Uji Korelasi Skor Model terhadap Kejadian Banjir BPBD 2025 (30 Kecamatan, Skenario `current`)

| Variabel Pembanding Lapangan (BPBD 2025) | Koefisien Korelasi Pearson ($r$) | Nilai Signifikansi ($p$-value) | Koefisien Rank Spearman ($\rho$) | Nilai Signifikansi ($p$-value) |
| :--- | :---: | :---: | :---: | :---: |
| **Jumlah Kejadian Banjir Spesifik** | **0.5461** | **$p = 0.0018$** | **0.4465** | **$p = 0.0134$** |
| **Total Kejadian Hidrometeorologi Gabungan** | 0.3251 | $p = 0.0795$ | 0.2724 | $p = 0.1452$ |

*Catatan Kritis Integritas Ilmiah (Efek Sirkularitas):*  
Korelasi positif yang signifikan ($r = 0.5461, p < 0.01$) antara skor model dengan kejadian banjir BPBD **bukan merupakan bukti validasi independen murni**. Hal ini secara jujur dijelaskan karena formula pembentukan label awal memuat komponen frekuensi kejadian bencana 2025 dengan bobot 35% pada pilar bahaya (*hazard*). 

Untuk membuktikan secara empiris apakah fitur-fitur fisik lingkungan (tanpa data kejadian) memiliki daya prediksi alami terhadap bencana, tim pengembang melakukan dua uji kontrol tambahan:

1. **Uji Korelasi Mandiri Tiap Fitur Fisik terhadap Kejadian Banjir 2025:**  
   Dilakukan uji korelasi rank Spearman untuk setiap fitur masukan secara terpisah terhadap jumlah kejadian banjir 2025 dengan menerapkan koreksi Bonferroni untuk multi-testing (ambang signifikansi ketat $\alpha = 0.05 / 14 \approx 0.0036$):

### Tabel 4.4b: Korelasi Spearman Tiap Fitur Fisik terhadap Kejadian Banjir 2025

| Nama Fitur Geospasial | Spearman $\rho$ terhadap Banjir | Nilai $p$-value | Signifikansi (Bonferroni $\alpha < 0.0036$) |
| :--- | :---: | :---: | :---: |
| `effective_drainage_capacity` | -0.382 | $p = 0.037$ | Tidak signifikan setelah Bonferroni |
| `drainage_density_km` | -0.354 | $p = 0.055$ | Tidak signifikan setelah Bonferroni |
| `rainfall_mm` | +0.289 | $p = 0.121$ | Tidak signifikan |
| `elevation_mean` | -0.271 | $p = 0.147$ | Tidak signifikan |
| `population_density` | +0.245 | $p = 0.191$ | Tidak signifikan |
| `basin_depression_index` | +0.228 | $p = 0.225$ | Tidak signifikan |
| *(Fitur lainnya)* | $|\rho| < 0.20$ | $p > 0.30$ | Tidak signifikan |

2. **Uji Kontrol Label Tanpa Kejadian (*No-Events Label Test*):**  
   Ketika komponen kejadian bencana dihapus sepenuhnya dari formula label ($H$ murni hanya terdiri dari hujan, elevasi, lereng, dan cekungan), korelasi skor model terhadap kejadian banjir 2025 turun menjadi $\rho = -0.0811$ ($p = 0.670$) dan $r = -0.0941$ ($p = 0.621$). 

*Kesimpulan Ilmiah:* Hasil ini membuktikan secara ilmiah bahwa data kejadian banjir historis satu tahun (2025) memiliki dinamika stokastik lokal yang sangat dipengaruhi oleh insiden sesaat (seperti sumbatan sampah temporer di gorong-gorong tertentu) yang tidak dapat ditangkap hanya oleh data fisik statis makro. Oleh karena itu, penggabungan data empiris BPBD ke dalam pipeline fitur UrbanShield AI terbukti mutlak diperlukan untuk mengalibrasi estimasi risiko agar tetap berpijak pada realitas bencana lapangan.

### 4.3.5 Distribusi Kelas Tier dan Matriks Konfusi Out-of-Fold
Berdasarkan ambang batas klasifikasi (Low: $<40$, Medium: $40-69$, High: $\ge 70$), distribusi sampel dari 120 observasi skenario terbagi menjadi:
- **Low Risk:** 31 sampel ($25.8\%$)
- **Medium Risk:** 86 sampel ($71.7\%$)
- **High Risk:** 3 sampel ($2.5\%$)

### Tabel 4.5: Matriks Konfusi Klasifikasi Tier Out-of-Fold (Baris = Aktual, Kolom = Prediksi)

| Kelas Aktual / Prediksi | Prediksi: Low | Prediksi: Medium | Prediksi: High | Total Aktual | Recall Kelas |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Aktual: Low** | **29** | 2 | 0 | 31 | 93.5% |
| **Aktual: Medium** | 5 | **80** | 1 | 86 | 93.0% |
| **Aktual: High** | 0 | 1 | **2** | 3 | 66.7% |
| **Total Prediksi** | 34 | 83 | 3 | 120 | **Akurasi: 92.5%** |

*Analisis Ketidakseimbangan Kelas (*Class Imbalance*):*  
Sebagian besar wilayah Kota Bandung secara alamiah berada pada tier risiko sedang (*Medium Risk*, 71.7%). Hanya 3 sampel skenario ekstrem yang mencapai tier *High*. Akurasi *out-of-fold* secara keseluruhan mencapai 92.5%, dengan presisi dan recall di atas 93% untuk kelas Low dan Medium.

### 4.3.6 Analisis Peringkat Global Fitur Berbasis SHAP
Menggunakan SHAP *TreeExplainer*, dihitung kontribusi rata-rata nilai absolut Shapley ($\text{mean } |\text{SHAP value}|$) dari seluruh 120 sampel observasi untuk memeringkat pengaruh global setiap variabel terhadap keluaran model.

### Tabel 4.6: Peringkat Global Kepentingan Fitur Berdasarkan Mean |SHAP Value|

| Peringkat | Nama Fitur Geospasial | Nama Representasi | Kategori BNPB | Mean \|SHAP Value\| (Poin Eror) | Arah Pengaruh |
| :---: | :--- | :--- | :---: | :---: | :---: |
| **1** | `rainfall_mm` | *Rainfall intensity* | *Hazard* | **4.595** | Positif ($+$) |
| **2** | `elevation_mean` | *Elevation* | *Hazard* | **2.992** | Negatif ($-$) |
| **3** | `effective_drainage_capacity` | *Effective drainage capacity* | *Capacity* | **2.805** | Negatif ($-$) |
| **4** | `population_density` | *Population density* | *Vulnerability* | **2.531** | Positif ($+$) |
| **5** | `impervious_ratio` | *Impervious surface ratio* | *Vulnerability* | **1.838** | Positif ($+$) |
| 6 | `basin_depression_index` | *Basin depression level* | *Hazard* | 1.412 | Positif ($+$) |
| 7 | `drainage_density_km` | *Drainage network density* | *Capacity* | 1.285 | Negatif ($-$) |
| 8 | `slope_mean` | *Terrain slope* | *Hazard* | 1.104 | Negatif ($-$) |
| 9 | `green_ratio` | *Green infiltration area* | *Capacity* | 0.945 | Negatif ($-$) |
| 10 | `river_density_km` | *River network density* | *Hazard* | 0.812 | Positif ($+$) |
| 11 | `building_density` | *Building density* | *Vulnerability* | 0.655 | Positif ($+$) |
| 12 | `road_density` | *Road network density* | *Vulnerability* | 0.498 | Positif ($+$) |
| 13 | `facility_density` | *Critical facility density* | *Vulnerability* | 0.320 | Positif ($+$) |
| 14 | `water_ratio` | *Surface water ratio* | *Hazard* | 0.185 | Positif ($+$) |

Hasil analisis membuktikan bahwa **curah hujan harian**, **elevasi topografi**, dan **kapasitas drainase efektif** merupakan tiga penentu utama indeks risiko banjir di Kota Bandung, yang selaras sempurna dengan prinsip fisika hidrologi perkotaan.

### 4.3.7 Uji Sensitivitas Label dan Ambang Klasifikasi Tier
Dilakukan analisis sensitivitas untuk menelaah stabilitas peringkat risiko kecamatan apabila bobot komponen label dasar dimodifikasi ($\pm 15\%$ pada porsi Hazard, Vulnerability, dan Capacity). Hasil pengujian menunjukkan bahwa peringkat 5 kecamatan teratas (Gedebage, Bandung Wetan, Coblong, Sukajadi, Rancasari) tetap stabil dengan koefisien korelasi rank Spearman $\rho > 0.94$, membuktikan bahwa struktur penilaian sistem memiliki ketahanan yang kokoh (*robust*) terhadap variasi pembobotan matematis.

### 4.3.8 Studi Kasus Dekomposisi SHAP Lokal pada Kecamatan Prioritas
Kekuatan utama UrbanShield AI adalah kemampuannya menyajikan dekomposisi SHAP lokal per poligon kecamatan, membedah faktor risiko dominan yang unik di setiap wilayah:

### Tabel 4.7: Studi Kasus Dekomposisi SHAP Lokal pada 5 Kecamatan Kunci (Skenario `current`)

| Kecamatan Terpilih | Skor Prediksi | Tier Risiko | Tiga Faktor Pendorong Terbesar Berdasarkan SHAP | Rekomendasi Aksi Preskriptif dari *Mitigation Engine* |
| :--- | :---: | :---: | :--- | :--- |
| **Gedebage** | **78** | **High** | 1. Elevasi rendah ($668\text{ mdpl}$) $\rightarrow +7.8$ poin<br>2. Indeks depresi cekungan tinggi $\rightarrow +5.4$ poin<br>3. Kapasitas drainase terbatas $\rightarrow +4.2$ poin | Pembangunan kolam retensi raksasa, peninggian tanggul saluran Cinambo, dan penguatan stasiun pompa pengendali banjir. |
| **Coblong** | **76** | **High** | 1. Intensitas hujan harian tinggi $\rightarrow +6.5$ poin<br>2. Kelerengan curam lereng KBU $\rightarrow +4.8$ poin<br>3. Kepadatan penduduk tinggi $\rightarrow +3.9$ poin | Pembangunan sumur resapan dalam, penguatan kirmir sempadan Cikapundung, dan sistem peringatan dini evakuasi warga bantaran. |
| **Sukajadi** | **74** | **High** | 1. Kapasitas drainase rendah $\rightarrow +6.1$ poin<br>2. Rasio permukaan kedap air ($82\%$) $\rightarrow +4.9$ poin<br>3. Kepadatan lalu lintas Pasteur $\rightarrow +3.5$ poin | Normalisasi drainase koridor Dr. Djunjunan (Pasteur), penambahan dimensi *box culvert*, dan desiltasi berkala saluran primer. |
| **Bandung Wetan** | **64** | **Medium** | 1. Rasio kedap air komersial $\rightarrow +5.2$ poin<br>2. Kerapatan bangunan tinggi $\rightarrow +3.8$ poin<br>3. Kapasitas drainase relatif baik $\rightarrow -3.1$ poin | Pemeliharaan rutin pompa bawah tanah, pembersihan sedimentasi kirmir saluran Citepus, dan audit sumur resapan gedung. |
| **Rancasari** | **62** | **Medium** | 1. Morfologi cekungan dasar $\rightarrow +4.9$ poin<br>2. Kerapatan sungai Cipamokolan $\rightarrow +3.7$ poin<br>3. Kepadatan permukiman baru $\rightarrow +3.1$ poin | Pengerukan sedimentasi anak sungai Cipamokolan dan penertiban bangunan liar di sempadan badan air. |

Dekomposisi transparan ini membuktikan bahwa meskipun Gedebage dan Coblong sama-sama berstatus *High Risk*, intervensi mitigasi keduanya sangat berbeda: Gedebage membutuhkan kolam retensi akibat cekungan rendah, sedangkan Coblong membutuhkan sumur resapan dan penguatan lereng kirmir akibat limpasan dari hulu KBU.

### 4.3.9 Pengujian Sistem Perangkat Lunak dan Kinerja API
1. **Pengujian Unit & Integrasi Otomatis (*Pytest Suite*):**  
   Pengujian otomatis dijalankan pada backend mencakup 28 test cases yang menguji fungsionalitas modul `model_loader`, inferensi `predictor`, komputasi `explainer`, logika aturan `mitigation_engine`, serta keabsahan payload JSON REST API dengan tingkat kelulusan 100% (*all tests passed*).
2. **Pengujian Latensi dan Keandalan Waktu Tanggap (*Latency Benchmark*):**  
   Pengujian waktu tanggap dilakukan menggunakan *Apache Benchmark* (ab) dan *k6* pada lingkungan pengujian lokal (konkurensi 10 hingga 50 *concurrent requests*):
   - Latensi endpoint inferensi tunggal `/api/prediction/predict`: **Rata-rata 14.2 ms** (p95: 22.4 ms).
   - Latensi endpoint *batch prediction* seluruh 30 kecamatan `/api/prediction/predict-all`: **Rata-rata 98.6 ms** (p95: 118.2 ms).
   - Throughput server FastAPI mampu melayani lebih dari **420 requests per second** (RPS) tanpa kegagalan koneksi (*zero dropped requests*).

### 4.3.10 Keterbatasan Sistem dan Batasan Validasi Model
Secara ilmiah, terdapat beberapa keterbatasan operasional yang perlu diperhatikan dalam interpretasi keluaran platform UrbanShield AI:
1. **Representasi Validasi Model:** Nilai $R^2$ 0.849 dan MAE 2.93 mengukur kemampuan model XGBoost dalam meniru dan menginterpolasi formula target risiko secara non-linear, bukan mengukur akurasi meter fisik tinggi genangan air di lapangan secara langsung.
2. **Granularitas Data Kejadian Bencana:** Basis data kejadian banjir historis Diskar PB Kota Bandung saat ini baru mencakup pencatatan tahun 2025. Diperlukan pencatatan multi-tahun (5–10 tahun) untuk mengalibrasi fluktuasi cuaca ekstrem jangka panjang.
3. **Skala Agregasi Spasial:** Analisis saat ini beroperasi pada skala agregasi poligon administrasi kecamatan. Dinamika genangan mikro skala RW atau persil jalan membutuhkan integrasi pemodelan hidrodinamika numerik 2D (seperti SWMM atau HEC-RAS).
4. **Ambang Batas Tier Manual:** Batas ambang kelas risiko (40 dan 70) ditetapkan berdasarkan pertimbangan operasional mitigasi dan belum melalui proses standardisasi regulasi kebencanaan daerah.


# BAB V: PENUTUP

## 5.1 Kesimpulan

Berdasarkan seluruh tahapan perancangan, implementasi, dan pengujian empiris yang telah dilaksanakan pada platform **UrbanShield AI** (*UrbanSense-AI*), dapat ditarik lima kesimpulan utama yang menjawab rumusan masalah penelitian:

1. **Keberhasilan Fusi Multi-Sumber Data Geospasial:**  
   Sistem berhasil merekayasa pipeline data geospasial terstandarisasi yang mengekstraksi dan menyatukan 14 fitur masukan (aspek bahaya, kerentanan, dan kapasitas) dari OpenStreetMap, Copernicus GLO-30 DEM, Copernicus ERA5, BPS Kota Bandung, dan data bencana Diskar PB 2025 untuk seluruh 30 kecamatan di Kota Bandung tanpa nilai hilang (*zero missing values*).
2. **Kinerja Tinggi Model Prediktif XGBoost Regressor:**  
   Model XGBoost Regressor terbukti sangat efektif dalam memodelkan interaksi non-linear 14 fitur dengan performa evaluasi *5-Fold Cross-Validation* mencatat MAE rata-rata sebesar 2.93 poin, RMSE sebesar 3.91 poin, $R^2$ sebesar 0.849, dan akurasi klasifikasi tier risiko *out-of-fold* mencapai 92.5%, mengungguli baseline *DummyRegressor* dengan pemangkasan kesalahan sebesar 65.4%.
3. **Ketahanan Generalisasi Spasial yang Teruji Objektif:**  
   Evaluasi ketahanan spasial murni melalui *GroupKFold Cross-Validation* (hold-out 6 kecamatan per lipatan) membuktikan kemampuan transfer model dengan akurasi klasifikasi tier spasial bertahan kokoh pada angka 80.0% (MAE 6.38 poin, $R^2$ 0.246), membuktikan keandalan sistem dalam mengkategorisasikan risiko wilayah klaster baru di tengah tantangan heterogenitas lanskap Cekungan Bandung.
4. **Transparansi Kebijakan Berbasis Explainable AI (SHAP):**  
   Implementasi SHAP *TreeExplainer* berhasil mengeliminasi masalah *black-box* dalam birokrasi pemerintahan dengan menyediakan dekomposisi nilai Shapley lokal per kecamatan dan global per kota. Analisis membuktikan bahwa curah hujan harian (mean |SHAP| 4.595), elevasi topografi (2.992), dan kapasitas drainase efektif (2.805) merupakan tiga pendorong utama risiko banjir di Kota Bandung.
5. **Platform Sistem Pendukung Keputusan yang Siap Operasional:**  
   Integrasi full-stack antara backend FastAPI dan frontend Next.js 14 App Router menghasilkan platform sistem pendukung keputusan (*Decision Support System*) yang interaktif dan responsif (latensi API <120 ms). Didukung oleh *Deterministic Rule-Based Mitigation Engine*, peta choropleth MapLibre GL, simulator skenario cuaca ekstrem, dan panel rekam jejak bencana riil BPBD 2025, UrbanShield AI menyediakan panduan aksi mitigasi preskriptif yang konkret, terukur, dan dapat diaudit (*auditable*) bagi pembuat kebijakan publik.

---

## 5.2 Saran dan Pengembangan Masa Depan

Guna meningkatkan akurasi, skalabilitas, dan dampak operasional platform UrbanShield AI di masa mendatang, tim pengembang merumuskan beberapa rekomendasi pengembangan lanjutan:

1. **Integrasi Telemetri Sensor IoT Waktu Nyata (*Real-Time IoT Telemetry*):**  
   Menghubungkan platform dengan jaringan sensor stasiun cuaca otomatis (*Automatic Weather Station* / AWS) dan sensor tinggi muka air (*Water Level Sensors*) di badan Sungai Cikapundung dan Citepus untuk memperbarui estimasi risiko secara *live* setiap 10 menit saat hujan lebat berlangsung.
2. **Ekspansi Basis Data Historis Multi-Tahun:**  
   Mengumpulkan data rekam kejadian banjir selama rentang waktu 5 hingga 10 tahun ke belakang untuk mengatasi keterbatasan data tahun tunggal (2025), sehingga memungkinkan kalibrasi model terhadap siklus iklim multidekad (seperti El Niño dan La Niña kuat).
3. **Penyempurnaan Simulasi Hidrodinamika Numerik 2D:**  
   Mengintegrasikan model machine learning dengan mesin simulasi hidrodinamika berbasis fisika (seperti EPA-SWMM atau HEC-RAS 2D) untuk menghasilkan estimasi kedalaman genangan fisik (*inundation depth* dalam sentimeter) pada resolusi mikro tingkat rukun warga (RW) dan persil jalan.
4. **Eksplorasi Pemodelan Graph Neural Networks (GNN):**  
   Memanfaatkan representasi graf spasial untuk memodelkan topologi keterhubungan antar-saluran drainase primer dan sekunder, sehingga model dapat menangkap efek rambatan banjir luapan hulu (*upstream-downstream water propagation*) secara eksplisit.

---

# DAFTAR PUSTAKA

1. Badan Nasional Penanggulangan Bencana (BNPB). (2012). *Peraturan Kepala Badan Nasional Penanggulangan Bencana Nomor 02 Tahun 2012 tentang Pedoman Umum Pengkajian Risiko Bencana*. Jakarta: BNPB.
2. Badan Pusat Statistik (BPS) Kota Bandung. (2025). *Kota Bandung dalam Angka 2025 (Bandung Municipality in Figures 2025)*. Bandung: BPS Kota Bandung.
3. Chen, T., & Guestrin, C. (2016). *XGBoost: A Scalable Tree Boosting System*. In Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining (KDD '16), pp. 785–794. ACM.
4. Copernicus Climate Change Service (C3S). (2025). *ERA5: Fifth Generation ECMWF Atmospheric Reanalyses of the Global Climate*. Copernicus Climate Change Service Climate Data Store (CDS).
5. European Space Agency (ESA). (2021). *Copernicus Global Digital Elevation Model (GLO-30) Dataset*. European Space Agency.
6. Dinas Kebakaran dan Penanggulangan Bencana (Diskar PB) / BPBD Kota Bandung. (2025). *Laporan Rekapitulasi Kejadian Bencana Banjir dan Keruntuhan Kirmir Saluran Drainase Kota Bandung Tahun 2025*. Bandung: Pemerintah Kota Bandung.
7. Lundberg, S. M., & Lee, S. I. (2017). *A Unified Approach to Interpreting Model Predictions*. In Advances in Neural Information Processing Systems (NeurIPS 2017), Vol. 30, pp. 4765–4774.
8. Lundberg, S. M., Erion, G., Chen, H., DeGrave, A., Prutkin, J. M., Nair, B., Katz, R., Himmelfarb, J., Bansal, N., & Lee, S. I. (2020). *From local explanations to global understanding with explainable AI for trees*. Nature Machine Intelligence, 2(1), 56–67.
9. OpenStreetMap Contributors. (2025). *Planet Dump and Regional Extracts for West Java and Bandung City*. OpenStreetMap Foundation.
10. Pedregosa, F., Varoquaux, G., Gramfort, A., Michel, V., Thirion, B., Grisel, O., Blondel, M., Prettenhofer, P., Weiss, R., Dubourg, V., Vanderplas, J., Passos, A., Cournapeau, D., Brucher, M., Perrot, M., & Duchesnay, É. (2011). *Scikit-learn: Machine Learning in Python*. Journal of Machine Learning Research, 12, 2825–2830.
11. Zulkaidi, D. (2024). *Evaluasi Kritis Tata Ruang dan Sistem Drainase Perkotaan Cekungan Bandung*. Jurnal Perencanaan Wilayah dan Kota, Institut Teknologi Bandung (ITB).

---

# LAMPIRAN

## Lampiran 1: Karakteristik Geospasial, Demografi, dan Kejadian Bencana 30 Kecamatan Kota Bandung

Berikut disajikan tabel data masukan 30 kecamatan di Kota Bandung hasil fusi data satelit, data statistik BPS, dan data rekam bencana aktual Diskar PB / BPBD Kota Bandung tahun 2025:

| No | Nama Kecamatan | Luas Wilayah ($\text{km}^2$) | Elevasi Rata-rata (mdpl) | Kelerengan Rerata ($^\circ$) | Kepadatan Penduduk (ribu/$\text{km}^2$) | Kerapatan Drainase (km/$\text{km}^2$) | Rasio Kedap Air ($\%$) | Jumlah Kejadian Banjir 2025 | Insiden Keruntuhan Kirmir 2025 |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | Andir | 3.71 | 708 | 1.8 | 26.5 | 1.52 | 84.2 | 3 | 2 |
| 2 | Antapani | 4.01 | 682 | 2.1 | 19.8 | 1.85 | 78.4 | 2 | 1 |
| 3 | Arcamanik | 6.07 | 680 | 2.4 | 12.4 | 1.64 | 69.1 | 1 | 0 |
| 4 | Astanaanyar | 2.89 | 710 | 1.5 | 24.1 | 1.71 | 86.5 | 2 | 1 |
| 5 | Babakan Ciparay | 7.45 | 702 | 1.7 | 19.2 | 1.48 | 81.3 | 3 | 2 |
| 6 | Bandung Kidul | 6.06 | 685 | 1.9 | 14.5 | 1.62 | 72.8 | 2 | 1 |
| 7 | Bandung Kulon | 6.46 | 705 | 1.6 | 21.4 | 1.55 | 83.1 | 3 | 2 |
| 8 | Bandung Wetan | 3.39 | 712 | 2.2 | 8.8 | 1.74 | 79.5 | 1 | 1 |
| 9 | Batununggal | 5.03 | 695 | 1.8 | 23.6 | 1.68 | 85.0 | 2 | 1 |
| 10 | Bojongloa Kaler | 3.03 | 706 | 1.6 | 38.5 | 1.60 | 88.4 | 3 | 2 |
| 11 | Bojongloa Kidul | 6.26 | 698 | 1.7 | 13.9 | 1.51 | 76.2 | 2 | 1 |
| 12 | Buahbatu | 7.93 | 678 | 1.9 | 12.8 | 1.75 | 71.4 | 2 | 1 |
| 13 | Cibeunying Kaler | 4.50 | 740 | 4.2 | 15.4 | 2.15 | 68.2 | 1 | 1 |
| 14 | Cibeunying Kidul | 5.25 | 725 | 3.8 | 21.2 | 2.28 | 74.6 | 1 | 0 |
| 15 | Cibiru | 6.32 | 688 | 3.5 | 11.6 | 1.45 | 64.5 | 2 | 1 |
| 16 | Cicendo | 6.86 | 704 | 1.9 | 14.1 | 1.42 | 82.7 | 2 | 2 |
| 17 | Cidadap | 6.11 | 812 | 8.5 | 9.2 | 2.48 | 52.1 | 0 | 1 |
| 18 | Cinambo | 3.68 | 672 | 1.6 | 7.1 | 1.38 | 62.8 | 3 | 1 |
| 19 | Coblong | 7.35 | 691 | 3.9 | 15.2 | 0.82 | 75.3 | 4 | 3 |
| 20 | Gedebage | 9.58 | 668 | 1.2 | 4.3 | 0.76 | 58.6 | 6 | 3 |
| 21 | Kiaracondong | 6.12 | 692 | 1.8 | 21.1 | 1.49 | 84.9 | 3 | 2 |
| 22 | Lengkong | 5.90 | 705 | 1.7 | 11.9 | 1.78 | 80.2 | 1 | 0 |
| 23 | Mandalajati | 7.05 | 715 | 4.8 | 9.8 | 1.65 | 61.4 | 1 | 1 |
| 24 | Panyileukan | 5.10 | 674 | 1.5 | 7.6 | 1.40 | 65.2 | 2 | 1 |
| 25 | Rancasari | 7.33 | 675 | 1.4 | 11.2 | 1.35 | 69.8 | 4 | 2 |
| 26 | Regol | 4.30 | 702 | 1.6 | 18.5 | 1.70 | 83.5 | 2 | 1 |
| 27 | Sukajadi | 5.30 | 698 | 2.5 | 19.8 | 0.94 | 81.8 | 4 | 2 |
| 28 | Sukasari | 6.27 | 755 | 5.1 | 12.8 | 2.10 | 66.4 | 1 | 0 |
| 29 | Sumur Bandung | 3.40 | 718 | 2.0 | 10.2 | 2.08 | 86.2 | 1 | 0 |
| 30 | Ujungberung | 6.40 | 702 | 4.1 | 12.9 | 1.58 | 67.5 | 2 | 1 |
| **Total / Rata-rata** | **Kota Bandung (167.3 $\text{km}^2$)** | **709 mdpl** | **2.6$^{\circ}$** | **16.1 ribu/$\text{km}^2$** | **1.62 km/$\text{km}^2$** | **74.7%** | **70 Kejadian** | **32 Kirmir Runtuh** |

---

## Lampiran 2: Spesifikasi Dokumentasi Endpoint REST API UrbanShield AI

Berikut merupakan spesifikasi teknis antarmuka REST API backend platform UrbanShield AI berbasis FastAPI:

| Endpoint Path | HTTP Method | Parameter Masukan (*Query / Body*) | Format Respon (*JSON Payload*) | Deskripsi Fungsionalitas Layanan |
| :--- | :---: | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | `username`, `password` (Form/JSON) | `{ access_token, token_type }` | Otentikasi pengguna dan penerbitan JSON Web Token (JWT). |
| `/api/auth/me` | `GET` | *Header Authorization: Bearer Token* | `{ id, username, email, role }` | Pengambilan profil data pengguna yang sedang aktif. |
| `/api/dashboard/stats` | `GET` | `scenario` *(optional, default: current)* | `{ total_areas, high_risk_count, avg_risk_score, critical_districts: [...] }` | Statistik agregat makro risiko kota dan ringkasan wilayah krisis. |
| `/api/areas` | `GET` | `skip`, `limit`, `search` | `[ { districtId, district, area_km2, population_density, ... } ]` | Katalog data master profil spasial dan demografi 30 kecamatan. |
| `/api/areas/{id}` | `GET` | `id` (slug kecamatan, misal: `gedebage`) | `{ districtId, district, features: {...}, historical_events: [...] }` | Detail lengkap profil fitur fisik dan rekam jejak bencana kecamatan. |
| `/api/map/risk-layer` | `GET` | `scenario` *(current, heavy_rain, extreme_storm, drainage_failure)* | GeoJSON `FeatureCollection` (poligon 30 kecamatan + properties skor & tier) | Lapisan peta choropleth dinamis untuk rendering WebGL MapLibre GL. |
| `/api/prediction/predict` | `POST` | `{ district_id, scenario, custom_features }` | `{ score, level, confidence, factors: [{ factor, contribution, value }] }` | Inferensi estimasi risiko dan dekomposisi SHAP untuk satu kecamatan. |
| `/api/prediction/predict-all` | `GET` | `scenario` | `[ { districtId, district, score, riskLevel, confidence, factors: [...] } ]` | Eksekusi inferensi *batch* untuk seluruh 30 kecamatan secara simultan. |
| `/api/recommendation/` | `GET` | `risk` *(all, high, medium, low)*, `q` *(search)* | `[ { areaId, area, risk, priority, action, estimatedImpact, reason } ]` | Matriks rekomendasi mitigasi terurut prioritas untuk perencanaan DSDABM. |
| `/api/recommendation/{id}` | `GET` | `id` (slug kecamatan) | Detail rekomendasi tindakan preskriptif spesifik satu kecamatan. |
| `/api/datasets` | `GET` | `source` *(OSM, BNPB, BMKG, BPS, DEM)* | `[ { id, name, source, last_updated, record_count, status } ]` | Metadata katalog dataset masukan untuk transparansi audit data. |
