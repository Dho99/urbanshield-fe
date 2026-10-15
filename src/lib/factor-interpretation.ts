/** Interpretasi faktor risiko berbasis arah pengaruh model (positif/negatif). */

const INTERPRETATIONS: Array<{ match: string[]; text: (value: string) => string }> = [
  {
    match: ["effective drainage", "kapasitas drainase"],
    text: (v) => `Kapasitas drainase teramati ${v}. Nilai rendah meningkatkan kemungkinan genangan saat hujan ekstrem karena air tidak tersalurkan.`,
  },
  {
    match: ["drainage density", "kerapatan drainase", "drainase"],
    text: (v) => `Kerapatan drainase ${v}. Jaringan saluran yang jarang membuat limpasan terkonsentrasi di sedikit titik.`,
  },
  {
    match: ["population", "penduduk"],
    text: (v) => `Kepadatan penduduk ${v}. Semakin padat, semakin besar potensi dampak terhadap jiwa dan properti bila banjir terjadi.`,
  },
  {
    match: ["rainfall", "hujan", "curah"],
    text: (v) => `Intensitas hujan ${v}. Beban hidrologi utama — pemicu langsung kenaikan skor risiko.`,
  },
  {
    match: ["elevation", "elevasi"],
    text: (v) => `Elevasi ${v}. Wilayah rendah/cekungan menampung aliran dari daerah lebih tinggi.`,
  },
  {
    match: ["slope", "lereng"],
    text: (v) => `Kelerengan ${v}. Lereng datar memperlambat aliran sehingga air menggenang lebih lama.`,
  },
  {
    match: ["basin", "cekungan", "depresi"],
    text: (v) => `Indeks depresi cekungan ${v}. Topografi cekung menahan air dan memperpanjang genangan.`,
  },
  {
    match: ["river", "sungai"],
    text: (v) => `Kerapatan sungai ${v}. Jaringan sungai padat rawan meluap saat debit puncak.`,
  },
  {
    match: ["road", "jalan"],
    text: (v) => `Kerapatan jalan ${v}. Permukaan kedap mempercepat limpasan ke saluran.`,
  },
  {
    match: ["building", "bangunan"],
    text: (v) => `Kepadatan bangunan ${v}. Area terbangun mengurangi resapan alami.`,
  },
  {
    match: ["impervious", "kedap"],
    text: (v) => `Rasio kedap air ${v}. Limpasan permukaan dominan karena air tidak meresap.`,
  },
  {
    match: ["green", "hijau", "resapan", "infiltrat"],
    text: (v) => `Area hijau ${v}. Resapan alami tidak mencukupi untuk menyerap limpasan.`,
  },
  {
    match: ["water", "badan air"],
    text: (v) => `Rasio badan air ${v}. Kapasitas tampung perairan terbatas saat debit tinggi.`,
  },
  {
    match: ["facility", "fasilitas"],
    text: (v) => `Kepadatan fasilitas kritis ${v}. Aset vital (RS, sekolah, posko) terpapar langsung.`,
  },
];

export function interpretFactor(factor: string, value: string): string {
  const name = factor.toLowerCase();
  const hit = INTERPRETATIONS.find((i) => i.match.some((m) => name.includes(m)));
  if (hit) return hit.text(value);
  return `${factor} teramati ${value} dan berkontribusi terhadap skor risiko wilayah ini.`;
}
